import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";

export const metadata: Metadata = {
    title: "Crear contraseña | MMM Chile",
    robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-warm-bg px-6">
            <ResetPasswordForm />
        </div>
    );
}
