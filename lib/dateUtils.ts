// Utilidades para manejo de fechas usando dayjs (más consistente entre plataformas)
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

export const parseToDate = (ts: string | number | Date | null | undefined): dayjs.Dayjs | null => {
    if (!ts) return null;

    if (ts instanceof Date) return dayjs(ts);
    if (dayjs.isDayjs(ts as any)) return ts as unknown as dayjs.Dayjs;

    // dayjs puede parsear strings e numbers (ms)
    if (typeof ts === 'number') {
        // Aceptar segundos (10 dígitos) o milisegundos (13 dígitos)
        const ms = ts < 1e12 ? ts * 1000 : ts;
        return dayjs(ms);
    }

    if (typeof ts === 'string') {
        // Parsear como UTC y convertir a zona horaria local del usuario
        const d = dayjs.utc(ts).local();
        return d.isValid() ? d : null;
    }

    return null;
};

export const formatTimestamp = (ts: string | number | Date | null | undefined): string => {
    const d = parseToDate(ts);
    if (!d) return '';
    // Formato consistente y legible: "18 oct 2025 14:23"
    return d.format('D MMM YYYY, HH:mm');
};

// Devuelve representación relativa: "hace 2 horas" o formato absoluto si muy lejano
export const formatRelative = (ts: string | number | Date | null | undefined, now: Date = new Date()): string => {
    const d = parseToDate(ts);
    if (!d) return '';

    const nowD = dayjs(now);
    const weeks = Math.abs(nowD.diff(d, 'week'));
    if (weeks >= 4) return formatTimestamp(d.toDate());

    return d.from(nowD);
};

// Devuelve el nombre del día con formato legible: "Hoy", "Ayer", o "Lunes 18 Oct"
export const formatDayHeader = (ts: string | number | Date | null | undefined): string => {
    const d = parseToDate(ts);
    if (!d) return '';

    const nowD = dayjs();
    const diffDays = nowD.startOf('day').diff(d.startOf('day'), 'day');

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return d.format('dddd'); // "lunes", "martes", etc.

    return d.format('D MMM YYYY'); // "18 Oct 2025"
};

// Devuelve solo la hora: "14:23"
export const formatTimeOnly = (ts: string | number | Date | null | undefined): string => {
    const d = parseToDate(ts);
    if (!d) return '';
    return d.format('HH:mm');
};

export default {
    parseToDate,
    formatTimestamp,
    formatRelative,
    formatDayHeader,
    formatTimeOnly,
};
