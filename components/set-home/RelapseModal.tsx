import { relapsesService } from '@/services/api';
import useUserStore from '@/store/useUserStore';
import { RelapseDifficulty } from '@/types/api.types';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';

interface RelapseModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const RelapseModal = ({ visible, onClose, onSuccess }: RelapseModalProps) => {
    const user = useUserStore((s) => s.user);
    const mode = useUserStore((s) => s.mode);
    const setPendingCheckpoint = useUserStore((s) => s.setPendingCheckpoint);
    const setMode = useUserStore((s) => s.setMode);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [useCustomDateTime, setUseCustomDateTime] = useState(false);
    const [difficulty, setDifficulty] = useState<RelapseDifficulty>('medium');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSurvivorMode = mode === 'survivor';

    const handleSubmit = async () => {
        if (!user?.id) return;

        setIsSubmitting(true);

        // Usar fecha actual si no se especificó una personalizada
        const occurredAt = useCustomDateTime ? selectedDate.toISOString() : new Date().toISOString();

        const { data, error } = await relapsesService.createRelapse(user.id, {
            occurred_at: occurredAt,
            difficulty: isSurvivorMode ? difficulty : undefined,
        });

        setIsSubmitting(false);

        if (error || !data) {
            try {
                Toast.show({
                    type: 'error',
                    text1: 'Error al registrar',
                    text2: error?.message || 'Intenta nuevamente',
                    position: 'bottom',
                    visibilityTime: 3000,
                });
            } catch { }
            return;
        }

        // Actualizar modo si cambió
        if (data.mode) {
            setMode(data.mode);
        }

        // Actualizar checkpoint pendiente si viene uno nuevo
        if (data.pending_checkpoint) {
            setPendingCheckpoint(data.pending_checkpoint);
        }

        // Mostrar mensaje según clasificación
        const { classification, checkpoint_reached } = data;
        let message = '';
        let title = 'Registrado';

        console.log("data devuelta: ", data)
        if (checkpoint_reached) {
            title = '🎉 ¡Checkpoint Alcanzado!';
            message = `Llegaste ${classification.relation === 'early' ? 'temprano' : 'a tiempo'}`;
        } else if (classification.relation === 'missed') {
            title = 'Checkpoint perdido';
            message = 'No te desanimes, sigue adelante';
        } else {
            title = 'Registrado exitosamente';
            message = 'Sigue con tu progreso';
        }

        try {
            Toast.show({
                type: checkpoint_reached ? 'success' : 'info',
                text1: title,
                text2: message,
                position: 'bottom',
                visibilityTime: 3000,
            });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch { }

        onSuccess?.();
        onClose();
    };

    const difficultyOptions: { value: RelapseDifficulty; label: string; icon: string }[] = [
        { value: 'easy', label: 'Fácil', icon: 'happy-outline' },
        { value: 'medium', label: 'Normal', icon: 'remove-circle-outline' },
        { value: 'hard', label: 'Difícil', icon: 'sad-outline' },
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl max-h-[85%]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-6 border-b border-neutral-200">
                        <Text className="text-2xl font-work-black text-neutral-800">
                            Registrar Recaída
                        </Text>
                        <Pressable onPress={onClose} className="p-2">
                            <Ionicons name="close" size={24} color="#6b7280" />
                        </Pressable>
                    </View>

                    <ScrollView className="p-6">
                        {/* Fecha y Hora Personalizada - Opcional */}
                        <View className="mb-6">
                            <Pressable
                                onPress={() => setUseCustomDateTime(!useCustomDateTime)}
                                className="flex-row items-center justify-between mb-3"
                            >
                                <View className="flex-row items-center flex-1">
                                    <Ionicons
                                        name={useCustomDateTime ? 'calendar' : 'calendar-outline'}
                                        size={20}
                                        color="#4f46e5"
                                    />
                                    <Text className="text-lg font-work-black text-neutral-800 ml-2">
                                        Registrar evento pasado
                                    </Text>
                                </View>
                                <View
                                    className={`w-12 h-7 rounded-full ${useCustomDateTime ? 'bg-primary' : 'bg-neutral-300'
                                        } p-1`}
                                >
                                    <View
                                        className={`w-5 h-5 bg-white rounded-full ${useCustomDateTime ? 'ml-auto' : ''
                                            }`}
                                    />
                                </View>
                            </Pressable>

                            {useCustomDateTime && (
                                <>
                                    <Text className="text-neutral-600 text-sm font-work-medium mb-3">
                                        ¿Cuándo ocurrió?
                                    </Text>
                                    <View className="flex-row gap-3">
                                        <Pressable
                                            onPress={() => setShowDatePicker(true)}
                                            className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl p-4"
                                        >
                                            <Text className="text-neutral-500 text-xs mb-1">Fecha</Text>
                                            <Text className="text-neutral-800 font-work-medium">
                                                {selectedDate.toLocaleDateString('es-ES', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            onPress={() => setShowTimePicker(true)}
                                            className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl p-4"
                                        >
                                            <Text className="text-neutral-500 text-xs mb-1">Hora</Text>
                                            <Text className="text-neutral-800 font-work-medium">
                                                {selectedDate.toLocaleTimeString('es-ES', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </Text>
                                        </Pressable>
                                    </View>

                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={selectedDate}
                                            mode="date"
                                            display="default"
                                            onChange={(_event, date) => {
                                                setShowDatePicker(false);
                                                if (date) setSelectedDate(date);
                                            }}
                                            maximumDate={new Date()}
                                        />
                                    )}

                                    {showTimePicker && (
                                        <DateTimePicker
                                            value={selectedDate}
                                            mode="time"
                                            display="default"
                                            onChange={(_event, date) => {
                                                setShowTimePicker(false);
                                                if (date) setSelectedDate(date);
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </View>

                        {/* Difficulty (solo si es survivor) */}
                        {isSurvivorMode && (
                            <View className="mb-6">
                                <Text className="text-lg font-work-black text-neutral-800 mb-3">
                                    Dificultad
                                </Text>
                                <View className="flex-row gap-2">
                                    {difficultyOptions.map((option) => (
                                        <Pressable
                                            key={option.value}
                                            onPress={() => setDifficulty(option.value)}
                                            className={`flex-1 border-2 rounded-xl p-3 items-center ${difficulty === option.value
                                                ? 'bg-primary-light border-primary'
                                                : 'bg-neutral-50 border-neutral-300'
                                                }`}
                                        >
                                            <Ionicons
                                                name={option.icon as any}
                                                size={24}
                                                color={difficulty === option.value ? '#4f46e5' : '#6b7280'}
                                            />
                                            <Text
                                                className={`text-xs font-work-medium mt-1 ${difficulty === option.value ? 'text-primary' : 'text-neutral-600'
                                                    }`}
                                            >
                                                {option.label}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Info Message */}
                        <View className="bg-insight-light rounded-xl p-4 mb-6">
                            <Text className="text-accent-dark text-sm font-work-medium">
                                💡 {useCustomDateTime
                                    ? 'Asegúrate de seleccionar la fecha y hora correctas del evento'
                                    : 'Se registrará en el momento actual. Activa "evento pasado" si ocurrió antes'}
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Footer con botones */}
                    <View className="p-6 border-t border-neutral-200">
                        <Pressable
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-primary rounded-xl py-4 items-center active:opacity-80 mb-3"
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white font-work-black text-lg">
                                    Registrar
                                </Text>
                            )}
                        </Pressable>
                        <Pressable
                            onPress={onClose}
                            disabled={isSubmitting}
                            className="bg-neutral-100 rounded-xl py-4 items-center active:opacity-80"
                        >
                            <Text className="text-neutral-700 font-work-black text-lg">
                                Cancelar
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default RelapseModal;
