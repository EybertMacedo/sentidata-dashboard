import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertTriangle, Loader2, LogIn, LogOut } from "lucide-react";

interface AuthLoginProps {
  onAuthSuccess?: () => void;
}

export function AuthLogin({ onAuthSuccess }: AuthLoginProps) {
  const [email, setEmail] = useState('santiagozevallos.01@gmail.com');
  const [password, setPassword] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      setUser(user);
      if (user) {
        console.log('✅ Usuario autenticado:', user.email);
        onAuthSuccess?.();
      }
    } catch (err) {
      console.error('Error checking user:', err);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('🔐 Intentando autenticación...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Error de autenticación:', error);
        throw error;
      }

      console.log('✅ Autenticación exitosa:', data.user?.email);
      setUser(data.user);
      onAuthSuccess?.();

    } catch (err: any) {
      console.error('❌ Error en login:', err);
      setError(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      console.log('✅ Sesión cerrada');
    } catch (err: any) {
      console.error('❌ Error en logout:', err);
      setError(err.message);
    }
  };

  const handleAutoLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔐 Auto-login con credenciales predefinidas...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'santiagozevallos.01@gmail.com',
        password: '1234',
      });

      if (error) {
        console.error('❌ Error de auto-login:', error);
        throw error;
      }

      console.log('✅ Auto-login exitoso:', data.user?.email);
      setUser(data.user);
      onAuthSuccess?.();

    } catch (err: any) {
      console.error('❌ Error en auto-login:', err);
      setError(err.message || 'Error de auto-login');
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Verificando autenticación...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Autenticado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800">
              Usuario: {user.email}
            </p>
            <p className="text-xs text-green-600">
              ID: {user.id}
            </p>
          </div>
          
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogIn className="h-5 w-5" />
          Autenticación Supabase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error de Autenticación</AlertTitle>
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="santiagozevallos.01@gmail.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="1234"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Autenticando...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </>
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O
            </span>
          </div>
        </div>

        <Button 
          onClick={handleAutoLogin} 
          variant="outline" 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Auto-login...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Auto-login con Credenciales
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
