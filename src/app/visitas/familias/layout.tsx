import { redirect } from "next/navigation";
import { getVisitasSession } from "@/lib/supabase/visitas-session";

export default async function FamiliasLayout({ children }: { children: React.ReactNode }) {
    const { profile } = await getVisitasSession();

    if (profile?.role !== "admin") {
        redirect("/visitas");
    }

    return <>{children}</>;
}
