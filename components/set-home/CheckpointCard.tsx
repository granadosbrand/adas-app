import { Checkpoint } from '@/types/api.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface CheckpointCardProps {
    checkpoint: Checkpoint;
}

const CheckpointCard = ({ checkpoint }: CheckpointCardProps) => {
    const [timeInfo, setTimeInfo] = useState({ timeLeft: '', progress: 0, isNear: false });

    useEffect(() => {
        const calculateTimeInfo = () => {
            const now = new Date();
            const scheduledDate = new Date(checkpoint.scheduled_for);
            const diffMs = scheduledDate.getTime() - now.getTime();

            // Si ya pasó
            if (diffMs < 0) {
                setTimeInfo({ timeLeft: 'Tiempo expirado', progress: 100, isNear: true });
                return;
            }

            // Calcular tiempo restante
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            let timeLeftText = '';
            if (hours >= 24) {
                const days = Math.floor(hours / 24);
                timeLeftText = `${days} día${days > 1 ? 's' : ''}`;
            } else if (hours > 0) {
                timeLeftText = `${hours}h ${minutes}m`;
            } else {
                timeLeftText = `${minutes} minutos`;
            }

            // Calcular progreso (asumiendo que el checkpoint es en base a target_hours)
            const targetMs = checkpoint.target_hours * 60 * 60 * 1000;
            const progressPct = Math.min(((targetMs - diffMs) / targetMs) * 100, 100);

            // Determinar si está cerca (últimas 6 horas)
            const isNear = hours < 6;

            setTimeInfo({
                timeLeft: timeLeftText,
                progress: progressPct,
                isNear,
            });
        };

        calculateTimeInfo();
        const interval = setInterval(calculateTimeInfo, 60000); // Actualizar cada minuto

        return () => clearInterval(interval);
    }, [checkpoint]);

    // Determinar color según cercanía
    const getProgressColor = () => {
        if (timeInfo.progress >= 90) return 'bg-tertiary-600'; // Rojo - muy cerca
        if (timeInfo.progress >= 75) return 'bg-amber-500'; // Amarillo - cerca
        return 'bg-secondary-600'; // Verde - normal
    };

    const getTextColor = () => {
        if (timeInfo.progress >= 90) return 'text-tertiary-600';
        if (timeInfo.progress >= 75) return 'text-amber-600';
        return 'text-secondary-600';
    };

    const getBgColor = () => {
        if (timeInfo.progress >= 90) return 'bg-warmth-light';
        if (timeInfo.progress >= 75) return 'bg-amber-50';
        return 'bg-growth-light';
    };

    const getIcon = () => {
        if (timeInfo.progress >= 90) return 'alert-circle';
        if (timeInfo.progress >= 75) return 'time';
        return 'checkmark-circle';
    };

    return (
        <View className={`rounded-2xl p-5 border-2 ${getBgColor()} ${timeInfo.progress >= 90 ? 'border-tertiary' : timeInfo.progress >= 75 ? 'border-amber-500' : 'border-secondary'
            }`}>
            {/* Header */}
            <View className="flex-row items-center mb-4">
                <View className={`p-2 rounded-lg ${timeInfo.progress >= 90 ? 'bg-warmth' : timeInfo.progress >= 75 ? 'bg-amber-100' : 'bg-growth'
                    } mr-3`}>
                    <Ionicons
                        name={getIcon() as any}
                        size={24}
                        color={timeInfo.progress >= 90 ? '#d97706' : timeInfo.progress >= 75 ? '#f59e0b' : '#10b981'}
                    />
                </View>
                <View className="flex-1">
                    <Text className={`text-lg font-work-black ${getTextColor()}`}>
                        Próximo Checkpoint
                    </Text>
                    <Text className="text-neutral-600 text-sm font-work-medium">
                        Modo Survivor
                    </Text>
                </View>
            </View>

            {/* Barra de progreso */}
            <View className="mb-4">
                <View className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                    <View
                        className={`h-full ${getProgressColor()} rounded-full`}
                        style={{ width: `${timeInfo.progress}%` }}
                    />
                </View>
            </View>

            {/* Info del checkpoint */}
            <View className="flex-row justify-between items-center mb-3">
                <View className="flex-1">
                    <Text className="text-neutral-500 text-xs font-work-medium mb-1">
                        Tiempo restante
                    </Text>
                    <Text className={`text-xl font-work-black ${getTextColor()}`}>
                        {timeInfo.timeLeft}
                    </Text>
                </View>
                <View className="flex-1 items-end">
                    <Text className="text-neutral-500 text-xs font-work-medium mb-1">
                        Meta objetivo
                    </Text>
                    <Text className="text-xl font-work-black text-neutral-800">
                        {checkpoint.target_hours.toFixed(1)}h
                    </Text>
                </View>
            </View>

            {/* Fecha programada */}
            <View className="bg-white/50 rounded-lg p-3 flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                <Text className="text-neutral-600 text-sm font-work-medium ml-2">
                    {new Date(checkpoint.scheduled_for).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            </View>

            {/* Mensaje motivacional según cercanía */}
            {timeInfo.progress >= 90 && (
                <View className="mt-3 bg-warmth rounded-lg p-3">
                    <Text className="text-tertiary-dark text-sm font-work-medium text-center">
                        🔥 ¡Ya casi llegas! Mantén el enfoque
                    </Text>
                </View>
            )}
            {timeInfo.progress >= 75 && timeInfo.progress < 90 && (
                <View className="mt-3 bg-amber-100 rounded-lg p-3">
                    <Text className="text-amber-800 text-sm font-work-medium text-center">
                        ⚡ Te estás acercando, sigue adelante
                    </Text>
                </View>
            )}
            {timeInfo.progress < 75 && (
                <View className="mt-3 bg-growth rounded-lg p-3">
                    <Text className="text-growth-dark text-sm font-work-medium text-center">
                        💪 Vas muy bien, mantén el ritmo
                    </Text>
                </View>
            )}
        </View>
    );
};

export default CheckpointCard;
