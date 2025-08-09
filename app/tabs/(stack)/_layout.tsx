
import { SplashScreen, Stack } from 'expo-router'
import React from 'react'

SplashScreen.preventAutoHideAsync()

const StackLayout = () => {

    return (
        <Stack
            screenOptions={{
                headerShown: true,
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
                }}
            />
            <Stack.Screen
                name='profile/index'
                options={{
                    title: 'Profile Screen',
                }}
            />
            <Stack.Screen
                name='settings/index'
                options={{
                    title: 'Settings Screen',
                }}
            />
            <Stack.Screen
                name='productos/index'
                options={{
                    title: 'Products Screen',
                }}
            />
            <Stack.Screen
                name='productos/[id]'
                options={{
                    title: 'Product',
                }}
            />
        </Stack>
    )

}

export default StackLayout