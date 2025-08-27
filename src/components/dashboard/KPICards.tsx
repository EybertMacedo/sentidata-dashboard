import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, ThumbsDown, TrendingUp } from "lucide-react";
import { DashboardFilters } from "@/pages/Dashboard";

interface KPICardsProps {
  filters: DashboardFilters;
}

// Mock data - En producción vendría de Supabase
const getMockKPIs = (filters: DashboardFilters) => {
  return {
    totalComments: 1247,
    positivePercentage: 67.3,
    negativePercentage: 18.2,
    trend: "+12.5%"
  };
};

export function KPICards({ filters }: KPICardsProps) {
  const kpis = getMockKPIs(filters);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total de Comentarios */}
      <Card className="kpi-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Comentarios
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{kpis.totalComments.toLocaleString()}</div>
          <p className="text-xs text-success flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" />
            {kpis.trend} vs mes anterior
          </p>
        </CardContent>
      </Card>

      {/* Comentarios Positivos */}
      <Card className="kpi-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Comentarios Positivos
          </CardTitle>
          <ThumbsUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{kpis.positivePercentage}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((kpis.totalComments * kpis.positivePercentage) / 100)} comentarios
          </p>
        </CardContent>
      </Card>

      {/* Comentarios Negativos */}
      <Card className="kpi-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Comentarios Negativos
          </CardTitle>
          <ThumbsDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{kpis.negativePercentage}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((kpis.totalComments * kpis.negativePercentage) / 100)} comentarios
          </p>
        </CardContent>
      </Card>

      {/* Comentarios Neutrales */}
      <Card className="kpi-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Comentarios Neutrales
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {(100 - kpis.positivePercentage - kpis.negativePercentage).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((kpis.totalComments * (100 - kpis.positivePercentage - kpis.negativePercentage)) / 100)} comentarios
          </p>
        </CardContent>
      </Card>
    </div>
  );
}