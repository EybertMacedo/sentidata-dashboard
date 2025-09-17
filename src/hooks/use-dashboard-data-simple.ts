import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];

export interface DashboardFilters {
  dateMode: 'annual' | 'monthly';
  year: number;
  month: number;
  theme: string;
  sentiment: string;
}

export interface DashboardData {
  posts: Post[];
  comments: Comment[];
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalEngagement: number;
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  platformDistribution: {
    [key: string]: number;
  };
  timeSeriesData: {
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }[];
}

export function useDashboardDataSimple(filters: DashboardFilters) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('🔄 Hook simple ejecutándose...');
        setLoading(true);
        setError(null);

        // Obtener posts sin filtros de fecha para simplificar
        console.log('📥 Obteniendo posts...');
        const { data: posts, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .limit(100); // Limitar a 100 posts para la prueba

        if (postsError) {
          console.error('❌ Error obteniendo posts:', postsError);
          if (postsError.message.includes('RLS') || postsError.message.includes('policy')) {
            throw new Error(`Error de RLS en posts: ${postsError.message}. Necesitas configurar las políticas de RLS en Supabase.`);
          }
          throw postsError;
        }

        console.log(`📊 Posts obtenidos: ${posts?.length || 0}`);

        // Obtener comentarios sin filtros para simplificar
        console.log('📥 Obteniendo comentarios...');
        const { data: comments, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .limit(100); // Limitar a 100 comentarios para la prueba

        if (commentsError) {
          console.error('❌ Error obteniendo comments:', commentsError);
          if (commentsError.message.includes('RLS') || commentsError.message.includes('policy')) {
            throw new Error(`Error de RLS en comments: ${commentsError.message}. Necesitas configurar las políticas de RLS en Supabase.`);
          }
          throw commentsError;
        }

        console.log(`📊 Comentarios obtenidos: ${comments?.length || 0}`);

        // Si no hay datos, mostrar datos vacíos
        if ((!posts || posts.length === 0) && (!comments || comments.length === 0)) {
          console.log('⚠️ No hay datos en la base de datos');
          
          setData({
            posts: [],
            comments: [],
            totalPosts: 0,
            totalComments: 0,
            totalLikes: 0,
            totalEngagement: 0,
            sentimentDistribution: {
              positive: 0,
              negative: 0,
              neutral: 0
            },
            platformDistribution: {},
            timeSeriesData: []
          });
          return;
        }

        // Normalización de sentimiento y distribución
        const normalizeToSpanish = (raw: string | null): 'Positiva' | 'Negativa' | 'Neutral' => {
          if (!raw) return 'Neutral';
          const value = String(raw)
            .normalize('NFD').replace(/\p{Diacritic}/gu, '')
            .trim().toLowerCase();
          if (['positiva', 'positivo', 'positive', 'pos', 'posi', '+'].includes(value)) return 'Positiva';
          if (['negativa', 'negativo', 'negative', 'neg', '-'].includes(value)) return 'Negativa';
          if (['neutral', 'neutro', 'neu', 'mixed', 'mixto'].includes(value)) return 'Neutral';
          return 'Neutral';
        };

        const normalizeToEnglish = (raw: string | null): 'positive' | 'negative' | 'neutral' => {
          const es = normalizeToSpanish(raw);
          return es === 'Positiva' ? 'positive' : es === 'Negativa' ? 'negative' : 'neutral';
        };

        // Calcular distribución de sentimientos
        const sentimentDistribution = {
          positive: 0,
          negative: 0,
          neutral: 0
        };

        comments?.forEach(comment => {
          const mapped = normalizeToEnglish(comment.c_clasificacion);
          sentimentDistribution[mapped as keyof typeof sentimentDistribution]++;
        });

        // Calcular métricas básicas
        const totalPosts = posts?.length || 0;
        const totalComments = comments?.length || 0;
        const totalLikes = posts?.reduce((sum, post) => sum + post.p_likes, 0) || 0;
        const totalEngagement = totalLikes + totalComments;

        // Distribución de plataformas
        const platformDistribution = posts?.reduce((acc, post) => {
          const platform = post.p_platform || 'unknown';
          acc[platform] = (acc[platform] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number }) || {};

        console.log('🎯 Configurando datos finales...');
        setData({
          posts: posts || [],
          comments: comments || [],
          totalPosts,
          totalComments,
          totalLikes,
          totalEngagement,
          sentimentDistribution,
          platformDistribution,
          timeSeriesData: [] // Simplificar por ahora
        });

        console.log('✅ Datos configurados exitosamente');

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        console.error('❌ Error en hook simple:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filters]);

  return { data, loading, error };
}
