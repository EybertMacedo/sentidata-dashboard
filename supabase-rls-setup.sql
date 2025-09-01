-- ========================================
-- CONFIGURACIÓN DE ROW LEVEL SECURITY (RLS)
-- PARA CIUDAD VIBES DASHBOARD
-- ========================================

-- 1. HABILITAR RLS EN LAS TABLAS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 2. CREAR POLÍTICAS PARA POSTS
-- Política que permite leer todos los posts (sin límite de filas)
CREATE POLICY "Allow unlimited posts read" ON posts
FOR SELECT USING (true);

-- Política que permite insertar posts
CREATE POLICY "Allow posts insert" ON posts
FOR INSERT WITH CHECK (true);

-- Política que permite actualizar posts
CREATE POLICY "Allow posts update" ON posts
FOR UPDATE USING (true);

-- Política que permite eliminar posts
CREATE POLICY "Allow posts delete" ON posts
FOR DELETE USING (true);

-- 3. CREAR POLÍTICAS PARA COMMENTS
-- Política que permite leer todos los comentarios (sin límite de filas)
CREATE POLICY "Allow unlimited comments read" ON comments
FOR SELECT USING (true);

-- Política que permite insertar comentarios
CREATE POLICY "Allow comments insert" ON comments
FOR INSERT WITH CHECK (true);

-- Política que permite actualizar comentarios
CREATE POLICY "Allow comments update" ON comments
FOR UPDATE USING (true);

-- Política que permite eliminar comentarios
CREATE POLICY "Allow comments delete" ON comments
FOR DELETE USING (true);

-- 4. VERIFICAR CONFIGURACIÓN
-- Mostrar el estado de RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('posts', 'comments');

-- Mostrar las políticas creadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('posts', 'comments');

-- 5. CONFIGURACIÓN ADICIONAL PARA MEJORAR RENDIMIENTO
-- Crear índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_posts_time ON posts(p_time);
CREATE INDEX IF NOT EXISTS idx_posts_platform ON posts(p_platform);
CREATE INDEX IF NOT EXISTS idx_comments_time ON comments(c_time);
CREATE INDEX IF NOT EXISTS idx_comments_clasificacion ON comments(c_clasificacion);

-- 6. VERIFICAR ÍNDICES
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('posts', 'comments')
ORDER BY tablename, indexname;

-- ========================================
-- NOTAS IMPORTANTES:
-- ========================================
-- 1. Este script debe ejecutarse en la consola SQL de Supabase
-- 2. Las políticas permiten acceso completo a los datos
-- 3. Los índices mejoran el rendimiento de las consultas
-- 4. RLS está habilitado pero no restringe el acceso
-- 5. Ahora podrás consultar más de 1000 filas por defecto





