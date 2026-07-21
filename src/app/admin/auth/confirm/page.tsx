import { Metadata } from "next";
import { AuthConfirmHandler } from "@/components/admin/AuthConfirmHandler";

export const metadata: Metadata = {
    title: "Verificando acceso | MMM Chile",
    robots: { index: false, follow: false },
};

export default function AuthConfirmPage() {
    return <AuthConfirmHandler />;
}
