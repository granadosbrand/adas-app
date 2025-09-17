import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'primary',
            // tabBarStyle: {
            //     backgroundColor: 'black'
            // },

        }}>
            <Tabs.Screen
                name="(stack)"
                options={{
                    title: 'Stack',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="person-outline" color={color} />,
                    headerShown: false,

                }}
            />
            <Tabs.Screen
                name="home/index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="home-outline" color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="favorites/index"
                options={{
                    title: 'Favoritos',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="star-outline" color={color} />,
                }}
            />
        </Tabs>
    );
}