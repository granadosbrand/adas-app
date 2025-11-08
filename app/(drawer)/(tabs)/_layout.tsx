import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
    const { t } = useTranslation('drawer');
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#1ca6c0',
            tabBarInactiveTintColor: '#6b7280',
            tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#e5e7eb',
                shadowColor: '#1ca6c0',
                shadowOffset: { width: 0, height: -1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 5,
            },
        }}>
            <Tabs.Screen
                name="asistente"
                options={{
                    title: t('tabs.assistant'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons size={size} name="chatbubble-outline" color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: t('home'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons size={size} name="home" color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="avances"
                options={{
                    title: t('tabs.advances'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons size={size} name="stats-chart-outline" color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}