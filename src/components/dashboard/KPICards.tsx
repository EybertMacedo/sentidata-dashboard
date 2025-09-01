import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, ThumbsDown, TrendingUp, FileText, Heart } from "lucide-react";
import type { DashboardData } from "@/hooks/use-dashboard-data";

interface KPICardsProps {
  data: DashboardData;
  loading?: boolean;
}

export function KPICards({ data, loading }: KPICardsProps) {
  // Verificar si data existe antes de desestructurar
  if (!data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 h-full">
        <div className="col-span-full flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">No hay datos disponibles</p>
            <p className="text-xs">Esperando carga de datos...</p>
          </div>
        </div>
      </div>
    );
  }

  const { 
    totalPosts, 
    totalComments, 
    totalLikes, 
    totalEngagement,
    sentimentDistribution,
    comments 
  } = data;

  // Calcular porcentajes de sentimientos
  const totalSentimentComments = sentimentDistribution.positive + sentimentDistribution.negative + sentimentDistribution.neutral;
  const positivePercentage = totalSentimentComments > 0 ? (sentimentDistribution.positive / totalSentimentComments) * 100 : 0;
  const negativePercentage = totalSentimentComments > 0 ? (sentimentDistribution.negative / totalSentimentComments) * 100 : 0;
  const neutralPercentage = totalSentimentComments > 0 ? (sentimentDistribution.neutral / totalSentimentComments) * 100 : 0;

  // Obtener comentarios reales de la base de datos por sentimiento
  const positiveComments = comments.filter(comment => comment.c_clasificacion === 'Positiva');
  const neutralComments = comments.filter(comment => comment.c_clasificacion === 'Neutral');
  const negativeComments = comments.filter(comment => comment.c_clasificacion === 'Negativa');

  // Mensajes estáticos en lugar de comentarios aleatorios
  const positiveMessage = positiveComments.length > 0 
    ? `${positiveComments.length} comentarios positivos registrados`
    : 'Sin comentarios positivos';
  
  const neutralMessage = neutralComments.length > 0 
    ? `${neutralComments.length} comentarios neutrales registrados`
    : 'Sin comentarios neutrales';
  
  const negativeMessage = negativeComments.length > 0 
    ? `${negativeComments.length} comentarios negativos registrados`
    : 'Sin comentarios negativos';

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 h-full">
      {/* Indicador de loading sutil */}
      {loading && !data && (
        <div className="col-span-full flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Actualizando datos...</span>
          </div>
        </div>
      )}
      {/* Engagement Total - Posts, Comentarios y Likes */}
      <Card className="kpi-card h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between px-4 md:px-4 pt-3 md:pt-3 pb-2 md:pb-2">
          <CardTitle className="text-xs md:text-sm font-semibold text-foreground">
            Engagement Total
          </CardTitle>
          <div className="flex gap-1">
            <FileText className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
            <MessageSquare className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
            <Heart className="h-3 w-3 md:h-4 md:w-4 text-success flex-shrink-0" />
          </div>
        </div>
        <CardContent className="flex-1 flex flex-col justify-center pb-3 px-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Posts:</span>
              <span className="text-sm md:text-lg font-bold text-foreground">{totalPosts.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Comentarios:</span>
              <span className="text-sm md:text-lg font-bold text-foreground">{totalComments.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Likes:</span>
              <span className="text-sm md:text-lg font-bold text-foreground">{totalLikes.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comentarios Positivos */}
      <Card className="kpi-card h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between px-4 md:px-4 pt-3 md:pt-3 pb-2 md:pb-2">
          <CardTitle className="text-xs md:text-sm font-semibold text-foreground">
            Comentarios Positivos
          </CardTitle>
          <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
        </div>
        <CardContent className="flex-1 flex flex-col justify-center pb-3 px-4">
          <div className="text-sm md:text-lg font-bold text-foreground text-green-600">{sentimentDistribution.positive.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {positiveMessage}
          </p>
        </CardContent>
      </Card>

      {/* Comentarios Neutrales */}
      <Card className="kpi-card h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between px-4 md:px-4 pt-3 md:pt-3 pb-2 md:pb-2">
          <CardTitle className="text-xs md:text-sm font-semibold text-foreground">
            Comentarios Neutrales
          </CardTitle>
          <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
        </div>
        <CardContent className="flex-1 flex flex-col justify-center pb-3 px-4">
          <div className="text-sm md:text-lg font-bold text-foreground text-yellow-600">{sentimentDistribution.neutral.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {neutralMessage}
          </p>
        </CardContent>
      </Card>

      {/* Comentarios Negativos */}
      <Card className="kpi-card h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between px-4 md:px-4 pt-3 md:pt-3 pb-2 md:pb-2">
          <CardTitle className="text-xs md:text-sm font-semibold text-foreground">
            Comentarios Negativos
          </CardTitle>
          <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
        </div>
        <CardContent className="flex-1 flex flex-col justify-center pb-3 px-4">
          <div className="text-sm md:text-lg font-bold text-foreground text-red-600">{sentimentDistribution.negative.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {negativeMessage}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}