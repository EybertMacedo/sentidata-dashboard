import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

interface DataTestProps {
  onRLSError?: () => void;
}

export function DataTest({ onRLSError }: DataTestProps) {
  const [testData, setTestData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧪 Iniciando prueba de conexión...');
      
      // Prueba 1: Conteo básico de posts
      const { data: postsCount, error: postsError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });
      
      console.log('📊 Resultado posts:', { data: postsCount, error: postsError });
      
              if (postsError) {
          console.error('❌ Error en posts:', postsError);
          // Si es error de RLS, mostrar información específica
          if (postsError.message.includes('RLS') || postsError.message.includes('policy')) {
            onRLSError?.();
            throw new Error(`Error de RLS en posts: ${postsError.message}. Necesitas ejecutar las políticas de RLS en Supabase.`);
          }
          throw new Error(`Error en posts: ${postsError.message}`);
        }
      
      // Prueba 2: Conteo básico de comentarios
      const { data: commentsCount, error: commentsError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true });
      
      console.log('📊 Resultado comments:', { data: commentsCount, error: commentsError });
      
              if (commentsError) {
          console.error('❌ Error en comments:', commentsError);
          // Si es error de RLS, mostrar información específica
          if (commentsError.message.includes('RLS') || commentsError.message.includes('policy')) {
            onRLSError?.();
            throw new Error(`Error de RLS en comments: ${commentsError.message}. Necesitas ejecutar las políticas de RLS en Supabase.`);
          }
          throw new Error(`Error en comments: ${commentsError.message}`);
        }
      
      // Prueba 3: Obtener algunos posts de ejemplo
      const { data: samplePosts, error: samplePostsError } = await supabase
        .from('posts')
        .select('*')
        .limit(3);
      
      if (samplePostsError) {
        throw new Error(`Error obteniendo posts de ejemplo: ${samplePostsError.message}`);
      }
      
      // Prueba 4: Obtener algunos comentarios de ejemplo
      const { data: sampleComments, error: sampleCommentsError } = await supabase
        .from('comments')
        .select('*')
        .limit(3);
      
      if (sampleCommentsError) {
        throw new Error(`Error obteniendo comentarios de ejemplo: ${sampleCommentsError.message}`);
      }
      
      setTestData({
        postsCount: postsCount.count || 0,
        commentsCount: commentsCount.count || 0,
        samplePosts,
        sampleComments
      });
      
      console.log('✅ Prueba completada exitosamente');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error en prueba:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Prueba de Conexión a Supabase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Probando...' : 'Ejecutar Prueba'}
        </Button>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {testData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-100 border border-green-300 rounded">
                <div className="text-lg font-bold text-green-800">{testData.postsCount}</div>
                <div className="text-sm text-green-600">Posts totales</div>
              </div>
              <div className="p-3 bg-blue-100 border border-blue-300 rounded">
                <div className="text-lg font-bold text-blue-800">{testData.commentsCount}</div>
                <div className="text-sm text-blue-600">Comentarios totales</div>
              </div>
            </div>
            
            {testData.samplePosts && testData.samplePosts.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Posts de ejemplo:</h4>
                <div className="space-y-2">
                  {testData.samplePosts.map((post: any, index: number) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      <div><strong>ID:</strong> {post.p_id}</div>
                      <div><strong>Plataforma:</strong> {post.p_platform || 'N/A'}</div>
                      <div><strong>Likes:</strong> {post.p_likes}</div>
                      <div><strong>Comentarios:</strong> {post.p_comments}</div>
                      <div><strong>Fecha:</strong> {new Date(post.p_time).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {testData.sampleComments && testData.sampleComments.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Comentarios de ejemplo:</h4>
                <div className="space-y-2">
                  {testData.sampleComments.map((comment: any, index: number) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      <div><strong>ID:</strong> {comment.c_id}</div>
                      <div><strong>Clasificación:</strong> {comment.c_clasificacion || 'N/A'}</div>
                      <div><strong>Likes:</strong> {comment.c_likes}</div>
                      <div><strong>Fecha:</strong> {new Date(comment.c_time).toLocaleDateString()}</div>
                      <div><strong>Texto:</strong> {comment.c_text ? comment.c_text.substring(0, 100) + '...' : 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
