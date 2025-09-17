import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import type { DashboardData } from "@/hooks/use-dashboard-data";

interface SentimentDensityChartProps {
  data: DashboardData;
}

// Estima densidad (KDE) con kernel Gaussiano sobre el rango [-1, 1]
function gaussianKernel(u: number) {
  return Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function SentimentDensityChart({ data }: SentimentDensityChartProps) {
  const intensities = (data?.comments || [])
    .map(c => typeof c.c_intensidad === 'number' ? c.c_intensidad : null)
    .filter((v): v is number => v !== null && !Number.isNaN(v))
    .map(v => clamp(v, -1, 1));

  if (intensities.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No hay datos de intensidad</p>
          <p className="text-xs">Se necesita la columna c_intensidad (-1 a 1)</p>
        </div>
      </div>
    );
  }

  // Parámetros KDE
  const bandwidth = 0.15;
  const points = 200;
  const xMin = -1;
  const xMax = 1;
  const step = (xMax - xMin) / (points - 1);

  const densityData = Array.from({ length: points }, (_, i) => {
    const x = xMin + i * step;
    // Estimar densidad en x
    let sum = 0;
    for (const xi of intensities) {
      sum += gaussianKernel((x - xi) / bandwidth);
    }
    const density = (sum / (intensities.length * bandwidth));
    return { x: Number(x.toFixed(3)), density };
  });

  // Normalizar altura para que quepa bien (opcional)
  const maxDensity = Math.max(...densityData.map(d => d.density)) || 1;
  const scaledData = densityData.map(d => ({ x: d.x, density: d.density / maxDensity }));

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={scaledData} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
          <defs>
            <linearGradient id="densityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="x" type="number" domain={[-1, 1]} tick={{ fontSize: 10 }} tickCount={9} />
          <YAxis hide domain={[0, 1]} />
          <Tooltip
            formatter={(value: number, name: string) => [value.toFixed(2), name === 'density' ? 'Densidad' : name]}
            labelFormatter={(label: number) => `Intensidad: ${label.toFixed(2)}`}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
              color: "hsl(var(--card-foreground))"
            }}
          />
          <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
          <ReferenceLine x={-0.2} stroke="#f87171" strokeDasharray="4 2" />
          <ReferenceLine x={0.2} stroke="#34d399" strokeDasharray="4 2" />
          <Area type="monotone" dataKey="density" stroke="#3b82f6" fill="url(#densityGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


