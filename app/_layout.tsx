import { Toaster } from 'burnt/web';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useAuthStore from '../store/useAuthStore';
import './global.css';

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {

    const initialize = useAuthStore((state) => state.initialize);

    const [fontsLoaded, error] = useFonts({
        'WorkSans-Black': require('../assets/fonts/WorkSans-Black.ttf'),
        'WorkSans-Light': require('../assets/fonts/WorkSans-Light.ttf'),
        'WorkSans-Medium': require('../assets/fonts/WorkSans-Medium.ttf')
    })

    useEffect(() => {

        if (error) throw error;

        if (fontsLoaded) {
            // Inicializar autenticación
            initialize().then(() => {
                SplashScreen.hideAsync();
            });
        }

    }, [fontsLoaded, error])

    if (!fontsLoaded && !error) return null

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Slot />
            <Toaster position='bottom-right' />

        </GestureHandlerRootView>
    )
}

export default RootLayout