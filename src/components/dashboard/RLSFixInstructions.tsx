import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function RLSFixInstructions() {
  const [copied, setCopied] = useState(false);

  const rlsScript = `-- ========================================
-- CONFIGURACIÓN DE ROW LEVEL SECURITY (RLS)
-- PARA CIUDAD VIBES DASHBOARD
-- ========================================

-- 1. HABILITAR RLS EN LAS TABLAS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 2. CREAR POLÍTICAS PARA POSTS
-- Política que permite leer todos los posts (sin límite de filas)
CREATE POLICY "Allow unlimited posts read" ON posts
FOR SELECT USING (true);

-- Política que permite insertar posts
CREATE POLICY "Allow posts insert" ON posts
FOR INSERT WITH CHECK (true);

-- Política que permite actualizar posts
CREATE POLICY "Allow posts update" ON posts
FOR UPDATE USING (true);

-- Política que permite eliminar posts
CREATE POLICY "Allow posts delete" ON posts
FOR DELETE USING (true);

-- 3. CREAR POLÍTICAS PARA COMMENTS
-- Política que permite leer todos los comentarios (sin límite de filas)
CREATE POLICY "Allow unlimited comments read" ON comments
FOR SELECT USING (true);

-- Política que permite insertar comentarios
CREATE POLICY "Allow comments insert" ON comments
FOR INSERT WITH CHECK (true);

-- Política que permite actualizar comentarios
CREATE POLICY "Allow comments update" ON comments
FOR UPDATE USING (true);

-- Política que permite eliminar comentarios
CREATE POLICY "Allow comments delete" ON comments
FOR DELETE USING (true);

-- 4. VERIFICAR CONFIGURACIÓN
-- Mostrar el estado de RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('posts', 'comments');

-- Mostrar las políticas creadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('posts', 'comments');`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(rlsScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-800">Problema Detectado: RLS Activado</AlertTitle>
        <AlertDescription className="text-orange-700">
          Row Level Security (RLS) está habilitado en Supabase pero las políticas no están configuradas correctamente. 
          Esto está bloqueando el acceso a los datos.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Solución: Configurar Políticas RLS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Pasos para resolver:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Ve a tu <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Dashboard de Supabase</a></li>
              <li>Selecciona tu proyecto</li>
              <li>Ve a <strong>SQL Editor</strong> en el menú lateral</li>
              <li>Copia el script SQL de abajo</li>
              <li>Pega y ejecuta el script en el SQL Editor</li>
              <li>Verifica que las políticas se crearon correctamente</li>
            </ol>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Script SQL para ejecutar:</h4>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <Copy className="h-4 w-4 mr-1" />
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>
            
            <div className="relative">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto">
                <code>{rlsScript}</code>
              </pre>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Ir a Supabase Dashboard
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://supabase.com/docs/guides/auth/row-level-security" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Documentación RLS
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Verificación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>Después de ejecutar el script, deberías ver:</p>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline" className="justify-start">
                ✅ posts: rowsecurity = true
              </Badge>
              <Badge variant="outline" className="justify-start">
                ✅ comments: rowsecurity = true
              </Badge>
              <Badge variant="outline" className="justify-start">
                ✅ 4 políticas en posts
              </Badge>
              <Badge variant="outline" className="justify-start">
                ✅ 4 políticas en comments
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
