import { relapsesService } from '@/services/api';
import useUserStore from '@/store/useUserStore';
import * as Burnt from 'burnt';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Animated, Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';

interface Props extends PressableProps {
    color?: 'primary' | 'secondary' | 'tertiary';
    variant?: 'contained' | 'outlined' | 'text-only';
    className?: string;
}

const SetButton = ({ color: _color = 'primary', variant: _variant = 'contained', className: _className, ...props }: Props) => {
    const scale = useRef(new Animated.Value(1)).current;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = useUserStore((s) => s.user);

    const onPressIn = () => {
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, bounciness: 0, speed: 20 }).start();
    };

    const onPressOut = () => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 8, speed: 12 }).start();
    };

    const handleSet = async () => {
        if (!user?.id) {
            try {
                Burnt.toast({
                    title: 'Error',
                    preset: 'error',
                    message: 'Usuario no autenticado',
                    haptic: 'error',
                    duration: 2,
                });
            } catch {
                // ignore
            }
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);

        // Registrar recaída en la API
        const now = new Date().toISOString();
        const { data, error } = await relapsesService.createRelapse(user.id, {
            occurred_at: now,
            planned: false, // Las recaídas desde el botón SET son no planificadas
        });

        setIsSubmitting(false);

        if (error || !data) {
            try {
                Burnt.toast({
                    title: 'Error al registrar',
                    preset: 'error',
                    message: error?.message || 'Intenta nuevamente',
                    haptic: 'error',
                    duration: 3,
                });
            } catch {
                // ignore
            }
            return;
        }

        // Animación de éxito

        Animated.sequence([
            Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, bounciness: 0, speed: 20 }),
            Animated.spring(scale, { toValue: 1.06, useNativeDriver: true, bounciness: 12, speed: 12 }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 8, speed: 12 }),
        ]).start();

        try {
            Burnt.toast({
                title: 'Muy bien, sigue adelante',
                preset: 'done',
                message: '',
                haptic: 'none',
                duration: 2,
                shouldDismissByDrag: true,
                from: 'top',
            });
        } catch {
            // ignore
        }

        // Haptic feedback (small impact)
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {
            // ignore if not available
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.animatedWrap, { transform: [{ scale }] }]}>
                <LinearGradient colors={['#8b5cf6', '#06b6d4']} start={[0, 0]} end={[1, 1]} style={styles.gradient} />

                <Pressable
                    onPress={handleSet}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    accessibilityRole="button"
                    accessibilityLabel="Guardar fecha y hora"
                    style={styles.pressable}
                    android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: true }}
                    {...props}
                >
                    <Text style={styles.label}>SET</Text>
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