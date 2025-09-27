import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#6366f1',
            tabBarInactiveTintColor: '#9ca3af',
            tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#e5e7eb',
            },
        }}>
            <Tabs.Screen
                name="asistente"
                options={{
                    title: 'Asistente',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons size={size} name="chatbubble-outline" color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons size={size} name="home" color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="avances"
                options={{
                    title: 'Avances',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons size={size} name="stats-chart-outline" color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}