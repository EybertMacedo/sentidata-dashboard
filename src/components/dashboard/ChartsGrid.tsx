import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "@/hooks/use-dashboard-data";
import { ThemeCommentsChart } from "./charts/ThemeCommentsChart";
import { TrendChart } from "./charts/TrendChart";
import { SentimentDonutChart } from "./charts/SentimentDonutChart";
import { WordCloudChart } from "./charts/WordCloudChart";
import { CategoryDistributionChart } from "./charts/CategoryDistributionChart";
import { CombinedDistributionChart } from "./charts/CombinedDistributionChart";

interface ChartsGridProps {
  data: DashboardData;
  loading?: boolean;
}

export function ChartsGrid({ data, loading }: ChartsGridProps) {
  // Verificar si data existe antes de renderizar
  if (!data) {
    return (
      <div className="dashboard-grid h-full bg-background">
        <div className="col-span-full flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">No hay datos disponibles</p>
            <p className="text-xs">Esperando carga de datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-grid h-full bg-background">
      {/* Gráfico Combinado - Distribución de Plataformas y Categorías */}
      <Card className="col-span-1 lg:col-span-1 flex flex-col row-span-1 bg-card h-full shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between px-4 md:px-4 pt-3 md:pt-3 pb-2 md:pb-2">
          <CardTitle className="text-xs md:text-sm font-semibold text-foreground leading-tight">
            Distribución de Datos
          </CardTitle>
        </div>
        <CardContent className="flex-1 min-h-0 p-2">
          <CombinedDistributionChart data={data} />
        </CardContent>
      </Card>

      {/* Gráfico de Línea - Tendencia Temporal */}
      <Card className="col-span-1 lg:col-span-1 flex flex-col row-span-1 bg-card h-full shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between px-4 md:px-4 pt-3 md:pt-3 pb-2 md:pb-2">
          <CardTitle className="text-xs md:text-sm font-semibold text-foreground leading-tight">
            Tendencia de Interacciones
          </CardTitle>
        </div>
        <CardContent className="flex-1 min-h-0 p-2">
          <TrendChart data={data} />
        </CardContent>
      </Card>

      {/* Gráfico de Pie - Distribución de Sentimientos */}
      <Card className="col-span-1 lg:col-span-1 flex flex-col row-span-1 bg-card h-full shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between px-4 md:px-4 pt-3 md:pt-3 pb-2 md:pb-2">
          <CardTitle className="text-xs md:text-sm font-semibold text-foreground leading-tight">
            Distribución de Sentimientos
          </CardTitle>
        </div>
        <CardContent className="flex-1 min-h-0 p-2">
          <SentimentDonutChart data={data} />
        </CardContent>
      </Card>

      {/* Nube de Palabras */}
      <Card className="col-span-1 lg:col-span-1 flex flex-col row-span-1 bg-card h-full shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between px-4 md:px-4 pt-3 md:pt-3 pb-2 md:pb-2">
          <CardTitle className="text-xs md:text-sm font-semibold text-foreground leading-tight">
            Palabras Más Frecuentes
          </CardTitle>
        </div>
        <CardContent className="flex-1 min-h-0 p-2">
          <WordCloudChart data={data} />
        </CardContent>
      </Card>
    </div>
  );
}