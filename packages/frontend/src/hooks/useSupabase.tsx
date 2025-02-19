import { createClient } from "@supabase/supabase-js"


const useSupabase = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    // Create a supabase client
    const supabase = createClient(
        supabaseUrl,
        supabaseAnonKey
    )

    // Get the texture URL
    function getTextureUrl(from: string, fileName: string) {
        const { data } = supabase
            .storage
            .from(from)
            .getPublicUrl(fileName)

        if (!data) {
            throw new Error(`useSupabase: Error getting texture URL`)
        }
        
        return data.publicUrl
    }

    return { getTextureUrl }
}

export default useSupabase;
