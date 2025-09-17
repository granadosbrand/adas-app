
import { Ionicons } from '@expo/vector-icons'
import { DrawerActions } from '@react-navigation/native'
import { Stack, useNavigation, useRouter } from 'expo-router'
import React from 'react'

const StackLayout = () => {


    const navigation = useNavigation()
    const router = useRouter()

    const onHeaderLeftClick = (canGoBack: boolean | undefined) => {
        if (canGoBack) {
            router.back()
            return
        }
        navigation.dispatch(DrawerActions.toggleDrawer())
    }

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerShadowVisible: false,
                contentStyle: {
                    backgroundColor: 'white'
                },
                headerLeft: ({ tintColor, canGoBack }) =>
                    <Ionicons
                        name={canGoBack ? 'arrow-back-outline' : 'menu'}
                        className='mr-5'
                        size={20}
                        color={tintColor}
                        onPress={() => onHeaderLeftClick(canGoBack)}
                    />
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