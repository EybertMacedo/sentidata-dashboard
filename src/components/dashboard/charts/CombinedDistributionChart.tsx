import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { DashboardData } from "@/hooks/use-dashboard-data";
import { ThemeCommentsChart } from "./ThemeCommentsChart";

interface CombinedDistributionChartProps {
  data: DashboardData;
}

export function CombinedDistributionChart({ data }: CombinedDistributionChartProps) {
  const [showCategories, setShowCategories] = useState(false);
  const { categoryDistribution, platformDistribution } = data;

  // Crear una key única basada en los datos y el toggle para forzar re-render
  const chartKey = JSON.stringify({ categoryDistribution, platformDistribution, showCategories });

  // Debug: mostrar información de los datos
  console.log('=== DEBUG COMBINED DISTRIBUTION CHART ===');
  console.log('ShowCategories:', showCategories);
  console.log('CategoryDistribution:', categoryDistribution);
  console.log('PlatformDistribution:', platformDistribution);
  console.log('========================================');

  // Si está mostrando plataformas, usar el componente existente
  if (!showCategories) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Toggle Control */}
        <div className="flex items-center justify-end px-2 py-1 mb-1">
          <div className="flex items-center space-x-2">
            <Switch
              id="distribution-toggle"
              checked={showCategories}
              onCheckedChange={setShowCategories}
            />
            <Label htmlFor="distribution-toggle" className="text-xs text-muted-foreground">
              {showCategories ? "Categorías" : "Plataformas"}
            </Label>
          </div>
        </div>
        
        {/* Gráfico de Plataformas */}
        <div className="flex-1 min-h-0">
          <ThemeCommentsChart data={data} />
        </div>
      </div>
    );
  }

  // Verificar si hay datos reales de categorías
  if (!categoryDistribution || Object.keys(categoryDistribution).length === 0 || 
      Object.values(categoryDistribution).every(count => count === 0)) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Toggle Control */}
        <div className="flex items-center justify-end px-2 py-1 mb-1">
          <div className="flex items-center space-x-2">
            <Switch
              id="distribution-toggle"
              checked={showCategories}
              onCheckedChange={setShowCategories}
            />
            <Label htmlFor="distribution-toggle" className="text-xs text-muted-foreground">
              {showCategories ? "Categorías" : "Plataformas"}
            </Label>
          </div>
        </div>
        
        {/* Mensaje de no datos */}
        <div className="flex items-center justify-center flex-1 transition-opacity duration-300">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">No hay datos disponibles</p>
            <p className="text-xs">Los datos de categorías se generarán automáticamente</p>
          </div>
        </div>
      </div>
    );
  }

  // Convertir la distribución de categorías a un formato adecuado para el gráfico
  const chartData = Object.entries(categoryDistribution)
    .map(([category, count]) => ({
      category: category === 'Sin categoría' ? 'Sin especificar' : category,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // Mostrar solo las top 6 categorías para espacio más pequeño

  return (
    <div className="w-full h-full flex flex-col transition-all duration-300" key={chartKey}>
      {/* Toggle Control */}
      <div className="flex items-center justify-end px-2 py-1 mb-1">
        <div className="flex items-center space-x-2">
          <Switch
            id="distribution-toggle"
            checked={showCategories}
            onCheckedChange={setShowCategories}
          />
          <Label htmlFor="distribution-toggle" className="text-xs text-muted-foreground">
            {showCategories ? "Categorías" : "Plataformas"}
          </Label>
        </div>
      </div>
      
      {/* Gráfico de Categorías */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 40 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.2}
            />
            <XAxis 
              dataKey="category"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              angle={-45}
              textAnchor="end"
              height={50}
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              width={35}
            />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString('es-ES'), 'Posts']}
              labelFormatter={(label) => `Categoría: ${label}`}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Bar 
              dataKey="count" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
