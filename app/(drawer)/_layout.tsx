import CustomDrawer from '@/components/shared/CustomDrawer';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';

const DrawerLayout = () => {
    return (
        <Drawer
            drawerContent={CustomDrawer}
            screenOptions={{
                overlayColor: 'rgba(0,0,0,0.5)',
                drawerActiveTintColor: 'indigo',
                // headerShown: false,
                // drawerInactiveTintColor: 'white',
                headerShadowVisible: false,
                sceneStyle: {
                    backgroundColor: 'white',
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