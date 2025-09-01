-- ========================================
-- VERIFICACIÓN DE CONFIGURACIÓN RLS
-- PARA CIUDAD VIBES DASHBOARD
-- ========================================

-- 1. VERIFICAR ESTADO DE RLS EN TABLAS
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN '✅ RLS HABILITADO'
        ELSE '❌ RLS DESHABILITADO'
    END as estado_rls
FROM pg_tables 
WHERE tablename IN ('posts', 'comments')
ORDER BY tablename;

-- 2. VERIFICAR POLÍTICAS CREADAS
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    CASE 
        WHEN cmd = 'SELECT' THEN '📖 LECTURA'
        WHEN cmd = 'INSERT' THEN '➕ INSERCIÓN'
        WHEN cmd = 'UPDATE' THEN '✏️ ACTUALIZACIÓN'
        WHEN cmd = 'DELETE' THEN '🗑️ ELIMINACIÓN'
        ELSE cmd
    END as tipo_operacion,
    permissive,
    roles
FROM pg_policies 
WHERE tablename IN ('posts', 'comments')
ORDER BY tablename, cmd;

-- 3. VERIFICAR ÍNDICES CREADOS
SELECT 
    indexname,
    tablename,
    CASE 
        WHEN indexname LIKE 'idx_%' THEN '✅ ÍNDICE PERSONALIZADO'
        ELSE '🔧 ÍNDICE DEL SISTEMA'
    END as tipo_indice,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('posts', 'comments')
ORDER BY tablename, indexname;

-- 4. VERIFICAR PERMISOS DE USUARIO
SELECT 
    grantee,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name IN ('posts', 'comments')
AND grantee = 'anon'
ORDER BY table_name, privilege_type;

-- 5. VERIFICAR CONFIGURACIÓN DE CONSULTAS
-- Probar consulta sin límite
SELECT 
    'posts' as tabla,
    COUNT(*) as total_registros,
    'Sin límite' as tipo_consulta
FROM posts
UNION ALL
SELECT 
    'comments' as tabla,
    COUNT(*) as total_registros,
    'Sin límite' as tipo_consulta
FROM comments;

-- 6. VERIFICAR DISTRIBUCIÓN DE SENTIMIENTOS
SELECT 
    c_clasificacion,
    COUNT(*) as cantidad,
    ROUND(
        (COUNT(*) * 100.0) / (SELECT COUNT(*) FROM comments), 
        2
    ) as porcentaje
FROM comments 
GROUP BY c_clasificacion
ORDER BY cantidad DESC;

-- ========================================
-- RESULTADOS ESPERADOS:
-- ========================================
-- ✅ RLS debe estar habilitado en ambas tablas
-- ✅ Deben existir 4 políticas por tabla (SELECT, INSERT, UPDATE, DELETE)
-- ✅ Deben existir índices personalizados para p_time, p_platform, c_time, c_clasificacion
-- ✅ El usuario 'anon' debe tener permisos SELECT, INSERT, UPDATE, DELETE
-- ✅ Las consultas COUNT deben devolver 359 posts y 2725 comments
-- ✅ La distribución de sentimientos debe mostrar Positiva, Negativa, Neutral





