import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from './use-auth';

type Post = Database['public']['Tables']['posts_v2']['Row'];
type Comment = Database['public']['Tables']['comments_v2']['Row'];

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
  categoryDistribution: {
    [key: string]: number;
  };
  timeSeriesData: {
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }[];
}

// Función para obtener las categorías disponibles
export async function getAvailableCategories(): Promise<string[]> {
  try {
    const { data: posts, error } = await supabase
      .from('posts_v2')
      .select('p_category')
      .not('p_category', 'is', null);

    if (error) {
      console.error('Error obteniendo categorías:', error);
      return [];
    }

    // Extraer categorías únicas
    const categories = Array.from(new Set(posts?.map(post => post.p_category).filter(Boolean) || []));
    console.log('📂 Categorías disponibles:', categories);
    return categories;
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    return [];
  }
}

export function useDashboardDataAuth(filters: DashboardFilters) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // Solo cargar datos si el usuario está autenticado
    if (authLoading) {
      return; // Esperar a que se complete la verificación de autenticación
    }

    if (!isAuthenticated || !user) {
      setError('Usuario no autenticado. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    fetchData();
  }, [filters, isAuthenticated, user, authLoading]);

  const fetchData = async () => {
    try {
      console.log('🔄 Hook con autenticación ejecutándose...');
      console.log('👤 Usuario autenticado:', user?.email);
      
      setLoading(true);
      setError(null);

      // Verificar que el usuario sigue autenticado
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !currentUser) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }

      // Aplicar filtros de fecha
      console.log('📅 Aplicando filtros de fecha:', filters);
      
      // Calcular fechas de inicio y fin basadas en los filtros
      const getDateRange = () => {
        const { dateMode, year, month } = filters;
        
        if (dateMode === 'annual') {
          // Filtro anual: todo el año
          const startDate = new Date(year, 0, 1); // 1 de enero
          const endDate = new Date(year, 11, 31, 23, 59, 59); // 31 de diciembre
          return { startDate, endDate };
        } else {
          // Filtro mensual: mes específico
          const startDate = new Date(year, month - 1, 1); // Primer día del mes
          const endDate = new Date(year, month, 0, 23, 59, 59); // Último día del mes
          return { startDate, endDate };
        }
      };

      const { startDate, endDate } = getDateRange();
      console.log('📅 Rango de fechas:', { 
        startDate: startDate.toISOString(), 
        endDate: endDate.toISOString(),
        mode: filters.dateMode,
        year: filters.year,
        month: filters.month
      });

      // Obtener posts con filtros de fecha y categoría
      console.log('📥 Obteniendo posts con filtros de fecha y categoría...');
      let postsQuery = supabase
        .from('posts_v2')
        .select('*')
        .gte('p_time', startDate.toISOString())
        .lte('p_time', endDate.toISOString());

      // Aplicar filtro de categoría si no es "all"
      if (filters.theme !== 'all' && filters.theme !== '') {
        postsQuery = postsQuery.eq('p_category', filters.theme);
        console.log('📂 Filtro de categoría aplicado:', filters.theme);
      }

      const { data: posts, error: postsError } = await postsQuery;

      if (postsError) {
        console.error('❌ Error obteniendo posts:', postsError);
        if (postsError.message.includes('RLS') || postsError.message.includes('policy')) {
          throw new Error(`Error de RLS en posts: ${postsError.message}. Verifica las políticas de RLS.`);
        }
        throw postsError;
      }

      console.log(`📊 Posts obtenidos: ${posts?.length || 0}`);

      // Obtener comentarios con filtros de fecha, categoría y paginación
      console.log('📥 Obteniendo comentarios con filtros de fecha, categoría y paginación...');
      let allComments: Comment[] = [];
      let offset = 0;
      const batchSize = 1000;
      let hasMore = true;

      // Si hay filtro de categoría, obtener los p_id de los posts de esa categoría
      let postIds: string[] = [];
      if (filters.theme !== 'all' && filters.theme !== '') {
        postIds = posts?.map(post => post.p_id).filter(Boolean) || [];
        console.log('📂 Filtro de categoría para comentarios - Post IDs:', postIds.length);
      }

      while (hasMore) {
        let commentsQuery = supabase
          .from('comments_v2')
          .select('*')
          .gte('c_time', startDate.toISOString())
          .lte('c_time', endDate.toISOString())
          .range(offset, offset + batchSize - 1);

        // Aplicar filtro de categoría si no es "all"
        if (filters.theme !== 'all' && filters.theme !== '' && postIds.length > 0) {
          commentsQuery = commentsQuery.in('p_id', postIds);
          console.log('📂 Filtro de categoría aplicado a comentarios:', filters.theme);
        }

        const { data: batchComments, error: batchError } = await commentsQuery;

        if (batchError) {
          console.error('❌ Error obteniendo comments:', batchError);
          if (batchError.message.includes('RLS') || batchError.message.includes('policy')) {
            throw new Error(`Error de RLS en comments: ${batchError.message}. Verifica las políticas de RLS.`);
          }
          throw batchError;
        }

        if (batchComments && batchComments.length > 0) {
          allComments = [...allComments, ...batchComments];
          offset += batchSize;
          console.log(`📦 Lote obtenido: ${batchComments.length} comentarios (total: ${allComments.length})`);
          
          // Si obtenemos menos del tamaño del lote, hemos terminado
          if (batchComments.length < batchSize) {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      const comments = allComments;
      console.log(`📊 Comentarios obtenidos: ${comments?.length || 0}`);
      console.log(`📊 Resumen de filtros aplicados:`, {
        posts: posts?.length || 0,
        comments: comments?.length || 0,
        dateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        filters: filters
      });

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
          categoryDistribution: {},
          timeSeriesData: []
        });
        return;
      }

      // Utilidades de normalización de sentimiento
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

      // Distribución de categorías basada en p_category
      const categoryDistribution = posts?.reduce((acc, post) => {
        const category = post.p_category || 'Sin categoría';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }) || {};
      
      console.log('📂 Distribución de categorías generada:', categoryDistribution);

      // Generar datos de series temporales
      const generateTimeSeriesData = () => {
        if (!comments || comments.length === 0) {
          return [];
        }

        // Agrupar comentarios por fecha
        const commentsByDate = comments.reduce((acc, comment) => {
          const date = new Date(comment.c_time);
          const dateKey = `${date.getDate()}/${date.getMonth() + 1}`;
          
          if (!acc[dateKey]) {
            acc[dateKey] = { positive: 0, negative: 0, neutral: 0 };
          }
          
          const mapped = normalizeToEnglish(comment.c_clasificacion);
          acc[dateKey][mapped]++;
          
          return acc;
        }, {} as { [key: string]: { positive: number; negative: number; neutral: number } });

        // Convertir a array y ordenar por fecha
        const timeSeriesData = Object.entries(commentsByDate)
          .map(([date, counts]) => ({
            date,
            positive: counts.positive,
            negative: counts.negative,
            neutral: counts.neutral
          }))
          .sort((a, b) => {
            const [dayA, monthA] = a.date.split('/').map(Number);
            const [dayB, monthB] = b.date.split('/').map(Number);
            return (monthA - monthB) || (dayA - dayB);
          })
          .slice(0, 30); // Limitar a los últimos 30 días

        return timeSeriesData;
      };

      const timeSeriesData = generateTimeSeriesData();
      console.log('📈 Datos de series temporales generados:', timeSeriesData.length, 'períodos');

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
        categoryDistribution,
        timeSeriesData
      });

      console.log('✅ Datos configurados exitosamente con autenticación');

    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error en hook con autenticación:', err);
    } finally {
      setLoading(false);
    }
  };

  return { 
    data, 
    loading: loading || authLoading, 
    error,
    isAuthenticated,
    user 
  };
}
