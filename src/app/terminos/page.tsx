import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Términos y Condiciones | MMM Chile',
    description: 'Términos y condiciones de uso de la plataforma del Movimiento Misionero Mundial en Chile.',
};

export default function TerminosPage() {
    return (
        <main className="min-h-screen bg-[#F8F6F0] pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="font-serif text-4xl text-[#0F2035] mb-8">Términos y Condiciones</h1>
                
                <div className="text-[#2D2D2D] text-lg leading-relaxed">
                    <p className="mb-8 text-[#6B7280] text-base">Última actualización: {new Date().toLocaleDateString('es-CL')}</p>
                    
                    <h2 className="text-2xl font-serif text-[#0F2035] mt-10 mb-4">1. Aceptación de los términos</h2>
                    <p className="mb-8">
                        Al acceder y utilizar el sitio web del Movimiento Misionero Mundial en Chile (mmmchile.cl), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le rogamos que no utilice nuestra plataforma.
                    </p>

                    <h2 className="text-2xl font-serif text-[#0F2035] mt-10 mb-4">2. Uso de la plataforma</h2>
                    <p className="mb-4">
                        Esta plataforma tiene como objetivo compartir el mensaje del Evangelio, proveer recursos espirituales e informar sobre las actividades de nuestra iglesia. Usted se compromete a:
                    </p>
                    <ul className="list-disc pl-6 mb-8 space-y-2 marker:text-[#D4A843]">
                        <li>Utilizar la plataforma con fines lícitos y respetuosos.</li>
                        <li>No enviar contenido difamatorio, ofensivo, discriminatorio o inapropiado a través de los formularios o muros de oración.</li>
                        <li>No intentar vulnerar la seguridad de la plataforma ni afectar su funcionamiento normal.</li>
                    </ul>

                    <h2 className="text-2xl font-serif text-[#0F2035] mt-10 mb-4">3. Contenido y Propiedad Intelectual</h2>
                    <p className="mb-8">
                        Todo el contenido publicado en este sitio (textos, artículos, imágenes, diseños, grabaciones de audio/video de la radio y transmisiones en vivo) es propiedad del Movimiento Misionero Mundial en Chile o está utilizado con el debido permiso. Queda prohibida su reproducción para fines comerciales sin autorización previa por escrito.
                    </p>

                    <h2 className="text-2xl font-serif text-[#0F2035] mt-10 mb-4">4. Peticiones de Oración y Comentarios</h2>
                    <p className="mb-8">
                        Al enviar una petición de oración o comentario público, usted otorga permiso para que este contenido sea visible por nuestra comunidad según la configuración de privacidad elegida. Nos reservamos el derecho de moderar, editar o eliminar contenido que no cumpla con los propósitos cristianos y de edificación de esta plataforma.
                    </p>

                    <h2 className="text-2xl font-serif text-[#0F2035] mt-10 mb-4">5. Enlaces a terceros</h2>
                    <p className="mb-8">
                        Nuestro sitio puede contener enlaces a sitios web de terceros (como plataformas de streaming o redes sociales). No tenemos control sobre el contenido ni las políticas de privacidad de dichos sitios, y no asumimos responsabilidad por ellos.
                    </p>

                    <h2 className="text-2xl font-serif text-[#0F2035] mt-10 mb-4">6. Modificaciones</h2>
                    <p className="mb-8">
                        Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigencia inmediatamente después de su publicación en el sitio web. El uso continuo de la plataforma constituye la aceptación de los términos modificados.
                    </p>
                </div>
            </div>
        </main>
    );
}
