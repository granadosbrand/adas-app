import CustomDrawer from '@/components/shared/CustomDrawer';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Text } from 'react-native';

const DrawerLayout = () => {
    return (
        <Drawer
        drawerContent={CustomDrawer}
            screenOptions={{
                overlayColor: 'rgba(0,0,0,0.5)',
                drawerActiveTintColor: 'indigo',
                // drawerInactiveTintColor: 'white',
                headerShadowVisible: false,
                sceneStyle: {
                    backgroundColor: 'white',
                },
            }}
        >
            <Drawer.Screen
                name="user/index"
                options={{
                    drawerLabel: 'User',
                    title: 'Usuario',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons size={size} name="person-outline" color={color} />
                    )
                }}
            />
            <Drawer.Screen
                name="schedule/index"
                options={{
                    drawerLabel: 'Schedule',
                    title: 'Schedules',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons size={size} name="calendar-outline" color={color} />
                    )
                }}
            />
        </Drawer>
    )
}

export default DrawerLayout