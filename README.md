# 🏠 SentiData Dashboard

<div align="center">

![SentiData Logo](public/icono-vivienda.png)

**Dashboard de Percepción Ciudadana para el Sector Saneamiento**

[![Deploy Status](https://img.shields.io/badge/Deploy-Vercel-00C7B7?style=for-the-badge&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.56.0-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

</div>

## 📋 Descripción

**SentiData** es un proyecto innovador que emplea **Inteligencia Artificial** para recoger y analizar la percepción ciudadana sobre el sector saneamiento, convirtiéndola en una herramienta estratégica para la mejora continua de los servicios públicos.

El dashboard proporciona análisis en tiempo real de:
- 📊 **Distribución de sentimientos** (positivo, negativo, neutral)
- 📈 **Tendencias temporales** de interacciones
- 🏷️ **Categorización automática** de posts y comentarios
- ☁️ **Nube de palabras** más frecuentes
- 📱 **Análisis por plataformas** sociales

## ✨ Características Principales

### 🔐 **Autenticación Segura**
- Sistema de login con Supabase Auth
- Row Level Security (RLS) implementado
- Protección de datos sensibles

### 📊 **Dashboard Interactivo**
- **KPIs en tiempo real**: Posts, comentarios, interacciones
- **Filtros dinámicos**: Por fecha, categoría y sentimiento
- **Gráficos responsivos**: Adaptados a todos los dispositivos
- **Actualización automática**: Datos frescos constantemente

### 🎯 **Análisis Avanzado**
- **Distribución de Categorías**: Análisis por temas específicos
- **Tendencias Temporales**: Evolución de la percepción ciudadana
- **Análisis de Sentimientos**: Clasificación automática de emociones
- **Word Cloud**: Palabras más relevantes del sector

### 📱 **Experiencia de Usuario**
- **Diseño Responsivo**: Optimizado para móviles y desktop
- **Interfaz Intuitiva**: Navegación clara y accesible
- **Loading States**: Feedback visual durante cargas
- **Error Handling**: Manejo robusto de errores

## 🛠️ Stack Tecnológico

### **Frontend**
- **React 18.3.1** - Framework principal
- **TypeScript 5.8.3** - Tipado estático
- **Vite 5.4.19** - Build tool y dev server
- **Tailwind CSS 3.4.17** - Framework de estilos
- **shadcn/ui** - Componentes de UI

### **Backend & Base de Datos**
- **Supabase 2.56.0** - Backend-as-a-Service
- **PostgreSQL** - Base de datos relacional
- **Row Level Security** - Seguridad a nivel de fila

### **Visualización de Datos**
- **Recharts 2.15.4** - Gráficos interactivos
- **@visx/wordcloud 3.12.0** - Nube de palabras
- **Lucide React** - Iconografía

### **Routing & Estado**
- **React Router DOM 6.30.1** - Navegación SPA
- **React Hooks** - Gestión de estado
- **Custom Hooks** - Lógica reutilizable

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/sentidata-dashboard.git
cd sentidata-dashboard
```

### **2. Instalar Dependencias**
```bash
npm install
```

### **3. Configurar Variables de Entorno**
Crear archivo `.env.local`:
```bash
VITE_SUPABASE_URL=https://swvfdpcvffihyscldier.supabase.co
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
```

### **4. Configurar Base de Datos**
Ejecutar el script SQL en Supabase:
```sql
-- Ver archivo: supabase-rls-setup.sql
-- Configura RLS y políticas de seguridad
```

### **5. Ejecutar en Desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

## 📊 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── dashboard/       # Componentes específicos del dashboard
│   │   ├── charts/      # Gráficos y visualizaciones
│   │   ├── KPICards.tsx # Tarjetas de métricas
│   │   └── ...
│   └── ui/              # Componentes base (shadcn/ui)
├── hooks/               # Custom hooks
│   ├── use-dashboard-data.ts
│   ├── use-auth.ts
│   └── use-categories.ts
├── integrations/        # Integraciones externas
│   └── supabase/        # Cliente y tipos de Supabase
├── pages/               # Páginas de la aplicación
└── App.tsx              # Componente principal
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run build:prod       # Build optimizado para producción
npm run preview          # Preview del build local

# Calidad de código
npm run lint             # Ejecutar ESLint
npm run lint:fix         # Corregir errores automáticamente

# Deploy
npm run vercel-build     # Build específico para Vercel
```

## 🌐 Deploy en Producción

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Configuración de Variables en Vercel**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Ver [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md) para instrucciones detalladas.

## 🔐 Autenticación

### **Configuración de Seguridad**
- Row Level Security (RLS) habilitado
- Políticas de acceso configuradas
- Autenticación requerida para datos sensibles

## 📈 Uso del Dashboard

### **1. Acceso**
- Navegar a `/login`
- Ingresar credenciales
- Redirección automática al dashboard

### **2. Filtros Disponibles**
- **Período**: Anual o mensual
- **Año**: Selección de año específico
- **Mes**: Filtro mensual (si aplica)
- **Categoría**: Temas específicos del sector
- **Sentimiento**: Positivo, negativo, neutral

### **3. Métricas Principales**
- **Total de Posts**: Cantidad de publicaciones
- **Total de Comentarios**: Interacciones ciudadanas
- **Total de Interacciones**: Likes, shares, comentarios
- **Distribución de Sentimientos**: Análisis emocional

## 🤝 Contribución

### **1. Fork del Proyecto**
```bash
git fork https://github.com/tu-usuario/sentidata-dashboard.git
```

### **2. Crear Rama de Feature**
```bash
git checkout -b feature/nueva-funcionalidad
```

### **3. Commit de Cambios**
```bash
git commit -m "feat: agregar nueva funcionalidad"
```

### **4. Push y Pull Request**
```bash
git push origin feature/nueva-funcionalidad
```

### **Estándares de Código**
- TypeScript estricto
- ESLint configurado
- Componentes funcionales con hooks
- Nomenclatura clara y descriptiva

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🏛️ Ministerio de Vivienda

<div align="center">

![Ministerio de Vivienda](public/logo-ministerio.png)

**Proyecto desarrollado para el Ministerio de Vivienda, Construcción y Saneamiento**

</div>

## 📞 Soporte

Para soporte técnico o consultas:
- **Email**: soporte@sentidata.gob.pe
- **Documentación**: [Wiki del Proyecto](https://github.com/tu-usuario/sentidata-dashboard/wiki)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/sentidata-dashboard/issues)

## 🎯 Roadmap

### **Próximas Funcionalidades**
- [ ] **Exportación de Reportes** (PDF, Excel)
- [ ] **Alertas Automáticas** por cambios significativos
- [ ] **API REST** para integraciones externas
- [ ] **Dashboard Móvil** (PWA)
- [ ] **Análisis Predictivo** con ML
- [ ] **Integración con más plataformas** sociales

---

<div align="center">

**Desarrollado con ❤️ para mejorar los servicios públicos**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/tu-usuario/sentidata-dashboard)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-00C7B7?style=for-the-badge&logo=vercel)](https://sentidata-dashboard.vercel.app)

</div>