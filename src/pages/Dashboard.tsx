import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { KPICards } from "@/components/dashboard/KPICards";
import { ChartsGrid } from "@/components/dashboard/ChartsGrid";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DebugPanel } from "@/components/dashboard/DebugPanel";
import { useDashboardData, type DashboardFilters } from "@/hooks/use-dashboard-data";


const Dashboard = () => {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateMode: 'annual',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    theme: "all",
    sentiment: "all",
  });

  const { data, loading, error, isInitialLoad } = useDashboardData(filters);

  const updateFilter = (key: keyof DashboardFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Solo mostrar loading completo en la carga inicial
  if (loading && isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Error al cargar datos</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reintentar
          </button>
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
        
        <SidebarInset className="h-screen flex flex-col bg-background">
          <DashboardHeader />
          
          <div className="flex-1 p-0.5 sm:p-1 overflow-hidden bg-background relative">
            {/* Indicador de loading overlay que cubre todo el contenido */}
            {loading && !isInitialLoad && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm font-medium">Actualizando gráficos...</span>
                </div>
              </div>
            )}
              <div className="h-full flex flex-col gap-0.5 sm:gap-1">
              {/* KPI Cards - Hidden on small viewports, compact on larger screens */}
              <div className="hidden sm:block h-[120px] md:h-[100px] lg:h-[120px] flex-shrink-0">
                <KPICards data={data} loading={loading} />
              </div>
              
              {/* Charts Grid - Full height on small screens, remaining space on larger screens */}
              <div className="flex-1 min-h-0">
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

export default Dashboard;