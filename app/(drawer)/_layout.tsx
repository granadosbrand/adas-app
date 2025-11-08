import CustomDrawer from '@/components/shared/CustomDrawer';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { useTranslation } from 'react-i18next';

const DrawerLayout = () => {
    const { t } = useTranslation('drawer');

    return (
        <Drawer
            drawerContent={CustomDrawer}
            screenOptions={{
                overlayColor: 'rgba(79, 70, 229, 0.3)', // primary con transparencia
                drawerActiveTintColor: '#1ca6c0', // primary ADAS
                drawerInactiveTintColor: '#6b7280', // neutral-500
                headerShadowVisible: false,
                headerTintColor: '#1ca6c0',
                sceneStyle: {
                    backgroundColor: '#f9fafb', // neutral-50
                },
            }}
        >
            <Drawer.Screen
                name="(tabs)"
                options={{
                    headerShown: false,
                    drawerLabel: t('home'),
                    title: t('home'),
                    drawerIcon: ({ color, size }) => (
                        <Ionicons size={size} name="home-outline" color={color} />
                    )
                }}
            />
            <Drawer.Screen
                name="user/index"
                options={{
                    drawerLabel: t('myProfile'),
                    title: t('myProfile'),
                    drawerIcon: ({ color, size }) => (
                        <Ionicons size={size} name="person-outline" color={color} />
                    )
                }}
            />
            <Drawer.Screen
                name="historial/index"
                options={{
                    drawerLabel: t('fullHistory'),
                    title: t('fullHistory'),
                    drawerIcon: ({ color, size }) => (
                        <Ionicons size={size} name="list-outline" color={color} />
                    )
                }}
            />
            {/* <Drawer.Screen
                name="ayuda"
                options={{
                    drawerLabel: t('helpArticles'),
                    title: t('helpArticles'),
                    drawerIcon: ({ color, size }) => (
                        <Ionicons size={size} name="library-outline" color={color} />
                    )
                }}
            /> */}
            {/* <Drawer.Screen
                name="contacto/index"
                options={{
                    drawerLabel: t('contact'),
                    title: t('contact'),
                    drawerIcon: ({ color, size }) => (
                        <Ionicons size={size} name="mail-outline" color={color} />
                    )
                }}
            /> */}
            <Drawer.Screen
                name="logout/index"
                options={{
                    drawerLabel: t('logout'),
                    title: t('logout'),
                    drawerIcon: ({ color, size }) => (
                        <Ionicons size={size} name="log-out-outline" color={color} />
                    )
                }}
            />
        </Drawer>
    )
}

export default DrawerLayout