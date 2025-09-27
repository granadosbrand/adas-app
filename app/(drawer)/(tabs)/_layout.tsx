import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#4f46e5', // primary ADAS
            tabBarInactiveTintColor: '#6b7280', // neutral-500
            tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#e5e7eb',
                shadowColor: '#4f46e5',
                shadowOffset: { width: 0, height: -1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 5,
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