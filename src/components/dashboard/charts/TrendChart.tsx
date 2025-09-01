import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { DashboardData } from "@/hooks/use-dashboard-data";

interface TrendChartProps {
  data: DashboardData;
}

export function TrendChart({ data }: TrendChartProps) {
  const { timeSeriesData } = data;
  
  // Crear una key única basada en los datos para forzar re-render
  const chartKey = JSON.stringify(timeSeriesData);

  // Debug: mostrar información de los datos
  console.log('=== DEBUG TREND CHART ===');
  console.log('TimeSeriesData:', timeSeriesData);
  console.log('Data length:', timeSeriesData?.length);
  console.log('========================');

  // Si no hay datos, generar datos de ejemplo o mostrar mensaje
  if (!timeSeriesData || timeSeriesData.length === 0) {
    // Generar datos de ejemplo si hay comentarios pero no series temporales
    const { comments } = data;
    if (comments && comments.length > 0) {
      console.log('🔄 Generando datos de ejemplo para tendencia...');
      
      // Crear datos de ejemplo para los últimos 7 días
      const exampleData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dateKey = `${date.getDate()}/${date.getMonth() + 1}`;
        
        return {
          date: dateKey,
          positive: Math.floor(Math.random() * 50) + 10,
          negative: Math.floor(Math.random() * 20) + 5,
          neutral: Math.floor(Math.random() * 30) + 8
        };
      });
      
      // Usar los datos de ejemplo
      const chartData = exampleData;
      const maxValue = Math.max(...chartData.map(d => Math.max(d.positive, d.negative, d.neutral)));
      
      return (
        <div className="h-full flex flex-col transition-all duration-300" key="example-data">
          <div className="flex justify-between items-center mb-2 px-2 text-xs text-muted-foreground">
            <span>📊 Datos de ejemplo (últimos 7 días)</span>
          </div>
          
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  domain={[0, maxValue * 1.1]}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    value.toLocaleString('es-ES'),
                    name === 'positive' ? 'Positivos' : name === 'negative' ? 'Negativos' : 'Neutrales'
                  ]}
                  labelFormatter={(label) => `Fecha: ${label}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--card-foreground))",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="positive" 
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  name="Positivos"
                  dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "hsl(var(--success))", strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="negative" 
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  name="Negativos"
                  dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "hsl(var(--destructive))", strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="neutral" 
                  stroke="#D97706"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Neutrales"
                  dot={{ fill: "#D97706", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "#D97706", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center h-full transition-opacity duration-300">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No hay datos disponibles</p>
          <p className="text-xs">Los datos de tendencia se generarán automáticamente</p>
        </div>
      </div>
    );
  }

  // Formatear los datos para el gráfico
  const chartData = timeSeriesData.map(item => ({
    ...item,
    // Asegurar que los valores numéricos sean números válidos
    positive: Number(item.positive) || 0,
    negative: Number(item.negative) || 0,
    neutral: Number(item.neutral) || 0,
  }));

  // Encontrar el valor máximo para escalar el eje Y apropiadamente
  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.positive, d.negative, d.neutral))
  );

  // Si todos los valores son 0, mostrar mensaje
  if (maxValue === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No hay actividad en este período</p>
          <p className="text-xs">Intenta cambiar el rango de fechas</p>
        </div>
      </div>
    );
  }

  // Calcular estadísticas resumidas
  const totalPositive = chartData.reduce((sum, item) => sum + item.positive, 0);
  const totalNegative = chartData.reduce((sum, item) => sum + item.negative, 0);
  const totalNeutral = chartData.reduce((sum, item) => sum + item.neutral, 0);
  const periodCount = chartData.length;

  // Función para formatear las etiquetas del eje X
  const formatXAxisTick = (tickItem: any) => {
    const dateStr = tickItem;
    
    // Si ya está formateado como DD/MM, devolverlo tal como está
    if (typeof dateStr === 'string' && dateStr.includes('/')) {
      return dateStr;
    }
    
    // Si es un rango de fechas (contiene "-"), mostrarlo como está
    if (typeof dateStr === 'string' && dateStr.includes('-')) {
      return dateStr;
    }
    
    // Si es una fecha ISO string, formatearla
    if (typeof dateStr === 'string' && dateStr.includes('T')) {
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return `${date.getDate()}/${date.getMonth() + 1}`;
        }
      } catch {
        // Ignorar errores de parsing
      }
    }
    
    // Fallback: devolver el valor original o una cadena vacía
    return dateStr || '';
  };

  return (
    <div className="h-full flex flex-col transition-all duration-300" key={chartKey}>
      {/* Estadísticas resumidas */}
      <div className="flex justify-between items-center mb-2 px-2 text-xs text-muted-foreground">
        <span>Períodos: {periodCount}</span>
        <span>Total Positivos: {totalPositive.toLocaleString('es-ES')}</span>
        <span>Total Negativos: {totalNegative.toLocaleString('es-ES')}</span>
        <span>Total Neutrales: {totalNeutral.toLocaleString('es-ES')}</span>
      </div>
      
      {/* Gráfico */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              interval="preserveStartEnd"
              tickFormatter={formatXAxisTick}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              domain={[0, maxValue * 1.1]} // Añadir 10% de espacio arriba
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                value.toLocaleString('es-ES'),
                name === 'positive' ? 'Comentarios Positivos' : name === 'negative' ? 'Comentarios Negativos' : 'Comentarios Neutrales'
              ]}
              labelFormatter={(label) => `Período: ${label}`}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Legend 
              wrapperStyle={{
                fontSize: '12px',
                paddingTop: '10px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="positive" 
              stroke="hsl(var(--success))"
              strokeWidth={2}
              name="Comentarios Positivos"
              dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: "hsl(var(--success))", strokeWidth: 2 }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="negative" 
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              name="Comentarios Negativos"
              dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: "hsl(var(--destructive))", strokeWidth: 2 }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="neutral" 
              stroke="#D97706"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Comentarios Neutrales"
              dot={{ fill: "#D97706", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: "#D97706", strokeWidth: 2 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}