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

  // Si no hay datos, mostrar mensaje
  if (!timeSeriesData || timeSeriesData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full transition-opacity duration-300">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No hay datos disponibles</p>
          <p className="text-xs">Los datos de tendencia se generarán automáticamente</p>
        </div>
      </div>
    );
  }

  // Debug: mostrar información de los datos antes de procesar
  console.log('=== DEBUG TREND CHART DATA ===');
  console.log('Raw timeSeriesData:', timeSeriesData);
  console.log('Data length:', timeSeriesData?.length);
  
  // Formatear los datos para el gráfico con validación robusta
  const chartData = timeSeriesData.map((item, index) => {
    const positive = Math.max(0, Math.min(Number(item.positive) || 0, 1000000));
    const negative = Math.max(0, Math.min(Number(item.negative) || 0, 1000000));
    const neutral = Math.max(0, Math.min(Number(item.neutral) || 0, 1000000));
    
    // Debug: mostrar valores problemáticos
    if (positive > 100000 || negative > 100000 || neutral > 100000) {
      console.warn(`⚠️ Valores altos detectados en índice ${index}:`, {
        date: item.date,
        positive: item.positive,
        negative: item.negative,
        neutral: item.neutral,
        processed: { positive, negative, neutral }
      });
    }
    
    return {
      ...item,
      positive,
      negative,
      neutral,
    };
  });

  // Encontrar el valor máximo para escalar el eje Y apropiadamente
  const allValues = chartData.flatMap(d => [d.positive, d.negative, d.neutral]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  
  // Asegurar que el valor máximo sea razonable
  const safeMaxValue = Math.min(maxValue, 1000000);
  
  // Arreglar problemas de precisión de punto flotante
  const roundedMaxValue = Math.round(safeMaxValue);
  const domainMax = Math.round(roundedMaxValue * 1.1);
  
  console.log('Processed chartData:', chartData);
  console.log('Max value:', maxValue, 'Safe max value:', safeMaxValue, 'Domain max:', domainMax);
  console.log('===============================');

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
              domain={[0, domainMax]} // Usar valor redondeado para evitar problemas de precisión
              tickFormatter={(value) => {
                // Formatear números grandes de manera legible
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(1)}K`;
                }
                return Math.round(value).toString(); // Redondear para evitar decimales innecesarios
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