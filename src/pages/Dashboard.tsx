import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { KPICards } from "@/components/dashboard/KPICards";
import { ChartsGrid } from "@/components/dashboard/ChartsGrid";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export interface DashboardFilters {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  district: string;
  theme: string;
  sentiment: string;
}

const Dashboard = () => {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: {
      from: undefined,
      to: undefined,
    },
    district: "all",
    theme: "all",
    sentiment: "all",
  });

  const updateFilter = (key: keyof DashboardFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar filters={filters} onFilterChange={updateFilter} />
        
        <main className="flex-1 overflow-hidden">
          <DashboardHeader />
          
          <div className="p-6 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="space-y-6 h-full">
              {/* KPI Cards */}
              <KPICards filters={filters} />
              
              {/* Charts Grid */}
              <ChartsGrid filters={filters} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;