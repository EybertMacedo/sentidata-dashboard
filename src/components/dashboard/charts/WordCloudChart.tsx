import { useMemo } from 'react';
import { Wordcloud } from '@visx/wordcloud';
import type { DashboardData } from "@/hooks/use-dashboard-data";

interface WordCloudChartProps {
  data: DashboardData;
}

interface WordData {
  text: string;
  value: number;
  sentiment: string;
}

// Datos de ejemplo optimizados para evitar superposiciones
const fallbackWords: WordData[] = [
  // Palabras principales de alto valor
  { text: "mejoras", value: 85, sentiment: "positive" },
  { text: "transporte", value: 78, sentiment: "neutral" },
  { text: "excelente", value: 75, sentiment: "positive" },
  { text: "problema", value: 72, sentiment: "negative" },
  { text: "calidad", value: 70, sentiment: "positive" },
  { text: "servicio", value: 68, sentiment: "neutral" },
  { text: "ciudadanos", value: 66, sentiment: "neutral" },
  { text: "deficiente", value: 64, sentiment: "negative" },
  { text: "obras", value: 63, sentiment: "neutral" },
  { text: "satisfecho", value: 62, sentiment: "positive" },
  
  // Palabras de valor medio-alto
  { text: "rápido", value: 60, sentiment: "positive" },
  { text: "demora", value: 59, sentiment: "negative" },
  { text: "eficiente", value: 58, sentiment: "positive" },
  { text: "municipal", value: 57, sentiment: "neutral" },
  { text: "necesario", value: 56, sentiment: "neutral" },
  { text: "lento", value: 55, sentiment: "negative" },
  { text: "importante", value: 54, sentiment: "positive" },
  { text: "comunidad", value: 53, sentiment: "positive" },
  { text: "esperanza", value: 52, sentiment: "positive" },
  { text: "gestión", value: 51, sentiment: "neutral" },
  
  // Palabras de valor medio
  { text: "seguridad", value: 50, sentiment: "positive" },
  { text: "limpieza", value: 49, sentiment: "neutral" },
  { text: "cultura", value: 48, sentiment: "positive" },
  { text: "deporte", value: 47, sentiment: "neutral" },
  { text: "educación", value: 46, sentiment: "positive" },
  { text: "salud", value: 45, sentiment: "neutral" },
  { text: "medioambiente", value: 44, sentiment: "positive" },
  { text: "tecnología", value: 43, sentiment: "neutral" },
  { text: "innovación", value: 42, sentiment: "positive" },
  { text: "infraestructura", value: 41, sentiment: "neutral" },
  
  // Palabras de desarrollo urbano
  { text: "desarrollo", value: 40, sentiment: "positive" },
  { text: "sostenible", value: 39, sentiment: "positive" },
  { text: "participación", value: 38, sentiment: "positive" },
  { text: "transparencia", value: 37, sentiment: "positive" },
  { text: "eficacia", value: 36, sentiment: "positive" },
  { text: "responsabilidad", value: 35, sentiment: "neutral" },
  { text: "colaboración", value: 34, sentiment: "positive" },
  { text: "inclusión", value: 33, sentiment: "positive" },
  { text: "diversidad", value: 32, sentiment: "positive" },
  { text: "creatividad", value: 31, sentiment: "positive" },
  
  // Palabras de valores y actitudes
  { text: "resiliencia", value: 30, sentiment: "positive" },
  { text: "adaptabilidad", value: 29, sentiment: "neutral" },
  { text: "flexibilidad", value: 28, sentiment: "positive" },
  { text: "confianza", value: 27, sentiment: "positive" },
  { text: "honestidad", value: 26, sentiment: "positive" },
  { text: "compromiso", value: 25, sentiment: "positive" },
  { text: "dedicación", value: 24, sentiment: "positive" },
  { text: "esfuerzo", value: 23, sentiment: "positive" },
  { text: "constancia", value: 22, sentiment: "positive" },
  { text: "perseverancia", value: 21, sentiment: "positive" },
  
  // Palabras de servicios y atención
  { text: "atención", value: 20, sentiment: "neutral" },
  { text: "cuidado", value: 19, sentiment: "positive" },
  { text: "mantenimiento", value: 18, sentiment: "neutral" },
  { text: "renovación", value: 17, sentiment: "positive" },
  { text: "modernización", value: 16, sentiment: "positive" },
  { text: "actualización", value: 15, sentiment: "neutral" },
  { text: "mejora", value: 14, sentiment: "positive" },
  { text: "optimización", value: 13, sentiment: "positive" },
  { text: "simplificación", value: 12, sentiment: "positive" },
  { text: "organización", value: 11, sentiment: "neutral" },
  
  // Palabras de planificación
  { text: "planificación", value: 10, sentiment: "neutral" },
  { text: "coordinación", value: 9, sentiment: "neutral" },
  { text: "integración", value: 8, sentiment: "positive" },
  { text: "sincronización", value: 7, sentiment: "neutral" },
  { text: "armonización", value: 6, sentiment: "positive" },
  { text: "equilibrio", value: 5, sentiment: "positive" },
  { text: "estabilidad", value: 4, sentiment: "positive" },
  { text: "consistencia", value: 3, sentiment: "positive" },
  { text: "regularidad", value: 2, sentiment: "neutral" },
  { text: "continuidad", value: 1, sentiment: "positive" },
];

