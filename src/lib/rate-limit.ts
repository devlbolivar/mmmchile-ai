import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function checkRateLimit({
    endpoint,
    maxRequests = 5,
    windowMinutes = 60,
}: {
    endpoint: string;
    maxRequests?: number;
    windowMinutes?: number;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const headersList = await headers();
        // Fallback to a default if ip is missing in development
        const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "127.0.0.1";
        
        // 1. Check recent requests
        const timeAgo = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
        
        const { count, error: countError } = await supabase
            .from("rate_limits")
            .select("*", { count: "exact", head: true })
            .eq("ip_address", ip)
            .eq("endpoint", endpoint)
            .gte("created_at", timeAgo);

        if (countError) {
            console.error("Rate limit count error:", countError);
            // Allow the request to proceed if there's a db error to prevent blocking valid users
            return { success: true };
        }

        if (count !== null && count >= maxRequests) {
            return { 
                success: false, 
                error: `Has superado el límite de intentos. Por favor, intenta de nuevo en ${windowMinutes} minutos.` 
            };
        }

        // 2. Log this new request
        const { error: insertError } = await supabase
            .from("rate_limits")
            .insert({
                ip_address: ip,
                endpoint: endpoint
            });
            
        if (insertError) {
             console.error("Rate limit insert error:", insertError);
        }

        // 3. Trigger periodic cleanup asynchronously (e.g. roughly 1 in 100 requests)
        if (Math.random() < 0.01) {
             supabase.rpc("prune_rate_limits").then(({error}) => {
                if(error) console.error("Error pruning rate limits:", error)
             });
        }

        return { success: true };
    } catch (err) {
        console.error("Unexpected error checking rate limit:", err);
        return { success: true }; // Allow on error
    }
}
