import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidad | MMM Chile',
    description: 'Política de privacidad y protección de datos del Movimiento Misionero Mundial en Chile.',
};

export default function PrivacidadPage() {
    return (
        <main className="min-h-screen bg-[#F8F6F0] pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="font-serif text-4xl text-[#0F2035] mb-8">Política de Privacidad</h1>
                
                <div className="text-[#2D2D2D] text-lg leading-relaxed">
                    <p className="mb-8 text-[#6B7280] text-base">Última actualización: {new Date().toLocaleDateString('es-CL')}</p>
                    
                    <h2 className="text-2xl font-serif text-[#0F2035] mt-10 mb-4">1. Información que recopilamos</h2>
                    <p className="mb-4">
                        En el Movimiento Misionero Mundial en Chile (MMM Chile), recopilamos información personal que usted nos proporciona voluntariamente al:
                    </p>
                    <ul className="list-disc pl-6 mb-8 space-y-2 marker:text-[#D4A843]">
                        <li>Llenar formularios de contacto, registro en planes de lectura o peticiones de oración.</li>
                        <li>Suscribirse a nuestro boletín informativo.</li>
                        <li>Interactuar con nuestra plataforma a través de comentarios o consultas.</li>
                    </ul>
                    <p className="mb-8">
                        Esta información puede incluir su nombre, dirección de correo electrónico, número de teléfono y cualquier otra información que decida compartir con nosotros.
                    </p>

                    <h2 className="text-2xl font-serif text-[#0F2035] mt-10 mb-4">2. Uso de la información</h2>
                    <p className="mb-4">
                        Utilizamos la información recopilada para:
                    </p>
                    <ul className="list-disc pl-6 mb-8 space-y-2 marker:text-[#D4A843]">
                        <li>Responder a sus peticiones de oración y mensajes.</li>
                        <li>Enviar boletines informativos, devocionales y actualizaciones (solo si ha dado su consentimiento).</li>
                        <li>Mejorar nuestra plataforma y adaptar el contenido a las necesidades de nuestra comunidad.</li>
                        <li>Analizar el tráfico del sitio web mediante herramientas como Google Analytics para optimizar la experiencia del usuario.</li>
                    </ul>

                    <h2 className="text-2xl font-serif text-[#0F2035] mt-10 mb-4">3. Protección de datos</h2>
                    <p className="mb-8">
                        Mantenemos medidas de seguridad técnicas y organizativas adecuadas para proteger su información personal contra acceso no autorizado, pérdida o alteración. No vendemos, alquilamos ni compartimos su información personal con terceros para fines comerciales.
                    </p>

                    <h2 className="text-2xl font-serif text-[#0F2035] mt-10 mb-4">4. Sus derechos</h2>
                    <p className="mb-4">
                        Usted tiene derecho a:
                    </p>
                    <ul className="list-disc pl-6 mb-8 space-y-2 marker:text-[#D4A843]">
                        <li>Acceder a sus datos personales almacenados en nuestra plataforma.</li>
                        <li>Solicitar la corrección de datos inexactos.</li>
                        <li>Solicitar la eliminación de su información personal.</li>
                        <li>Darse de baja de nuestras comunicaciones en cualquier momento.</li>
                    </ul>

                    <h2 className="text-2xl font-serif text-[#0F2035] mt-10 mb-4">5. Contacto</h2>
                    <p className="mb-8">
                        Si tiene alguna pregunta sobre esta Política de Privacidad o el tratamiento de sus datos, puede contactarnos a través de nuestra página de contacto u otros medios oficiales proporcionados en este sitio.
                    </p>
                </div>
            </div>
        </main>
    );
}
