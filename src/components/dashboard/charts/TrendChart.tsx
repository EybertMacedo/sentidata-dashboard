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
      const allValues = chartData.flatMap(d => [d.positive, d.negative, d.neutral]);
      const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
      const safeMaxValue = Math.min(maxValue, 1000000);
      
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
                  domain={[0, safeMaxValue * 1.1]}
                  tickFormatter={(value) => {
                    // Formatear números grandes de manera legible
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(1)}M`;
                    } else if (value >= 1000) {
                      return `${(value / 1000).toFixed(1)}K`;
                    }
                    return value.toString();
                  }}
                />
                <Tooltip
                  formatter={(value: number, name: string, props: any) => {
                    // Usar el dataKey del props para determinar el tipo correcto
                    const dataKey = props.dataKey;
                    let label = '';
                    if (dataKey === 'positive') label = 'Positivos';
                    else if (dataKey === 'negative') label = 'Negativos';
                    else if (dataKey === 'neutral') label = 'Neutrales';
                    else label = name; // fallback
                    
                    return [value.toLocaleString('es-ES'), label];
                  }}
                  labelFormatter={(label) => `Fecha: ${label}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--card-foreground))",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  formatter={(value, entry) => {
                    // Asegurar que la leyenda muestre los nombres correctos
                    if (entry.dataKey === 'positive') return 'Positivos';
                    if (entry.dataKey === 'negative') return 'Negativos';
                    if (entry.dataKey === 'neutral') return 'Neutrales';
                    return value;
                  }}
                />
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

  // Formatear los datos para el gráfico con validación robusta
  const chartData = timeSeriesData.map(item => ({
    ...item,
    // Asegurar que los valores numéricos sean números válidos y razonables
    positive: Math.max(0, Math.min(Number(item.positive) || 0, 1000000)), // Máximo 1M
    negative: Math.max(0, Math.min(Number(item.negative) || 0, 1000000)), // Máximo 1M
    neutral: Math.max(0, Math.min(Number(item.neutral) || 0, 1000000)), // Máximo 1M
  }));

  // Encontrar el valor máximo para escalar el eje Y apropiadamente
  const allValues = chartData.flatMap(d => [d.positive, d.negative, d.neutral]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  
  // Asegurar que el valor máximo sea razonable
  const safeMaxValue = Math.min(maxValue, 1000000);

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
              domain={[0, safeMaxValue * 1.1]} // Añadir 10% de espacio arriba
              tickFormatter={(value) => {
                // Formatear números grandes de manera legible
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(1)}K`;
                }
                return value.toString();
              }}
            />
            <Tooltip
              formatter={(value: number, name: string, props: any) => {
                // Usar el dataKey del props para determinar el tipo correcto
                const dataKey = props.dataKey;
                let label = '';
                if (dataKey === 'positive') label = 'Comentarios Positivos';
                else if (dataKey === 'negative') label = 'Comentarios Negativos';
                else if (dataKey === 'neutral') label = 'Comentarios Neutrales';
                else label = name; // fallback
                
                return [value.toLocaleString('es-ES'), label];
              }}
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
              formatter={(value, entry) => {
                // Asegurar que la leyenda muestre los nombres correctos
                if (entry.dataKey === 'positive') return 'Comentarios Positivos';
                if (entry.dataKey === 'negative') return 'Comentarios Negativos';
                if (entry.dataKey === 'neutral') return 'Comentarios Neutrales';
                return value;
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