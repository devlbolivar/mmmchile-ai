import { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
    title: "Panel de Oración | MMM Chile",
    robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-warm-bg px-6">
            <LoginForm />
        </div>
    );
}
