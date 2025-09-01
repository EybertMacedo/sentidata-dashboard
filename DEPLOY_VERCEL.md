# 🚀 Deploy en Vercel - SentiData Dashboard

## 📋 Preparación Completada

### ✅ **Archivos de Configuración Creados:**

1. **`vercel.json`** - Configuración de routing y headers de seguridad
2. **Variables de entorno** - Configuradas en el cliente de Supabase
3. **`vite.config.ts`** - Optimizado para producción con code splitting
4. **`.gitignore`** - Actualizado para excluir archivos innecesarios
5. **`package.json`** - Información del proyecto actualizada

## 🔧 Configuración de Variables de Entorno

### **Variables Requeridas en Vercel:**

```bash
VITE_SUPABASE_URL=https://swvfdpcvffihyscldier.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3dmZkcGN2ZmZpaHlzY2xkaWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTEyMTIsImV4cCI6MjA3MTIyNzIxMn0.pZFYkfoUjauNjMSED5h7u-VuCYx21PgsMhc6DLI4Z4k
```

## 🚀 Pasos para Deploy en Vercel

### **1. Preparar el Repositorio:**
```bash
# Asegurar que todos los cambios estén committeados
git add .
git commit -m "feat: prepare for Vercel deployment"
git push origin main
```

### **2. Conectar con Vercel:**

#### **Opción A: Vía CLI de Vercel**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Deploy desde el directorio del proyecto
vercel

# Seguir las instrucciones interactivas
```

#### **Opción B: Vía Dashboard de Vercel**
1. Ir a [vercel.com](https://vercel.com)
2. Hacer login con GitHub
3. Click en "New Project"
4. Importar el repositorio de GitHub
5. Configurar las variables de entorno
6. Deploy

### **3. Configurar Variables de Entorno en Vercel:**

1. **En el Dashboard de Vercel:**
   - Ir a Project Settings → Environment Variables
   - Agregar las variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

2. **O vía CLI:**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### **4. Configuración del Build:**

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### **5. Dependencias Requeridas:**

Asegúrate de que todas las dependencias estén instaladas, especialmente:
- **Terser**: Para minificación de código JavaScript
- **Todas las dependencias de desarrollo**: Para el proceso de build

## 🔍 Verificación Post-Deploy

### **1. Funcionalidades a Verificar:**
- ✅ **Autenticación**: Login con credenciales
- ✅ **Dashboard**: Carga de datos y gráficos
- ✅ **Filtros**: Funcionamiento de filtros de fecha, categoría y sentimiento
- ✅ **Responsive**: Funcionamiento en móviles
- ✅ **Performance**: Tiempos de carga aceptables

### **2. URLs de Prueba:**
- **Login**: `https://tu-proyecto.vercel.app/login`
- **Dashboard**: `https://tu-proyecto.vercel.app/auth`
- **Credenciales**: `santiagozevallos.01@gmail.com:1234`

## 📊 Optimizaciones Implementadas

### **Build Optimizations:**
- **Code Splitting**: Separación de vendor, supabase, charts y UI
- **Minificación**: Terser para optimización de código
- **Source Maps**: Deshabilitados para producción
- **Chunking**: Carga eficiente de dependencias

### **Security Headers:**
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **X-XSS-Protection**: `1; mode=block`

### **Routing:**
- **SPA Routing**: Todas las rutas redirigen a `index.html`
- **Client-side Navigation**: React Router maneja la navegación

## 🚨 Consideraciones Importantes

### **Supabase RLS:**
- ✅ **RLS habilitado** en las tablas `posts` y `comments`
- ✅ **Políticas configuradas** para usuarios autenticados
- ✅ **Autenticación requerida** para acceder a datos

### **Performance:**
- **Lazy Loading**: Componentes cargados bajo demanda
- **Memoización**: React.memo en componentes pesados
- **Paginación**: Datos cargados en lotes para mejor performance

### **Monitoreo:**
- **Vercel Analytics**: Habilitar para monitoreo de performance
- **Error Tracking**: Considerar Sentry para tracking de errores
- **Uptime Monitoring**: Configurar alertas de disponibilidad

## 🔄 Comandos Útiles

### **Deploy Manual:**
```bash
# Build local
npm run build

# Preview local
npm run preview

# Deploy a Vercel
vercel --prod
```

### **Logs y Debugging:**
```bash
# Ver logs de deploy
vercel logs

# Ver logs en tiempo real
vercel logs --follow
```

## 🚨 Troubleshooting

### **Error: "terser not found"**
```bash
# Solución: Instalar terser como dependencia de desarrollo
npm install --save-dev terser

# O reinstalar todas las dependencias
rm -rf node_modules package-lock.json
npm install
```

### **Error: "Build failed"**
```bash
# Verificar que todas las dependencias estén instaladas
npm install

# Verificar variables de entorno
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### **Error: "Module not found"**
```bash
# Limpiar cache y reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📈 Próximos Pasos

1. **Configurar dominio personalizado** (opcional)
2. **Habilitar Vercel Analytics** para monitoreo
3. **Configurar CI/CD** para deploys automáticos
4. **Implementar testing** en el pipeline de deploy
5. **Configurar backup** de la base de datos

---

**¡El proyecto está listo para deploy en Vercel!** 🚀
