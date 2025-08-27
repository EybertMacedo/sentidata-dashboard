import { DashboardFilters } from "@/pages/Dashboard";

interface WordCloudChartProps {
  filters: DashboardFilters;
}

// Mock data - En producción vendría de Supabase
const getMockWordData = (filters: DashboardFilters) => {
  return [
    { text: "mejoras", size: 45, sentiment: "positive" },
    { text: "transporte", size: 38, sentiment: "neutral" },
    { text: "excelente", size: 35, sentiment: "positive" },
    { text: "problema", size: 32, sentiment: "negative" },
    { text: "calidad", size: 30, sentiment: "positive" },
    { text: "servicio", size: 28, sentiment: "neutral" },
    { text: "ciudadanos", size: 26, sentiment: "neutral" },
    { text: "deficiente", size: 24, sentiment: "negative" },
    { text: "obras", size: 23, sentiment: "neutral" },
    { text: "satisfecho", size: 22, sentiment: "positive" },
    { text: "rápido", size: 20, sentiment: "positive" },
    { text: "demora", size: 19, sentiment: "negative" },
    { text: "eficiente", size: 18, sentiment: "positive" },
    { text: "municipal", size: 17, sentiment: "neutral" },
    { text: "necesario", size: 16, sentiment: "neutral" },
    { text: "lento", size: 15, sentiment: "negative" },
    { text: "importante", size: 14, sentiment: "positive" },
    { text: "comunidad", size: 13, sentiment: "positive" },
    { text: "esperanza", size: 12, sentiment: "positive" },
    { text: "gestión", size: 11, sentiment: "neutral" },
  ];
};

export function WordCloudChart({ filters }: WordCloudChartProps) {
  const words = getMockWordData(filters);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "hsl(var(--success))";
      case "negative":
        return "hsl(var(--destructive))";
      default:
        return "hsl(var(--muted-foreground))";
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center h-full p-4 gap-2">
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block px-2 py-1 rounded-md hover:scale-110 transition-transform cursor-pointer"
          style={{
            fontSize: `${Math.max(word.size / 3, 12)}px`,
            color: getSentimentColor(word.sentiment),
            fontWeight: word.size > 25 ? "bold" : "normal",
            backgroundColor: `${getSentimentColor(word.sentiment)}15`,
          }}
          title={`${word.text} - ${word.sentiment} (${word.size} menciones)`}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
}