
import supabase from "../supabaseClient";
const useSupabase = () => {
    // Get the texture URL
    function getAssetUrl(bucket: string, fileName: string) {
        const { data } = supabase
            .storage
            .from(bucket)
            .getPublicUrl(fileName)

        if (!data) {
            throw new Error(`useSupabase: Error getting texture URL: ${bucket}/${fileName}`)
        }
        
        return data.publicUrl
    }

    return { getAssetUrl }
}

export default useSupabase;
