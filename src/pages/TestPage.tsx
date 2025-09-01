import { DataTest } from "@/components/dashboard/DataTest";
import { RLSFixInstructions } from "@/components/dashboard/RLSFixInstructions";
import { LoginScreen } from "@/components/dashboard/LoginScreen";
import { useState } from "react";

export default function TestPage() {
  const [showRLSInstructions, setShowRLSInstructions] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🧪 Página de Prueba - Supabase</h1>
        
        {/* Navegación */}
        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          <button 
            onClick={() => {
              setShowRLSInstructions(false);
              setShowAuth(false);
            }}
            className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground"
          >
            Prueba de Conexión
          </button>
          <button 
            onClick={() => {
              setShowRLSInstructions(true);
              setShowAuth(false);
            }}
            className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Instrucciones RLS
          </button>
          <button 
            onClick={() => {
              setShowRLSInstructions(false);
              setShowAuth(true);
            }}
            className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Autenticación
          </button>
        </div>
        
        {showRLSInstructions ? (
          <div className="space-y-4">
            <RLSFixInstructions />
          </div>
        ) : showAuth ? (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold mb-2">🔐 Prueba de Autenticación</h2>
              <p className="text-muted-foreground">
                Prueba la autenticación con las credenciales proporcionadas
              </p>
            </div>
            <LoginScreen />
          </div>
        ) : (
          <div className="space-y-4">
            <DataTest onRLSError={() => setShowRLSInstructions(true)} />
          </div>
        )}
      </div>
    </div>
  );
}
