import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import type { DashboardData } from "@/hooks/use-dashboard-data";

interface DebugPanelProps {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

export function DebugPanel({ data, loading, error }: DebugPanelProps) {
  const [connectionStatus, setConnectionStatus] = useState<string>('Verificando...');
  const [tableCounts, setTableCounts] = useState<{ posts: number; comments: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    async function checkConnection() {
      try {
        // Verificar conexión básica
        const { data: testData, error: testError } = await supabase
          .from('posts')
          .select('count')
          .limit(1);

        if (testError) {
          setConnectionStatus(`Error: ${testError.message}`);
        } else {
          setConnectionStatus('Conectado ✅');
        }

        // Obtener conteos de tablas
        const [postsResult, commentsResult] = await Promise.all([
          supabase.from('posts').select('*', { count: 'exact', head: true }),
          supabase.from('comments').select('*', { count: 'exact', head: true })
        ]);

        setTableCounts({
          posts: postsResult.count || 0,
          comments: commentsResult.count || 0
        });

      } catch (err) {
        setConnectionStatus(`Error de conexión: ${err instanceof Error ? err.message : 'Desconocido'}`);
      }
    }

    checkConnection();
  }, []);

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          🐛 Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-y-auto">
      <Card className="bg-background/95 backdrop-blur-sm border-2 border-orange-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">🐛 Panel de Debug</CardTitle>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* Estado de conexión */}
          <div>
            <strong>Estado de conexión:</strong>
            <div className={`mt-1 p-1 rounded ${connectionStatus.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {connectionStatus}
            </div>
          </div>

          {/* Conteos de tablas */}
          <div>
            <strong>Datos en Supabase:</strong>
            <div className="mt-1 space-y-1">
              <div>Posts: {tableCounts?.posts || 'Cargando...'}</div>
              <div>Comentarios: {tableCounts?.comments || 'Cargando...'}</div>
            </div>
          </div>

          {/* Estado del hook */}
          <div>
            <strong>Estado del hook:</strong>
            <div className="mt-1 space-y-1">
              <div>Loading: {loading ? 'Sí' : 'No'}</div>
              <div>Error: {error || 'Ninguno'}</div>
              <div>Data: {data ? 'Disponible' : 'No disponible'}</div>
            </div>
          </div>

          {/* Datos cargados */}
          {data && (
            <div>
              <strong>Datos cargados:</strong>
              <div className="mt-1 space-y-1">
                <div>Posts: {data.posts.length}</div>
                <div>Comentarios: {data.comments.length}</div>
                <div>Total Posts: {data.totalPosts}</div>
                <div>Total Comments: {data.totalComments}</div>
                <div>Total Likes: {data.totalLikes}</div>
                <div>Sentimientos: P({data.sentimentDistribution.positive}) N({data.sentimentDistribution.negative}) Neu({data.sentimentDistribution.neutral})</div>
              </div>
            </div>
          )}

          {/* Botón para recargar */}
          <Button
            onClick={() => window.location.reload()}
            size="sm"
            className="w-full"
          >
            🔄 Recargar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
