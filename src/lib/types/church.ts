/**
 * TypeScript types matching the Sanity `church` schema.
 */

export type ChurchZone = 'norte' | 'centro-norte' | 'centro' | 'centro-sur' | 'sur';

export interface ServiceSchedule {
    _key?: string;
    day: string;
    time: string;
}

export interface SanityImageRef {
    _type: 'image';
    _key?: string;
    asset: {
        _ref: string;
        _type: 'reference';
    };
    hotspot?: {
        x: number;
        y: number;
        height: number;
        width: number;
    };
}

/** Full church document as returned by Sanity */
export interface Church {
    _id: string;
    _type: 'church';
    name: string;
    slug: string;
    city: string;
    address?: string;
    zone: ChurchZone;
    latitude?: number;
    longitude?: number;
    phone?: string;
    whatsapp?: string;
    pastorName?: string;
    serviceSchedule?: ServiceSchedule[];
    photos?: SanityImageRef[];
    extraEmail?: string;
    image?: string;
}

/** Lighter projection used in listing / map queries */
export interface ChurchListItem {
    _id: string;
    name: string;
    slug: string;
    city: string;
    zone: ChurchZone;
    address?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    whatsapp?: string;
    pastorName?: string;
    serviceSchedule?: ServiceSchedule[];
    extraEmail?: string;
    image?: string;
}

/** Generic coordinate pair */
export interface Coordinates {
    latitude: number;
    longitude: number;
}

/** Church list item enriched with distance from user */
export interface ChurchWithDistance extends ChurchListItem {
    distance: number; // km
}
