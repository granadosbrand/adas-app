import { Checkpoint, Relapse } from '@/types/api.types';
import dayjs from 'dayjs';

export interface UserStats {
    totalRelapses: number;
    checkpointsReached: number;
    currentStreakHours: number;
    currentStreakFormatted: string;
    bestStreakHours: number;
    bestStreakFormatted: string;
    lastRelapseTime: string | null;
    averageDaysApart: number;
    trend: 'improving' | 'worsening' | 'neutral';
    mostCommonWeekday: { day: string; count: number } | null;
    mostCommonTimeRange: { range: string; count: number } | null;
    difficultyPattern: { difficulty: string; count: number; percentage: number } | null;
}

/**
 * Calcula todas las estadísticas útiles del usuario
 */
export const calculateUserStats = (
    relapses: Relapse[],
    checkpoints: Checkpoint[]
): UserStats => {
    if (relapses.length === 0) {
        return {
            totalRelapses: 0,
            checkpointsReached: 0,
            currentStreakHours: 0,
            currentStreakFormatted: '0h',
            bestStreakHours: 0,
            bestStreakFormatted: '0h',
            lastRelapseTime: null,
            averageDaysApart: 0,
            trend: 'neutral',
            mostCommonWeekday: null,
            mostCommonTimeRange: null,
            difficultyPattern: null,
        };
    }

    const checkpointsReached = checkpoints.filter((c) => c.status === 'reached').length;
    const sortedRelapses = [...relapses].sort((a, b) =>
        dayjs(a.occurred_at).valueOf() - dayjs(b.occurred_at).valueOf()
    );

    // Calcular racha actual
    const lastRelapse = sortedRelapses[sortedRelapses.length - 1];
    const hoursSinceLastRelapse = dayjs().diff(dayjs(lastRelapse.occurred_at), 'hour');
    const currentStreakFormatted = formatStreak(hoursSinceLastRelapse);

    // Calcular mejor racha histórica
    let bestStreakHours = 0;
    for (let i = 1; i < sortedRelapses.length; i++) {
        const hours = dayjs(sortedRelapses[i].occurred_at).diff(
            dayjs(sortedRelapses[i - 1].occurred_at),
            'hour'
        );
        if (hours > bestStreakHours) bestStreakHours = hours;
    }
    if (hoursSinceLastRelapse > bestStreakHours) bestStreakHours = hoursSinceLastRelapse;
    const bestStreakFormatted = formatStreak(bestStreakHours);

    // Calcular promedio de días entre recaídas
    let totalDays = 0;
    for (let i = 1; i < sortedRelapses.length; i++) {
        const diff = dayjs(sortedRelapses[i].occurred_at).diff(
            dayjs(sortedRelapses[i - 1].occurred_at),
            'day',
            true
        );
        totalDays += diff;
    }
    const avgDaysApart = sortedRelapses.length > 1
        ? Math.round(totalDays / (sortedRelapses.length - 1))
        : 0;

    // Calcular tendencia
    const trend = calculateTrend(sortedRelapses);

    // Analizar patrones
    const mostCommonWeekday = getMostCommonWeekday(relapses);
    const mostCommonTimeRange = getMostCommonTimeRange(relapses);
    const difficultyPattern = getDifficultyPattern(relapses);

    return {
        totalRelapses: relapses.length,
        checkpointsReached,
        currentStreakHours: hoursSinceLastRelapse,
        currentStreakFormatted,
        bestStreakHours,
        bestStreakFormatted,
        lastRelapseTime: lastRelapse.occurred_at,
        averageDaysApart: avgDaysApart,
        trend,
        mostCommonWeekday,
        mostCommonTimeRange,
        difficultyPattern,
    };
};

/**
 * Formatea horas en formato legible (horas o días)
 */