// Lista de palabras comunes en español que deben ser ignoradas
const palabrasIgnorar = new Set([
  // Artículos
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  
  // Conjunciones
  'y', 'o', 'pero', 'si', 'que', 'como', 'cuando', 'donde', 'porque', 'pues', 'aunque', 'mientras', 'ni', 'sino',
  
  // Preposiciones
  'a', 'ante', 'bajo', 'con', 'contra', 'de', 'del', 'desde', 'durante', 'en', 'entre', 'hacia', 'hasta', 'mediante', 'para', 'por', 'según', 'sin', 'sobre', 'tras',
  
  // Pronombres personales
  'yo', 'tú', 'él', 'ella', 'nosotros', 'nosotras', 'vosotros', 'vosotras', 'ellos', 'ellas', 'me', 'te', 'le', 'nos', 'os', 'les',
  
  // Pronombres demostrativos
  'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'aquellos', 'aquellas',
  
  // Pronombres posesivos
  'mi', 'tu', 'su', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'vuestro', 'vuestra', 'vuestros', 'vuestras',
  
  // Pronombres relativos
  'que', 'quien', 'cuyo', 'cuyos', 'cuya', 'cuyas', 'donde', 'cuando', 'como',
  
  // Pronombres interrogativos
  'qué', 'quién', 'cuál', 'cuáles', 'dónde', 'cuándo', 'cómo', 'por qué',
  
  // Adverbios comunes
  'muy', 'más', 'menos', 'bien', 'mal', 'aquí', 'allí', 'ahora', 'antes', 'después', 'siempre', 'nunca', 'también', 'tampoco', 'sí', 'no',
  
  // Verbos auxiliares comunes
  'es', 'son', 'está', 'están', 'ha', 'han', 'he', 'hemos', 'habéis', 'han', 'ser', 'estar', 'haber', 'tener', 'hacer', 'ir', 'venir', 'decir', 'ver', 'saber',
  
  // Palabras de relleno
  'pues', 'bueno', 'vale', 'claro', 'exacto', 'preciso', 'justo', 'simplemente', 'únicamente', 'solamente', 'también', 'además', 'incluso', 'hasta', 'incluso',
  
  // Números básicos
  'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'primero', 'segundo', 'tercero', 'cuarto', 'quinto',
  
  // Meses
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  
  // Palabras muy comunes
  'todo', 'toda', 'todos', 'todas', 'algo', 'nada', 'alguien', 'nadie', 'cada', 'cualquier', 'cualquiera', 'otro', 'otra', 'otros', 'otras', 'mismo', 'misma', 'mismos', 'mismas'
]);

