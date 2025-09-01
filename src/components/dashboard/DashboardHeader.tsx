import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { UserMenu } from "./UserMenu";

export const DashboardHeader = () => {
  const { scrollDirection, isVisible } = useScrollDirection();
  
  return (
    <header 
      className={`h-16 border-b border-border bg-card/95 backdrop-blur-sm flex items-center justify-between px-3 md:px-6 flex-shrink-0 transition-all duration-500 ease-in-out absolute top-0 right-0 left-0 lg:left-0 z-50 ${
        !isVisible ? '-translate-y-full opacity-0 pointer-events-none scale-95' : 'translate-y-0 opacity-100 pointer-events-auto scale-100'
      }`}
    >
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        
        {/* Project Title */}
        <div>
          <h1 className="text-xl font-bold text-foreground">SentiData</h1>
          <p className="text-xs text-muted-foreground">Percepción ciudadana sobre obras municipales y regionales</p>
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