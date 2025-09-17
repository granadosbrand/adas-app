import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, PressableProps, Text, View } from 'react-native';

interface Props extends PressableProps {
    color?: 'primary' | 'secondary' | 'tertiary';
    variant?: 'contained' | 'outlined' | 'text-only'
    className?: string;
}

const TOAST_DURATION = 1300;


const SetButton = ({ color = 'primary', variant = 'contained', className, ...props }: Props) => {

    // Animaciones
    const scale = useRef(new Animated.Value(1)).current;
    const toastOpacity = useRef(new Animated.Value(0)).current;
    const toastTranslate = useRef(new Animated.Value(10)).current; // aparece deslizándose hacia arriba

    // state
    const [toastMsg, setToastMsg] = useState<string>('');
    //todo: Esto se va a zustand.
    const [timestamps, setTimestamps] = useState<{ id: string; label: string }[]>([]);

    const btnColor = {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        tertiary: 'bg-tertiary',
    }[color]

    const textColor = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        tertiary: 'text-tertiary',
    }[color]


    // handlers
    const showToast = (msg: string) => {
        setToastMsg(msg);
        // reset valores
        toastOpacity.setValue(0);
        toastTranslate.setValue(20);

        Animated.sequence([
            Animated.parallel([
                Animated.timing(toastOpacity, {
                    toValue: 1,
                    duration: 160,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.cubic),
                }),
                Animated.timing(toastTranslate, {
                    toValue: 0,
                    duration: 180,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.cubic),
                }),
            ]),
            Animated.delay(TOAST_DURATION),
            Animated.parallel([
                Animated.timing(toastOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                    easing: Easing.in(Easing.cubic),
                }),
                Animated.timing(toastTranslate, {
                    toValue: 20,
                    duration: 200,
                    useNativeDriver: true,
                    easing: Easing.in(Easing.cubic),
                }),
            ]),
        ]).start();
    };

    const onPressIn = () => {
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, bounciness: 0, speed: 20 }).start();
    };

    const onPressOut = () => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 8, speed: 12 }).start();
    };

    const handleSet = () => {
        const now = new Date();
        setTimestamps(prev => [
            { id: String(now.getTime()), label: now.toLocaleString() },
            ...prev,
        ]);

        // Pulse de confirmación
        Animated.sequence([
            Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, bounciness: 0, speed: 20 }),
            Animated.spring(scale, { toValue: 1.06, useNativeDriver: true, bounciness: 12, speed: 12 }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 8, speed: 12 }),
        ]).start();

        showToast('Muy bien, sigue adelante');
    };



    return (


        // <Pressable
        //     {...props}
        //     className={`p-3 rounded-md ${btnColor} active:opacity-90 ${className}`}>
        //     <Text className='text-white text-center font-work-medium'>
        //         {children}
        //     </Text>
        // </Pressable>

        <View>

            <Animated.View
                style={{ transform: [{ scale }] }}
                className="w-44 h-44 rounded-full overflow-hidden"
            >
                <Pressable
                    onPress={handleSet}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    accessibilityRole="button"
                    accessibilityLabel="Guardar fecha y hora"
                    // className= ""
                    className={`w-40 h-40 rounded-full items-center justify-center bg-black/90 dark:bg-white/90 shadow-lg ${btnColor} active:opacity-90 ${className}`}

                    android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
                >
                    <Text className="text-white dark:text-black text-3xl font-semibold tracking-widest">
                        SET
                    </Text>
                </Pressable>
            </Animated.View>

            {/* Toast */}
            <Animated.View
                pointerEvents="none"
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 5,
                    opacity: toastOpacity,
                    transform: [{ translateY: toastTranslate }],
                    alignItems: 'center',
                }}
            >
                {toastMsg ? (
                    <View className="px-4 py-2 rounded-full bg-black/90 dark:bg-white/90">
                        <Text className="text-white dark:text-black font-medium">
                            {toastMsg}
                        </Text>
                    </View>
                ) : null}
            </Animated.View>


        </View>

    );
}

export default SetButton