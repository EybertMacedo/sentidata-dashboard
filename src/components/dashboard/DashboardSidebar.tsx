import { Calendar, Filter, BarChart3, TrendingUp } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DashboardFilters } from "@/pages/Dashboard";

interface DashboardSidebarProps {
  filters: DashboardFilters;
  onFilterChange: (key: keyof DashboardFilters, value: any) => void;
}

const districts = [
  { value: "all", label: "Todos los distritos" },
  { value: "cercado", label: "Cercado de Lima" },
  { value: "san-isidro", label: "San Isidro" },
  { value: "miraflores", label: "Miraflores" },
  { value: "san-borja", label: "San Borja" },
  { value: "surco", label: "Santiago de Surco" },
];

const themes = [
  { value: "all", label: "Todos los temas" },
  { value: "vias-transporte", label: "Vías y Transporte" },
  { value: "salud", label: "Salud" },
  { value: "educacion", label: "Educación" },
  { value: "seguridad", label: "Seguridad" },
  { value: "servicios-publicos", label: "Servicios Públicos" },
  { value: "medio-ambiente", label: "Medio Ambiente" },
];

const sentiments = [
  { value: "all", label: "Todos los sentimientos" },
  { value: "positive", label: "Positivo" },
  { value: "negative", label: "Negativo" },
  { value: "neutral", label: "Neutral" },
];

export function DashboardSidebar({ filters, onFilterChange }: DashboardSidebarProps) {
  return (
    <Sidebar className="w-80">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros de Análisis
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Filtro de Fecha */}
              <SidebarMenuItem>
                <div className="filter-section">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Rango de Fechas
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {filters.dateRange.from ? (
                          filters.dateRange.to ? (
                            <>
                              {format(filters.dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                              {format(filters.dateRange.to, "LLL dd, y", { locale: es })}
                            </>
                          ) : (
                            format(filters.dateRange.from, "LLL dd, y", { locale: es })
                          )
                        ) : (
                          <span>Seleccionar fechas</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                       <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={filters.dateRange.from}
                        selected={{
                          from: filters.dateRange.from,
                          to: filters.dateRange.to
                        }}
                        onSelect={(range) => onFilterChange("dateRange", range || { from: undefined, to: undefined })}
                        numberOfMonths={2}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </SidebarMenuItem>

              {/* Filtro de Distrito */}
              <SidebarMenuItem>
                <div className="filter-section">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Distrito
                  </label>
                  <Select
                    value={filters.district}
                    onValueChange={(value) => onFilterChange("district", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.value} value={district.value}>
                          {district.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarMenuItem>

              {/* Filtro de Tema */}
              <SidebarMenuItem>
                <div className="filter-section">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Tema
                  </label>
                  <Select
                    value={filters.theme}
                    onValueChange={(value) => onFilterChange("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tema" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarMenuItem>

              {/* Filtro de Sentimiento */}
              <SidebarMenuItem>
                <div className="filter-section">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Tipo de Sentimiento
                  </label>
                  <Select
                    value={filters.sentiment}
                    onValueChange={(value) => onFilterChange("sentiment", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sentimiento" />
                    </SelectTrigger>
                    <SelectContent>
                      {sentiments.map((sentiment) => (
                        <SelectItem key={sentiment.value} value={sentiment.value}>
                          {sentiment.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sección de navegación adicional */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Vista Rápida
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button variant="ghost" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Resumen Ejecutivo
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}