
interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    // add other env vars here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  