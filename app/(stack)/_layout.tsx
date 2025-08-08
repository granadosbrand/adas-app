
import { SplashScreen, Stack } from 'expo-router'
import React from 'react'

SplashScreen.preventAutoHideAsync()

const StackLayout = () => {

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerShadowVisible: false,
                contentStyle: {
                    backgroundColor: 'white'
                }
            }}
        >
            <Stack.Screen
                name='home/index'
                options={{
                    title: 'Home Screen',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name='profile/index'
                options={{
                    title: 'Profile Screen',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name='settings/index'
                options={{
                    title: 'Settings Screen',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name='productos/index'
                options={{
                    title: 'Products Screen',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name='productos/[id]'
                options={{
                    title: 'Product',
                    headerShown: true,
                }}
            />
        </Stack>
    )

}

export default StackLayout