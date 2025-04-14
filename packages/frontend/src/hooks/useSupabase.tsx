import supabase from "../supabaseClient";

const useSupabase = () => {
    // Get the texture URL
    function getAssetUrl(bucket: string, fileName: string) {
        try {
            // console.log(`Getting URL for ${bucket}/${fileName}`);
            const { data } = supabase
                .storage
                .from(bucket)
                .getPublicUrl(fileName);

            if (!data?.publicUrl) {
                throw new Error(`No public URL for: ${bucket}/${fileName}`);
            }
            
            // console.log("Got Supabase URL:", data.publicUrl);
            return data.publicUrl;
        } catch (error) {
            console.error("Supabase getAssetUrl error:", error);
            throw error;
        }
    }

    return { getAssetUrl };
}

export default useSupabase;
