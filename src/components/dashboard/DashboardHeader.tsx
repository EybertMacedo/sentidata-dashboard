import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

import { UserMenu } from "./UserMenu";

export const DashboardHeader = () => {
  return (
    <header className="h-14 sm:h-16 border-b border-border bg-card/95 backdrop-blur-sm flex items-center justify-between px-2 sm:px-3 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        
        {/* Project Title */}
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground">SentiData</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">Percepción ciudadana sobre obras municipales y regionales</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
        
        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
};