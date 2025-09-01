import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  value: string;
  label: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📂 Obteniendo categorías únicas de la base de datos...');
      
      const { data: posts, error: fetchError } = await supabase
        .from('posts')
        .select('p_category')
        .not('p_category', 'is', null);

      if (fetchError) {
        throw fetchError;
      }

      // Extraer categorías únicas y crear opciones
      const uniqueCategories = Array.from(
        new Set(posts?.map(post => post.p_category).filter(Boolean) || [])
      );

      const categoryOptions: Category[] = [
        { value: 'all', label: 'Todas las categorías' },
        ...uniqueCategories.map(category => ({
          value: category,
          label: category
        }))
      ];

      console.log('📂 Categorías únicas encontradas:', uniqueCategories);
      console.log('📂 Opciones de categorías:', categoryOptions);

      setCategories(categoryOptions);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error obteniendo categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch: fetchCategories };
}
