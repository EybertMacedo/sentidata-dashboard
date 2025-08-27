import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DashboardFilters } from "@/pages/Dashboard";

interface ThemeCommentsChartProps {
  filters: DashboardFilters;
}

// Mock data - En producción vendría de Supabase
const getMockThemeData = (filters: DashboardFilters) => {
  return [
    { theme: "Vías y Transporte", comments: 342, positive: 198, negative: 89, neutral: 55 },
    { theme: "Salud", comments: 287, positive: 201, negative: 45, neutral: 41 },
    { theme: "Educación", comments: 234, positive: 156, negative: 52, neutral: 26 },
    { theme: "Seguridad", comments: 198, positive: 89, negative: 76, neutral: 33 },
    { theme: "Servicios Públicos", comments: 186, positive: 98, negative: 67, neutral: 21 },
    { theme: "Medio Ambiente", comments: 156, positive: 134, negative: 12, neutral: 10 },
  ];
};

export function ThemeCommentsChart({ filters }: ThemeCommentsChartProps) {
  const data = getMockThemeData(filters);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="horizontal"
        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          type="number" 
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis 
          type="category" 
          dataKey="theme" 
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          width={75}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
            color: "hsl(var(--card-foreground))"
          }}
        />
        <Bar 
          dataKey="comments" 
          fill="hsl(var(--primary))"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}