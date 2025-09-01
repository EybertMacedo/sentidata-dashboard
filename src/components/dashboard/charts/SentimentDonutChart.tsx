import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { DashboardData } from "@/hooks/use-dashboard-data";

interface SentimentDonutChartProps {
  data: DashboardData;
}

// Mock data para cuando no hay datos reales
const mockSentimentData = [
  { name: "Positivo", value: 67.3, count: 839, color: "hsl(var(--success))" },
  { name: "Negativo", value: 18.2, count: 227, color: "hsl(var(--destructive))" },
  { name: "Neutral", value: 14.5, count: 181, color: "#ca8a04" },
];

export function SentimentDonutChart({ data }: SentimentDonutChartProps) {
  // Debug completo de los datos recibidos
  console.log('=== DEBUG SENTIMENT CHART COMPLETO ===');
  console.log('Data completa recibida:', data);
  console.log('SentimentDistribution:', data?.sentimentDistribution);
  console.log('Posts count:', data?.posts?.length);
  console.log('Comments count:', data?.comments?.length);
  console.log('=====================================');

  // Verificar si hay datos reales disponibles
  if (!data?.sentimentDistribution || 
      (data.sentimentDistribution.positive === 0 && 
       data.sentimentDistribution.negative === 0 && 
       data.sentimentDistribution.neutral === 0)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No hay datos disponibles</p>
          <p className="text-xs">Los datos de sentimientos se generarán automáticamente</p>
        </div>
      </div>
    );
  }

  // Usar datos reales si están disponibles, sino usar mock data
  let chartData;
  
  if (data?.sentimentDistribution) {
    const { sentimentDistribution } = data;
    const totalSentimentComments = sentimentDistribution.positive + sentimentDistribution.negative + sentimentDistribution.neutral;
    
    console.log('=== USANDO DATOS REALES ===');
    console.log('Positive:', sentimentDistribution.positive);
    console.log('Negative:', sentimentDistribution.negative);
    console.log('Neutral:', sentimentDistribution.neutral);
    console.log('Total:', totalSentimentComments);
    console.log('==========================');
    
    chartData = [
      { 
        name: "Positivo", 
        value: totalSentimentComments > 0 ? (sentimentDistribution.positive / totalSentimentComments) * 100 : 0, 
        count: sentimentDistribution.positive, 
        color: "hsl(var(--success))" 
      },
      { 
        name: "Negativo", 
        value: totalSentimentComments > 0 ? (sentimentDistribution.negative / totalSentimentComments) * 100 : 0, 
        count: sentimentDistribution.negative, 
        color: "hsl(var(--destructive))" 
      },
      { 
        name: "Neutral", 
        value: totalSentimentComments > 0 ? (sentimentDistribution.neutral / totalSentimentComments) * 100 : 0, 
        count: sentimentDistribution.neutral, 
        color: "#ca8a04" 
      },
    ];
  } else {
    console.log('=== USANDO MOCK DATA ===');
    chartData = mockSentimentData;
  }

  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    // Para pie chart, usar el radio exterior para posicionar las etiquetas
    const radius = outerRadius * 0.7; // Posicionar etiquetas al 70% del radio
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
        style={{
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
        }}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2} // Agregar pequeño espacio entre segmentos
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props: any) => [
              `${value.toFixed(1)}% (${props.payload.count} comentarios)`,
              name
            ]}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
              color: "hsl(var(--card-foreground))"
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}