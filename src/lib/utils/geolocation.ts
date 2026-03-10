import type { ChurchListItem, ChurchWithDistance, Coordinates } from '@/lib/types/church';

/**
 * Wraps the browser Geolocation API in a Promise.
 * Returns the user's current coordinates or throws a descriptive error.
 *
 * @param timeout  Maximum wait time in ms (default 10 000)
 */
export function getCurrentPosition(timeout = 10_000): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            reject(new Error('La geolocalización no está disponible en este navegador.'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        reject(new Error('Permiso de ubicación denegado. Activa la ubicación en tu navegador.'));
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject(new Error('No se pudo determinar tu ubicación. Intenta de nuevo.'));
                        break;
                    case error.TIMEOUT:
                        reject(new Error('La solicitud de ubicación tardó demasiado. Intenta de nuevo.'));
                        break;
                    default:
                        reject(new Error('Error desconocido al obtener la ubicación.'));
                }
            },
            {
                enableHighAccuracy: true,
                timeout,
                maximumAge: 60_000, // cache for 1 min
            },
        );
    });
}

/**
 * Converts degrees to radians.
 */
function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/** Mean radius of the Earth in km */
const EARTH_RADIUS_KM = 6_371;

/**
 * Calculates the great-circle distance between two coordinates
 * using the Haversine formula.
 *
 * @returns distance in kilometres
 */
export function calculateDistance(a: Coordinates, b: Coordinates): number {
    const dLat = toRadians(b.latitude - a.latitude);
    const dLon = toRadians(b.longitude - a.longitude);

    const halfChordSq =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(a.latitude)) *
        Math.cos(toRadians(b.latitude)) *
        Math.sin(dLon / 2) ** 2;

    const angularDistance = 2 * Math.atan2(Math.sqrt(halfChordSq), Math.sqrt(1 - halfChordSq));

    return EARTH_RADIUS_KM * angularDistance;
}

/**
 * Returns a new array of churches sorted by distance from `userCoords`.
 * Each item is enriched with a `distance` property (in km, rounded to 1 decimal).
 *
 * Churches without coordinates are placed at the end with `distance: Infinity`.
 */
export function sortByDistance(
    churches: ChurchListItem[],
    userCoords: Coordinates,
): ChurchWithDistance[] {
    return churches
        .map((church) => {
            const distance =
                church.latitude != null && church.longitude != null
                    ? Math.round(
                        calculateDistance(userCoords, {
                            latitude: church.latitude,
                            longitude: church.longitude,
                        }) * 10,
                    ) / 10
                    : Infinity;

            return { ...church, distance };
        })
        .sort((a, b) => a.distance - b.distance);
}
