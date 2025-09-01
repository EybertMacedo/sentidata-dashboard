-- ========================================
-- CONFIGURACIÓN DE RLS CON AUTENTICACIÓN
-- PARA CIUDAD VIBES DASHBOARD
-- ========================================

-- 1. HABILITAR RLS EN LAS TABLAS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 2. CREAR POLÍTICAS PARA POSTS (con autenticación)
-- Política que permite leer todos los posts a usuarios autenticados
CREATE POLICY "Allow authenticated users to read posts" ON posts
FOR SELECT TO authenticated
USING (true);

-- Política que permite insertar posts a usuarios autenticados
CREATE POLICY "Allow authenticated users to insert posts" ON posts
FOR INSERT TO authenticated
WITH CHECK (true);

-- Política que permite actualizar posts a usuarios autenticados
CREATE POLICY "Allow authenticated users to update posts" ON posts
FOR UPDATE TO authenticated
USING (true);

-- Política que permite eliminar posts a usuarios autenticados
CREATE POLICY "Allow authenticated users to delete posts" ON posts
FOR DELETE TO authenticated
USING (true);

-- 3. CREAR POLÍTICAS PARA COMMENTS (con autenticación)
-- Política que permite leer todos los comentarios a usuarios autenticados
CREATE POLICY "Allow authenticated users to read comments" ON comments
FOR SELECT TO authenticated
USING (true);

-- Política que permite insertar comentarios a usuarios autenticados
CREATE POLICY "Allow authenticated users to insert comments" ON comments
FOR INSERT TO authenticated
WITH CHECK (true);

-- Política que permite actualizar comentarios a usuarios autenticados
CREATE POLICY "Allow authenticated users to update comments" ON comments
FOR UPDATE TO authenticated
USING (true);

-- Política que permite eliminar comentarios a usuarios autenticados
CREATE POLICY "Allow authenticated users to delete comments" ON comments
FOR DELETE TO authenticated
USING (true);

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

-- 5. VERIFICAR QUE EL USUARIO EXISTE
-- Buscar el usuario en la tabla auth.users
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE email = 'santiagozevallos.01@gmail.com';

-- 6. CREAR USUARIO SI NO EXISTE (opcional)
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES (
--     gen_random_uuid(),
--     'santiagozevallos.01@gmail.com',
--     crypt('1234', gen_salt('bf')),
--     now(),
--     now(),
--     now()
-- );

-- ========================================
-- NOTAS IMPORTANTES:
-- ========================================
-- 1. Este script configura RLS para usuarios autenticados
-- 2. Solo usuarios con sesión activa pueden acceder a los datos
-- 3. Las políticas usan 'authenticated' en lugar de 'public'
-- 4. El usuario debe existir en auth.users para funcionar
-- 5. Si el usuario no existe, créalo desde el dashboard de Supabase
-- 6. Ejecuta este script en el SQL Editor de Supabase
