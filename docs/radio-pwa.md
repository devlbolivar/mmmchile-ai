# Radio Bethel Chile — MVP instalable

## Distribución desde un enlace

Después de desplegar la rama en producción, compartir `https://mmmchile.cl/radio/app`.
`/radio` conserva la página existente y agrega acceso a la app e instalación.
El manifest tiene identidad estable `/radio/app`, inicio `/radio/app` y alcance
`/radio/`. No cambiar el ID al agregar funcionalidades.

- Android: abrir en Chrome y pulsar **Instalar radio**. Si el navegador no entrega
  el evento de instalación, se muestra una guía para usar su menú.
- iPhone/iPad: abrir en Safari → Compartir → Agregar a pantalla de inicio.
  Si aparece la opción «Abrir como app web», mantenerla activada.
- Si el enlace abre dentro de WhatsApp/Instagram, abrir en el navegador externo.
- La instalación web no requiere una cuenta de desarrollador ni pasar por tiendas.

## Alcance implementado

Vista independiente con áreas seguras, navegación inferior, reproductor compartido
con el sitio, programación (zona horaria America/Santiago), estados de conexión,
reintento manual, iconos PNG para Apple/Android y manifest standalone. Media Session
expone metadatos y acciones play/pause/stop donde el sistema las admite.
No hay reproducción automática ni permisos de notificación en este MVP.

El stream usa la configuración existente `NEXT_PUBLIC_RADIO_STREAM_URL`; el valor
por defecto es `https://radio.mmmchile.cl/stream`.

## Caché y actualizaciones

`public/radio/sw.js` guarda exclusivamente la pantalla offline y los iconos. No
cachea streams, páginas privadas, HTML de Next.js, respuestas RSC, API ni formularios.
La radio en vivo requiere internet. Al abrir sin red se muestra una pantalla clara
con reintento, no una promesa de audio offline. La programación solo permanece
disponible sin red si la app ya estaba abierta.

El worker se registra únicamente al visitar la radio. Su alcance es `/radio/`.
Cada nueva versión del contenido precacheado debe incrementar `bethel-radio-v1`.
No usa `skipWaiting`: una actualización no fuerza una recarga durante la escucha;
cierra todas las ventanas de la radio y vuelve a abrir para activar un worker nuevo.
Los recursos normales se obtienen de la red en la siguiente apertura.

## Google Play (paso posterior de distribución)

La PWA no genera un AAB automáticamente. Con el sitio desplegado y una cuenta
Google Play Console, empaquetar como Trusted Web Activity usando Bubblewrap:

```sh
npx @bubblewrap/cli init --manifest=https://mmmchile.cl/radio/manifest.webmanifest
npx @bubblewrap/cli build
```

Ejecutar en un directorio separado y seguir la configuración de Android SDK/JDK.
Elegir un applicationId definitivo y conservar la clave de firma fuera de Git.
Publicar `/.well-known/assetlinks.json` con el package name real y la huella SHA-256
del certificado de **Play App Signing**, no una huella ficticia ni solo la de subida.
Luego validar la asociación del dominio, subir el AAB a pruebas internas y completar
ficha, clasificación, privacidad y declaraciones de datos según el comportamiento
real de la app y sus servicios. No se ha creado ni subido un AAB en este cambio.

Referencia: https://developer.chrome.com/docs/android/trusted-web-activity/quick-start

## App Store (desarrollo y distribución adicionales)

Apple no recibe el manifest como aplicación. Requiere proyecto iOS, cuenta Apple
Developer, firma y distribución con App Store Connect/TestFlight. Una futura app
con Capacitor puede reutilizar la interfaz, pero debe resolver la integración nativa
de audio, interrupciones y modo de segundo plano, y preparar sus assets y ficha.
No basta con envolver la URL y asumir aprobación: Apple evalúa funcionalidad mínima
(regla 4.2). Este MVP no incluye un binario iOS ni garantiza aprobación de tiendas.

Referencia: https://developer.apple.com/app-store/review/guidelines/#minimum-functionality

## Verificación

```sh
node --test tests/radio-pwa.test.mjs
npx tsc --noEmit
npx eslint src/components/radio/radio-app.tsx src/components/radio/radio-install.tsx src/components/radio/RadioContext.tsx src/components/radio/RadioProviderWrapper.tsx src/components/layout/ConditionalLayout.tsx src/app/radio next.config.ts
npm run build
```

El build completo necesita las variables existentes de los otros módulos del sitio
(por ejemplo Supabase). No introducir valores ficticios para publicar.

Antes de anunciar el lanzamiento, probar en **iPhone y Android físicos**:

1. Abrir enlace, instalar y lanzar desde el icono. Confirmar ausencia de barra web.
2. Play/pause/reintento, pausa durante conexión y cambios de sección sin duplicar audio.
3. Pantalla bloqueada durante 10–15 minutos, controles multimedia y cambio de app.
4. Interrupción por llamada, auriculares/Bluetooth y cambio Wi-Fi/datos.
5. Pérdida y recuperación de conexión, cierre/apertura offline y botón Reintentar.
6. Apertura desde WhatsApp, instrucciones iOS, tamaño de texto ampliado y VoiceOver/TalkBack.

La emulación de navegador no demuestra instalación en iOS ni continuidad de audio
en segundo plano. Registrar dispositivo, versión del sistema y resultado real.

## Siguientes funcionalidades

Notificaciones opt-in por programa (backend de suscripciones/envío), reconexión
automática probada en dispositivos y audio nativo si la fiabilidad requerida supera
la ofrecida por el navegador. Ninguna de estas funciones se anuncia como disponible.
