import { Ionicons } from '@expo/vector-icons'
import { DrawerActions } from '@react-navigation/native'
import { Stack, useNavigation, useRouter } from 'expo-router'
import React from 'react'

const AyudaStackLayout = () => {
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
                name='index'
                options={{
                    title: 'Artículos de Ayuda',
                }}
            />
            <Stack.Screen
                name='[id]'
                options={{
                    title: 'Artículo',
                }}
            />
        </Stack>
    )
}

export default AyudaStackLayout