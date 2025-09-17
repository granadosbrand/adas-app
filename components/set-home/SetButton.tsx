import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, PressableProps, Text, View } from 'react-native';
import useRecordStore from '../../store/useRecords';

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

    // store
    const addNow = useRecordStore((s) => s.addNow);
    const getCount = useRecordStore((s) => s.getCount);

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

    const onPressIn = () => {
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, bounciness: 0, speed: 20 }).start();
    };

    const onPressOut = () => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 8, speed: 12 }).start();
    };

    const handleSet = () => {
        // add record to global store
        addNow();

        // Pulse de confirmación
        Animated.sequence([
            Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, bounciness: 0, speed: 20 }),
            Animated.spring(scale, { toValue: 1.06, useNativeDriver: true, bounciness: 12, speed: 12 }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 8, speed: 12 }),
        ]).start();

        //todo ejecutar toast
    };



    return (

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

           


        </View>

    );
}

export default SetButton