import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DashboardFilters } from "@/pages/Dashboard";

interface TrendChartProps {
  filters: DashboardFilters;
}

// Mock data - En producción vendría de Supabase
const getMockTrendData = (filters: DashboardFilters) => {
  return [
    { month: "Ene", likes: 1200, comments: 890, positive: 567, negative: 234, neutral: 89 },
    { month: "Feb", likes: 1350, comments: 1023, positive: 678, negative: 198, neutral: 147 },
    { month: "Mar", likes: 1180, comments: 945, positive: 612, negative: 213, neutral: 120 },
    { month: "Abr", likes: 1420, comments: 1156, positive: 734, negative: 267, neutral: 155 },
    { month: "May", likes: 1580, comments: 1298, positive: 823, negative: 312, neutral: 163 },
    { month: "Jun", likes: 1247, comments: 1089, positive: 698, negative: 234, neutral: 157 },
  ];
};

export function TrendChart({ filters }: TrendChartProps) {
  const data = getMockTrendData(filters);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
            color: "hsl(var(--card-foreground))"
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="likes" 
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          name="Likes"
          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="comments" 
          stroke="hsl(var(--success))"
          strokeWidth={2}
          name="Comentarios"
          dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="positive" 
          stroke="hsl(var(--success))"
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Positivos"
          dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}