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

export function useDashboardData(filters: DashboardFilters) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function fetchData() {
      try {
        console.log('🔄 useEffect ejecutándose - loading:', loading, 'isInitialLoad:', isInitialLoad);
        
        // Solo mostrar loading completo en la carga inicial
        if (isInitialLoad) {
          setLoading(true);
        } else {
          // Para actualizaciones de filtros, mostrar loading sutil
          setLoading(true);
        }
        setError(null);

        console.log('🚀 Iniciando fetch de datos...');

        // Obtener posts primero
        console.log('📥 Ejecutando consulta de posts...');
        let postsQuery = supabase.from('posts').select('*');
        
        // Aplicar filtros de fecha si están definidos
        if (filters.dateMode === 'annual') {
          postsQuery = postsQuery.gte('p_time', `${filters.year}-01-01T00:00:00.000Z`).lte('p_time', `${filters.year}-12-31T23:59:59.999Z`);
        } else if (filters.dateMode === 'monthly') {
          postsQuery = postsQuery.gte('p_time', `${filters.year}-${filters.month}-01T00:00:00.000Z`).lte('p_time', `${filters.year}-${filters.month}-${new Date(filters.year, filters.month, 0).getDate()}T23:59:59.999Z`);
        }

        // Aplicar filtro de categoría si no es "all"
        if (filters.theme !== 'all' && filters.theme !== '') {
          postsQuery = postsQuery.eq('p_category', filters.theme);
          console.log('📂 Filtro de categoría aplicado a posts:', filters.theme);
        }

        const postsResult = await postsQuery;
        if (postsResult.error) throw postsResult.error;
        let posts = postsResult.data || [];

        // Obtener comentarios con paginación manual y filtros
        console.log('📥 Obteniendo comentarios con paginación y filtros...');
        let allComments: Comment[] = [];
        let offset = 0;
        const batchSize = 1000;
        let hasMore = true;

        // Si hay filtro de categoría, obtener los p_id de los posts de esa categoría
        let postIds: string[] = [];
        if (filters.theme !== 'all' && filters.theme !== '') {
          postIds = posts.map(post => post.p_id).filter(Boolean);
          console.log('📂 Filtro de categoría para comentarios - Post IDs:', postIds.length);
        }

        while (hasMore) {
          let batchQuery = supabase
            .from('comments')
            .select('*')
            .range(offset, offset + batchSize - 1);

          // Aplicar filtros de fecha si están definidos
          if (filters.dateMode === 'annual') {
            batchQuery = batchQuery.gte('c_time', `${filters.year}-01-01T00:00:00.000Z`).lte('c_time', `${filters.year}-12-31T23:59:59.999Z`);
          } else if (filters.dateMode === 'monthly') {
            batchQuery = batchQuery.gte('c_time', `${filters.year}-${filters.month}-01T00:00:00.000Z`).lte('c_time', `${filters.year}-${filters.month}-${new Date(filters.year, filters.month, 0).getDate()}T23:59:59.999Z`);
          }

          // Aplicar filtro de categoría si no es "all"
          if (filters.theme !== 'all' && filters.theme !== '' && postIds.length > 0) {
            batchQuery = batchQuery.in('p_id', postIds);
            console.log('📂 Filtro de categoría aplicado a comentarios:', filters.theme);
          }

          // Aplicar filtros de sentimiento si no es "all"
          if (filters.sentiment !== 'all') {
            const sentimentMap: { [key: string]: string } = {
              'positive': 'Positiva',
              'negative': 'Negativa',
              'neutral': 'Neutral'
            };
            const spanishSentiment = sentimentMap[filters.sentiment] || filters.sentiment;
            batchQuery = batchQuery.eq('c_clasificacion', spanishSentiment);
          }

          const { data: batchComments, error: batchError } = await batchQuery;
          if (batchError) throw batchError;
          
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

        let comments = allComments;

        console.log(`📊 Posts obtenidos: ${posts.length}`);
        console.log(`📊 Comentarios obtenidos: ${comments.length}`);

        // Debug: mostrar información de datos obtenidos
        console.log('=== DEBUG DATOS SUPABASE ===');
        console.log('Posts obtenidos:', posts.length);
        console.log('Comentarios obtenidos:', comments.length);
        console.log('===========================');

        // Mapear sentimientos en español a inglés para compatibilidad
        const mapSentiment = (sentiment: string | null): string => {
          if (!sentiment) return 'neutral';
          switch (sentiment) {
            case 'Positiva': return 'positive';
            case 'Negativa': return 'negative';
            case 'Neutral': return 'neutral';
            default: return 'neutral';
          }
        };

        // Calcular distribución de sentimientos
        const sentimentDistribution = {
          positive: 0,
          negative: 0,
          neutral: 0
        };

        comments.forEach(comment => {
          const mappedSentiment = mapSentiment(comment.c_clasificacion);
          sentimentDistribution[mappedSentiment as keyof typeof sentimentDistribution]++;
        });

        console.log('=== DISTRIBUCIÓN DE SENTIMIENTOS ===');
        console.log('Original (español):', {
          Positiva: comments.filter(c => c.c_clasificacion === 'Positiva').length,
          Negativa: comments.filter(c => c.c_clasificacion === 'Negativa').length,
          Neutral: comments.filter(c => c.c_clasificacion === 'Neutral').length
        });
        console.log('Mapeado (inglés):', sentimentDistribution);
        console.log('=====================================');

        // Calcular métricas
        const totalPosts = posts.length;
        const totalComments = comments.length;
        const totalLikes = posts.reduce((sum, post) => sum + post.p_likes, 0);
        const totalEngagement = totalLikes + totalComments;

        // Distribución de plataformas
        const platformDistribution = posts.reduce((acc, post) => {
          const platform = post.p_platform || 'unknown';
          acc[platform] = (acc[platform] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        // Distribución de categorías basada en p_category
        const categoryDistribution = posts.reduce((acc, post) => {
          const category = post.p_category || 'Sin categoría';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        // Datos de series temporales (últimos 30 días)
        const timeSeriesData = generateTimeSeriesData(posts, comments, filters.dateMode);

        console.log('🎯 Configurando datos finales...');
        setData({
          posts,
          comments,
          totalPosts,
          totalComments,
          totalLikes,
          totalEngagement,
          sentimentDistribution,
          platformDistribution,
          categoryDistribution,
          timeSeriesData,
        });

        console.log('✅ Datos configurados exitosamente - loading:', loading, 'isInitialLoad:', isInitialLoad);
        
        // Marcar que ya no es la carga inicial
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);

      }
    }

    fetchData();
  }, [filters]);

  return { data, loading, error, isInitialLoad };
}

function generateTimeSeriesData(posts: Post[], comments: Comment[], dateMode: 'annual' | 'monthly') {
  // Si no hay datos, retornar array vacío
  if (posts.length === 0 && comments.length === 0) {
    return [];
  }

  // Obtener el rango de fechas real de los datos
  let earliestDate = new Date();
  let latestDate = new Date(0);

  // Encontrar la fecha más temprana y más tardía en posts
  posts.forEach(post => {
    try {
      const postDate = new Date(post.p_time);
      if (postDate < earliestDate) earliestDate = postDate;
      if (postDate > latestDate) latestDate = postDate;
    } catch (e) {
      console.warn('Error parsing post date:', post.p_time);
    }
  });

  // Encontrar la fecha más temprana y más tardía en comentarios
  comments.forEach(comment => {
    try {
      const commentDate = new Date(comment.c_time);
      if (commentDate < earliestDate) earliestDate = commentDate;
      if (commentDate > latestDate) latestDate = commentDate;
    } catch (e) {
      console.warn('Error parsing comment date:', comment.c_time);
    }
  });

  // Si no hay fechas válidas, usar último mes
  if (earliestDate >= latestDate) {
    latestDate = new Date();
    earliestDate = new Date();
    earliestDate.setMonth(earliestDate.getMonth() - 1);
  }

  const data = [];
  
  if (dateMode === 'annual') {
    // Para filtro anual: mostrar datos mensuales
    const startYear = earliestDate.getFullYear();
    const endYear = latestDate.getFullYear();
    
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month < 12; month++) {
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0);
        
        // Solo incluir meses que tengan datos
        if (monthStart <= latestDate && monthEnd >= earliestDate) {
          const monthStr = monthStart.toISOString().substring(0, 7); // YYYY-MM
          
          // Contar comentarios por sentimiento en este mes
          const monthComments = comments.filter(comment => {
            const commentDate = new Date(comment.c_time);
            return commentDate.getFullYear() === year && commentDate.getMonth() === month;
          });

          const positiveComments = monthComments.filter(comment => 
            comment.c_clasificacion === 'Positiva'
          ).length;

          const negativeComments = monthComments.filter(comment => 
            comment.c_clasificacion === 'Negativa'
          ).length;

          const neutralComments = monthComments.filter(comment => 
            comment.c_clasificacion === 'Neutral'
          ).length;

          // Solo incluir meses con datos
          if (positiveComments > 0 || negativeComments > 0 || neutralComments > 0) {
            const monthNames = [
              'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
              'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
            ];
            
            data.push({
              date: `${monthNames[month]} ${year}`,
              positive: positiveComments,
              negative: negativeComments,
              neutral: neutralComments,
            });
          }
        }
      }
    }
  } else {
    // Para filtro mensual: mostrar datos diarios (máximo 30 días)
    const daysDiff = Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24));
    const maxDays = 30;
    const daysToShow = Math.min(daysDiff, maxDays);
    
    for (let i = 0; i < daysToShow; i++) {
      const currentDate = new Date(earliestDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      // Contar comentarios por sentimiento en este día
      const dayComments = comments.filter(comment => 
        comment.c_time.startsWith(dateStr)
      );

      const positiveComments = dayComments.filter(comment => 
        comment.c_clasificacion === 'Positiva'
      ).length;

      const negativeComments = dayComments.filter(comment => 
        comment.c_clasificacion === 'Negativa'
      ).length;

      const neutralComments = dayComments.filter(comment => 
        comment.c_clasificacion === 'Neutral'
      ).length;

      data.push({
        date: `${currentDate.getDate()}/${currentDate.getMonth() + 1}`,
        positive: positiveComments,
        negative: negativeComments,
        neutral: neutralComments,
      });
    }
  }

  return data;
}
