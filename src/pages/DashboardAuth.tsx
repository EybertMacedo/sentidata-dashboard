import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { KPICards } from "@/components/dashboard/KPICards";
import { ChartsGrid } from "@/components/dashboard/ChartsGrid";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LoginScreen } from "@/components/dashboard/LoginScreen";
import { DebugPanel } from "@/components/dashboard/DebugPanel";
import { useDashboardDataAuth, type DashboardFilters } from "@/hooks/use-dashboard-data-auth";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useAuth } from "@/hooks/use-auth";

const DashboardAuth = () => {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateMode: 'annual',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    theme: "all",
    sentiment: "all",
  });

  const { data, loading, error, user } = useDashboardDataAuth(filters);
  const { signOut } = useAuth();
  const { scrollDirection, isVisible } = useScrollDirection();

  const updateFilter = (key: keyof DashboardFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Mostrar loading mientras se cargan los datos
  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Cargando datos del dashboard...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Usuario: {user?.email}
          </p>
        </div>
      </div>
    );
  }

  // Mostrar error si hay alguno
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Error al cargar datos</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 mr-2"
            >
              Reintentar
            </button>
            <button 
              onClick={signOut} 
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar - Hidden on small screens */}
        <Sidebar className="hidden lg:block w-64 flex-shrink-0">
          <SidebarContent>
            <DashboardSidebar filters={filters} onFilterChange={updateFilter} />
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="overflow-hidden relative bg-background">
          <DashboardHeader />
          
          <div className={`p-3 transition-all duration-500 ease-in-out h-screen ${
            !isVisible ? 'pt-3' : 'pt-20'
          } overflow-y-auto bg-background`} data-dashboard-container>
            <div className="h-full flex flex-col">
              {/* KPI Cards - Responsive height */}
              <div className="h-[30%] lg:h-[25%] min-h-0 mb-3">
                <KPICards data={data} loading={loading} />
              </div>
              
              {/* Charts Grid - Responsive height */}
              <div className="h-[70%] lg:h-[75%] min-h-0">
                <ChartsGrid data={data} loading={loading} />
              </div>
            </div>
          </div>
        </SidebarInset>
        
        {/* Debug Panel */}
        <DebugPanel data={data} loading={loading} error={error} />
      </div>
    </SidebarProvider>
  );
};

export default DashboardAuth;
