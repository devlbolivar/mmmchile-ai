export interface RadioProgram {
    time: string;
    name: string;
    featured?: boolean;
    durationMinutes?: number;
}

export interface DaySchedule {
    label: string;
    shortLabel: string;
    programs: RadioProgram[];
}

export interface RadioScheduleData {
    weekdays: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
}

export const schedule: RadioScheduleData = {
    weekdays: {
        label: "Lunes a Viernes",
        shortLabel: "L–V",
        programs: [
            { time: "03:00 AM", name: "Mensaje a la Conciencia" },
            { time: "08:00 AM", name: "Mensaje a la Conciencia" },
            { time: "09:00 AM", name: "Día a Día con Dios" },
            { time: "10:00 AM", name: "Biblia Maestra" },
            { time: "12:00 PM", name: "Momentos de Reflexión" },
            { time: "02:00 PM", name: "Predicaciones" },
            { time: "03:00 PM", name: "Al Ritmo del Corazón" },
            { time: "04:00 PM", name: "Belleza Espiritual" },
            { time: "05:00 PM", name: "The Bible Project" },
            { time: "10:00 PM", name: "Me Contó un Amigo" },
            { time: "11:00 PM", name: "Biblia Maestra" },
        ],
    },
    saturday: {
        label: "Sábados",
        shortLabel: "Sáb",
        programs: [
            { time: "10:00 AM", name: "Hogar Dulce Hogar" },
            { time: "11:00 AM", name: "Hablemos de Familia" },
            { time: "02:00 PM", name: "Tiempo para los Niños" },
            { time: "10:00 PM", name: "Entre 2 o 3" },
        ],
    },
    sunday: {
        label: "Domingos",
        shortLabel: "Dom",
        programs: [
            { time: "09:00 AM", name: "Dulce Armonía" },
            { time: "11:00 AM", name: "Transmisión de Culto", featured: true },
            { time: "03:00 PM", name: "Sostenidas por su Gracia" },
            { time: "04:00 PM", name: "Dulce Armonía Vespertino" },
        ],
    },
};