export function WordCloudChart({ data }: WordCloudChartProps) {
  const { posts, comments } = data;

  // Extraer palabras de los textos de los posts y asociarlas con sentimientos
  const words = useMemo(() => {
    const wordData: { [key: string]: { count: number; sentiment: string } } = {};
    
    // Debug: mostrar información en consola
    console.log('=== DEBUG WORDCLOUD ===');
    console.log('Posts disponibles:', posts.length);
    console.log('Comentarios disponibles:', comments.length);
    
    posts.forEach(post => {
      if (post.p_text) {
        // Limpiar y dividir el texto en palabras
        const words = post.p_text
          .toLowerCase()
          .replace(/[^\w\sáéíóúñ]/g, '') // Remover caracteres especiales pero mantener acentos
          .split(/\s+/)
          .filter(word => {
            // Filtrar palabras: longitud mínima y no estar en la lista de ignoradas
            return word.length > 2 && !palabrasIgnorar.has(word);
          });
        
        words.forEach(word => {
          if (wordData[word]) {
            wordData[word].count++;
          } else {
            // Buscar el sentimiento predominante de esta palabra en los comentarios
            const relatedComments = comments.filter(comment => 
              comment.c_text && comment.c_text.toLowerCase().includes(word)
            );
            
            let positiveCount = 0;
            let negativeCount = 0;
            let neutralCount = 0;
            
            relatedComments.forEach(comment => {
              switch (comment.c_clasificacion) {
                case 'positive':
                  positiveCount++;
                  break;
                case 'negative':
                  negativeCount++;
                  break;
                case 'neutral':
                  neutralCount++;
                  break;
              }
            });
            
            // Determinar el sentimiento predominante
            let predominantSentiment = 'neutral';
            if (positiveCount > negativeCount && positiveCount > neutralCount) {
              predominantSentiment = 'positive';
            } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
              predominantSentiment = 'negative';
            }
            
            wordData[word] = {
              count: 1,
              sentiment: predominantSentiment
            };
          }
        });
      }
    });

    // Debug: mostrar palabras encontradas
    console.log('Palabras únicas encontradas:', Object.keys(wordData).length);
    console.log('Distribución de palabras:', Object.entries(wordData).slice(0, 10));

    // Convertir a array y ordenar por frecuencia
    const result = Object.entries(wordData)
      .map(([text, data]) => ({ text, value: data.count, sentiment: data.sentiment }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 25); // Limitar a 25 palabras máximo

    console.log('Palabras finales para wordcloud:', result.length);
    
    // Si no hay suficientes palabras reales, mostrar mensaje en lugar de mock data
    if (result.length < 5) {
      console.log('No hay suficientes palabras reales, mostrando mensaje de no datos');
      return [];
    }
    
    return result;
  }, [posts, comments]);

  // Si no hay palabras, mostrar mensaje
  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No hay datos disponibles</p>
          <p className="text-xs">Los datos de palabras se generarán automáticamente</p>
        </div>
      </div>
    );
  }

  // Función para obtener colores pasteles profesionales aleatorios
  const getRandomPastelColor = (text: string) => {
    // Usar el texto como seed para generar colores consistentes
    const colors = [
      // Azules pasteles
      "#B8E6B8", // Verde azulado suave
      "#B8D4E6", // Azul cielo pastel
      "#D4B8E6", // Lavanda suave
      "#E6B8D4", // Rosa pastel
      "#E6D4B8", // Beige cálido
      "#D4E6B8", // Verde lima suave
      
      // Verdes pasteles
      "#C8E6C9", // Verde menta
      "#A5D6A7", // Verde manzana
      "#81C784", // Verde esmeralda suave
      "#66BB6A", // Verde bosque pastel
      
      // Azules pasteles
      "#90CAF9", // Azul cielo
      "#64B5F6", // Azul marino suave
      "#42A5F5", // Azul océano
      "#2196F3", // Azul profesional
      
      // Púrpuras pasteles
      "#CE93D8", // Púrpura orquídea
      "#BA68C8", // Púrpura violeta
      "#AB47BC", // Púrpura amatista
      "#9C27B0", // Púrpura real
      
      // Rosas pasteles
      "#F8BBD9", // Rosa bebé
      "#F48FB1", // Rosa coral
      "#F06292", // Rosa frambuesa
      "#EC407A", // Rosa magenta
      
      // Naranjas pasteles
      "#FFCC80", // Naranja melocotón
      "#FFB74D", // Naranja albaricoque
      "#FFA726", // Naranja mandarina
      "#FF9800", // Naranja atardecer
      
      // Amarillos pasteles
      "#FFF59D", // Amarillo limón
      "#FFF176", // Amarillo sol
      "#FFEE58", // Amarillo dorado
      "#FFEB3B", // Amarillo canario
      
      // Rojos pasteles
      "#EF9A9A", // Rojo coral suave
      "#E57373", // Rojo salmón
      "#EF5350", // Rojo tomate
      "#F44336", // Rojo frambuesa
      
      // Grises pasteles
      "#E0E0E0", // Gris perla
      "#BDBDBD", // Gris plata
      "#9E9E9E", // Gris acero
      "#757575", // Gris carbón suave
    ];
    
    // Generar un hash simple del texto para selección consistente
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a entero de 32 bits
    }
    
    // Usar el hash para seleccionar un color
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Crear un mapa para acceder a los datos de sentimiento
  const sentimentMap = new Map(words.map(w => [w.text, w.sentiment]));

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Wordcloud
        words={words}
        width={300}
        height={250}
        fontSize={(d) => Math.max(d.value * 0.6, 10)} // Reducir multiplicador para evitar superposición
        font="Inter, system-ui, sans-serif"
        padding={3} // Aumentar padding para separar palabras
        rotate={0}
        random={() => 0.5} // Para posicionamiento más estable
        spiral="archimedean" // Usar espiral de Arquímedes para mejor distribución
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => {
            const sentiment = sentimentMap.get(w.text) || 'neutral';
  return (
              <text
                key={w.text}
                fill={getRandomPastelColor(w.text)} // Usar colores pasteles aleatorios
                textAnchor="middle"
                transform={`translate(${w.x}, ${w.y})rotate(${w.rotate})`}
                fontSize={w.size}
                fontWeight="normal"
          style={{
                  cursor: 'pointer',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = `translate(${w.x}, ${w.y})rotate(${w.rotate}) scale(1.1)`;
                  e.currentTarget.style.transition = 'transform 0.2s ease';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `translate(${w.x}, ${w.y})rotate(${w.rotate}) scale(1)`;
                }}
              >
                {w.text}
              </text>
            );
          })
        }
      </Wordcloud>
    </div>
  );
}
