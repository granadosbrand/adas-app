import { relapsesService } from '@/services/api';
import useUserStore from '@/store/useUserStore';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface Props extends PressableProps {
    color?: 'primary' | 'secondary' | 'tertiary';
    variant?: 'contained' | 'outlined' | 'text-only';
    className?: string;
}

const SetButton = ({ color: _color = 'primary', variant: _variant = 'contained', className: _className, ...props }: Props) => {
    const scale = useRef(new Animated.Value(1)).current;
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    const user = useUserStore((s) => s.user);
    const mode = useUserStore((s) => s.mode);
    const setPendingCheckpoint = useUserStore((s) => s.setPendingCheckpoint);
    const setMode = useUserStore((s) => s.setMode);

    const isSurvivorMode = mode === 'survivor';

    // Limpiar interval al desmontar
    useEffect(() => {
        return () => {
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
            }
        };
    }, []);

    // Cuando el countdown llega a 0, enviar
    useEffect(() => {
        if (countdown === 0) {
            handleSubmit();
        }
    }, [countdown]);

    const onPressIn = () => {
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, bounciness: 0, speed: 20 }).start();
    };

    const onPressOut = () => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 8, speed: 12 }).start();
    };

    const startCountdown = () => {
        // Animación de presionado
        Animated.sequence([
            Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, bounciness: 0, speed: 20 }),
            Animated.spring(scale, { toValue: 1.06, useNativeDriver: true, bounciness: 12, speed: 12 }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 8, speed: 12 }),
        ]).start();

        // Haptic feedback
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch { }

        // Iniciar countdown de 3 segundos
        setCountdown(3);
        countdownInterval.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev === null || prev <= 1) {
                    if (countdownInterval.current) {
                        clearInterval(countdownInterval.current);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const cancelCountdown = () => {
        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
        }
        setCountdown(null);

        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch { }
    };

    const handleSubmit = async () => {
        if (!user?.id) return;

        setIsSubmitting(true);
        setCountdown(null);

        const { data, error } = await relapsesService.createRelapse(user.id, {
            occurred_at: new Date().toISOString(),
            difficulty: isSurvivorMode ? 'medium' : undefined,
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
    };

    const handlePress = () => {
        if (countdown !== null) {
            // Si está en countdown, cancelar
            cancelCountdown();
        } else if (!isSubmitting) {
            // Si no está en countdown ni enviando, iniciar countdown
            startCountdown();
        }
    };

    // Determinar colores según estado
    const getGradientColors = (): [string, string] => {
        if (countdown !== null) return ['#ef4444', '#dc2626']; // Rojo para cancelar
        if (isSubmitting) return ['#6b7280', '#4b5563']; // Gris para loading
        return ['#8b5cf6', '#06b6d4']; // Normal
    };

    const getLabel = () => {
        if (isSubmitting) return '...';
        if (countdown !== null) return countdown.toString();
        return 'SET';
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.animatedWrap, { transform: [{ scale }] }]}>
                <LinearGradient colors={getGradientColors()} start={[0, 0]} end={[1, 1]} style={styles.gradient} />

                <Pressable
                    onPress={handlePress}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    accessibilityRole="button"
                    accessibilityLabel={countdown !== null ? 'Cancelar registro' : 'Registrar recaída'}
                    style={styles.pressable}
                    android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: true }}
                    disabled={isSubmitting}
                    {...props}
                >
                    <Text style={styles.label}>{getLabel()}</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
};

const SIZE = 160;

const styles = StyleSheet.create({
    container: {
        width: SIZE,
        height: SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SIZE / 2, // ensure shadow follows circular shape
        // Shadow + border to make the button stand out
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
        elevation: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
    },
    animatedWrap: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradient: {
        position: 'absolute',
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
    },
    pressable: {
        width: SIZE - 16,
        height: SIZE - 16,
        borderRadius: (SIZE - 16) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    label: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: 4,
    },
});

export default SetButton;