const formatStreak = (hours: number): string => {
    if (hours < 48) {
        return `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? 'día' : 'días'}`;
};

/**
 * Calcula la tendencia comparando períodos recientes vs anteriores
 */
const calculateTrend = (sortedRelapses: Relapse[]): 'improving' | 'worsening' | 'neutral' => {
    if (sortedRelapses.length < 6) return 'neutral';

    const recentAvg = sortedRelapses.slice(-5).reduce((sum, _, idx, arr) => {
        if (idx === 0) return 0;
        return sum + dayjs(arr[idx].occurred_at).diff(dayjs(arr[idx - 1].occurred_at), 'day');
    }, 0) / 4;

    const olderAvg = sortedRelapses.slice(-10, -5).reduce((sum, _, idx, arr) => {
        if (idx === 0) return 0;
        return sum + dayjs(arr[idx].occurred_at).diff(dayjs(arr[idx - 1].occurred_at), 'day');
    }, 0) / 4;

    if (recentAvg > olderAvg * 1.2) return 'improving';
    if (recentAvg < olderAvg * 0.8) return 'worsening';
    return 'neutral';
};

/**
 * Encuentra el día de la semana más común
 */
const getMostCommonWeekday = (relapses: Relapse[]): { day: string; count: number } | null => {
    if (relapses.length === 0) return null;

    const weekdayCount = new Map<number, number>();
    relapses.forEach((r) => {
        const day = dayjs(r.occurred_at).day();
        weekdayCount.set(day, (weekdayCount.get(day) || 0) + 1);
    });

    const mostCommonWeekdayNum = Array.from(weekdayCount.entries())
        .sort((a, b) => b[1] - a[1])[0];

    if (!mostCommonWeekdayNum) return null;

    const weekdayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return {
        day: weekdayNames[mostCommonWeekdayNum[0]],
        count: mostCommonWeekdayNum[1],
    };
};

/**
 * Encuentra el rango horario más común
 */
const getMostCommonTimeRange = (relapses: Relapse[]): { range: string; count: number } | null => {
    if (relapses.length === 0) return null;

    const timeRanges = {
        'Madrugada (00-06h)': 0,
        'Mañana (06-12h)': 0,
        'Tarde (12-18h)': 0,
        'Noche (18-00h)': 0,
    };

    relapses.forEach((r) => {
        const hour = dayjs(r.occurred_at).hour();
        if (hour >= 0 && hour < 6) timeRanges['Madrugada (00-06h)']++;
        else if (hour >= 6 && hour < 12) timeRanges['Mañana (06-12h)']++;
        else if (hour >= 12 && hour < 18) timeRanges['Tarde (12-18h)']++;
        else timeRanges['Noche (18-00h)']++;
    });

    const mostCommonTimeRangeEntry = Object.entries(timeRanges)
        .sort((a, b) => b[1] - a[1])[0];

    if (!mostCommonTimeRangeEntry || mostCommonTimeRangeEntry[1] === 0) return null;

    return {
        range: mostCommonTimeRangeEntry[0],
        count: mostCommonTimeRangeEntry[1],
    };
};

/**
 * Analiza el patrón de dificultad más común
 */
const getDifficultyPattern = (relapses: Relapse[]): { difficulty: string; count: number; percentage: number } | null => {
    const relapsesWithDifficulty = relapses.filter(r => r.difficulty);
    if (relapsesWithDifficulty.length === 0) return null;

    const diffCount = new Map<string, number>();
    relapsesWithDifficulty.forEach((r) => {
        if (r.difficulty) {
            diffCount.set(r.difficulty, (diffCount.get(r.difficulty) || 0) + 1);
        }
    });

    const mostCommonDiff = Array.from(diffCount.entries())
        .sort((a, b) => b[1] - a[1])[0];

    if (!mostCommonDiff) return null;

    const diffLabels: Record<string, string> = { easy: 'Fácil', normal: 'Normal', hard: 'Difícil' };

    return {
        difficulty: diffLabels[mostCommonDiff[0]] || mostCommonDiff[0],
        count: mostCommonDiff[1],
        percentage: Math.round((mostCommonDiff[1] / relapsesWithDifficulty.length) * 100),
    };
};
