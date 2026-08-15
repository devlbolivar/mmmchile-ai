import QRCode from 'qrcode'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2]
const outName = process.argv[3]

if (!url || !outName) {
    console.error('Uso: node scripts/generate-qr.mjs <url> <nombre-salida-sin-extension>')
    process.exit(1)
}

await mkdir('public/qr', { recursive: true })

const options = {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: { dark: '#1E3A5F', light: '#FFFFFF' },
}

await QRCode.toFile(`public/qr/${outName}.png`, url, { ...options, width: 1024 })
await QRCode.toFile(`public/qr/${outName}.svg`, url, options)

console.log(`QR generado para ${url} -> public/qr/${outName}.png / .svg`)
