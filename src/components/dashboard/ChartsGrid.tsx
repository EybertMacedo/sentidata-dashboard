import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardFilters } from "@/pages/Dashboard";
import { ThemeCommentsChart } from "./charts/ThemeCommentsChart";
import { TrendChart } from "./charts/TrendChart";
import { SentimentDonutChart } from "./charts/SentimentDonutChart";
import { WordCloudChart } from "./charts/WordCloudChart";

interface ChartsGridProps {
  filters: DashboardFilters;
}

export function ChartsGrid({ filters }: ChartsGridProps) {
  return (
    <div className="dashboard-grid">
      {/* Gráfico de Barras - Comentarios por Tema */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Comentarios por Tema
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ThemeCommentsChart filters={filters} />
        </CardContent>
      </Card>

      {/* Gráfico de Línea - Tendencia Temporal */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Tendencia de Interacciones
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <TrendChart filters={filters} />
        </CardContent>
      </Card>

      {/* Gráfico de Dona - Distribución de Sentimientos */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Distribución de Sentimientos
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <SentimentDonutChart filters={filters} />
        </CardContent>
      </Card>

      {/* Nube de Palabras */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Palabras Más Frecuentes
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <WordCloudChart filters={filters} />
        </CardContent>
      </Card>
    </div>
  );
}