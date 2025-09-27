import CustomDrawer from '@/components/shared/CustomDrawer';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';

const DrawerLayout = () => {
    return (
        <Drawer
            drawerContent={CustomDrawer}
            screenOptions={{
                overlayColor: 'rgba(79, 70, 229, 0.3)', // primary con transparencia
                drawerActiveTintColor: '#4f46e5', // primary ADAS
                drawerInactiveTintColor: '#6b7280', // neutral-500
                headerShadowVisible: false,
                headerTintColor: '#4f46e5',
                sceneStyle: {
                    backgroundColor: '#f9fafb', // neutral-50
                },
            }}
        >
            <Drawer.Screen
                name="(tabs)"
                options={{
                    headerShown: false,
                    drawerLabel: 'Inicio',
                    title: 'Inicio',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons size={size} name="home-outline" color={color} />
                    )
                }}
            />
            <Drawer.Screen
                name="user/index"
                options={{
                    drawerLabel: 'Mi Perfil',
                    title: 'Mi Perfil',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons size={size} name="person-outline" color={color} />
                    )
                }}
            />
            <Drawer.Screen
                name="ayuda/index"
                options={{
                    drawerLabel: 'Artículos de Ayuda',
                    title: 'Artículos de Ayuda',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons size={size} name="library-outline" color={color} />
                    )
                }}
            />
            <Drawer.Screen
                name="contacto/index"
                options={{
                    drawerLabel: 'Contacto',
                    title: 'Contacto',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons size={size} name="mail-outline" color={color} />
                    )
                }}
            />
            <Drawer.Screen
                name="logout/index"
                options={{
                    drawerLabel: 'Cerrar Sesión',
                    title: 'Cerrar Sesión',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons size={size} name="log-out-outline" color={color} />
                    )
                }}
            />
        </Drawer>
    )
}

export default DrawerLayout