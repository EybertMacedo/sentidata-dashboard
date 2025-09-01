import { Filter, BarChart3 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardFilters } from "@/hooks/use-dashboard-data";
import { useCategories } from "@/hooks/use-categories";

interface DashboardSidebarProps {
  filters: DashboardFilters;
  onFilterChange: (key: keyof DashboardFilters, value: any) => void;
}

// Las categorías ahora se obtienen dinámicamente de la base de datos
// const themes = [ ... ]; // Removido - ahora se usa useCategories()

const sentiments = [
  { value: "all", label: "Todos los sentimientos" },
  { value: "positive", label: "Positivo" },
  { value: "negative", label: "Negativo" },
  { value: "neutral", label: "Neutral" },
];

// Generar años disponibles (últimos 5 años)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

// Meses disponibles
const months = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

export function DashboardSidebar({ filters, onFilterChange }: DashboardSidebarProps) {
  const { categories, loading: categoriesLoading } = useCategories();
  
  return (
    <div className="w-full h-full bg-sidebar border-r border-sidebar-border p-3 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Logo del Proyecto */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-sidebar-foreground/5 border border-sidebar-border">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              {/* Replace this with your actual logo image */}
              <img 
                src="/icono-vivienda.png" 
                alt="Logo del Proyecto" 
                className="w-6 h-6 object-contain"
              />

            </div>
            <div>
              <h2 className="text-xs font-semibold text-sidebar-foreground">SentiData</h2>
              <p className="text-xs text-sidebar-muted">Dashboard Ciudadano</p>
            </div>
          </div>
        </div>

        {/* Filtros de Análisis - Con scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto sidebar-scroll">
          <div>
            <h3 className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground mb-3">
              <Filter className="h-3 w-3" />
              Filtros de Análisis
            </h3>
            
            <div className="space-y-3">
            {/* Filtro de Fecha */}
            <div className="filter-section">
              <label className="text-xs font-medium text-foreground mb-1 block">
                Período de Análisis
              </label>
              
              {/* Selector de Modo */}
              <div className="mb-2">
                <Select 
                  value={filters.dateMode} 
                  onValueChange={(value: 'annual' | 'monthly') => onFilterChange('dateMode', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Anual</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Selector de Año */}
              <div className="mb-2">
                <Select 
                  value={filters.year.toString()} 
                  onValueChange={(value) => onFilterChange('year', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selector de Mes (solo si es modo mensual) */}
              {filters.dateMode === 'monthly' && (
                <div className="mb-2">
                  <Select 
                    value={filters.month.toString()} 
                    onValueChange={(value) => onFilterChange('month', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Información del período seleccionado */}
              <div className="text-xs text-muted-foreground bg-sidebar-accent p-1.5 rounded">
                {filters.dateMode === 'annual' ? (
                  <>Analizando datos del año <strong>{filters.year}</strong></>
                ) : (
                  <>Analizando datos de <strong>{months.find(m => m.value === filters.month)?.label} {filters.year}</strong></>
                )}
              </div>
            </div>

            {/* Filtro de Tema */}
            <div className="filter-section">
              <label className="text-xs font-medium text-foreground mb-1 block">
                Tema
              </label>
              <Select value={filters.theme} onValueChange={(value) => onFilterChange('theme', value)}>
                <SelectTrigger disabled={categoriesLoading}>
                  <SelectValue placeholder={categoriesLoading ? "Cargando categorías..." : "Seleccionar tema"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Sentimiento */}
            <div className="filter-section">
              <label className="text-xs font-medium text-foreground mb-1 block">
                Sentimiento
              </label>
              <Select value={filters.sentiment} onValueChange={(value) => onFilterChange('sentiment', value)}>
                <SelectTrigger>
                  <SelectValue />
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
            </div>
          </div>
        </div>

        {/* Información del Dashboard - Siempre visible */}
        <div className="flex-shrink-0 mt-4">
          <div className="bg-sidebar-accent rounded-lg p-3 border border-sidebar-border">
            <h4 className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground mb-2">
              <BarChart3 className="h-3 w-3" />
              Sobre este Dashboard
            </h4>
            <p className="text-xs text-sidebar-foreground leading-relaxed mb-2">
              SentiData es un proyecto que emplea Inteligencia Artificial para recoger y analizar la percepción ciudadana sobre el sector saneamiento, convirtiéndola en una herramienta estratégica para la mejora continua de los servicios públicos.
            </p>
            <div className="flex items-center justify-center pt-2 border-t border-sidebar-border">
              <img 
                src="/logo-ministerio.png" 
                alt="Ministerio de Vivienda" 
                className="h-10 object-contain opacity-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}