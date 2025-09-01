import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { DashboardData } from "@/hooks/use-dashboard-data";

interface CategoryDistributionChartProps {
  data: DashboardData;
}

export function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
  const { categoryDistribution } = data;
  
  // Crear una key única basada en los datos para forzar re-render
  const chartKey = JSON.stringify(categoryDistribution);

  // Debug: mostrar información de los datos
  console.log('=== DEBUG CATEGORY CHART ===');
  console.log('CategoryDistribution:', categoryDistribution);
  console.log('Categories count:', Object.keys(categoryDistribution || {}).length);
  console.log('===========================');

  // Verificar si hay datos reales de categorías
  if (!categoryDistribution || Object.keys(categoryDistribution).length === 0 || 
      Object.values(categoryDistribution).every(count => count === 0)) {
    return (
      <div className="flex items-center justify-center h-full transition-opacity duration-300">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No hay datos disponibles</p>
          <p className="text-xs">Los datos de categorías se generarán automáticamente</p>
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
    .slice(0, 8); // Mostrar solo las top 8 categorías

  return (
    <div className="w-full h-full flex items-center justify-center transition-all duration-300" key={chartKey}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 50 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            opacity={0.2}
          />
          <XAxis 
            dataKey="category"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={{ stroke: "hsl(var(--border))" }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={{ stroke: "hsl(var(--border))" }}
            width={40}
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
  );
}
