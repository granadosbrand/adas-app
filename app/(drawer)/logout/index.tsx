import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LogoutScreen = () => {
    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: () => {
                        // Placeholder - aquí iría la lógica de logout
                        Alert.alert('Info', 'Funcionalidad en desarrollo');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-50">
            <View className="flex-1 items-center justify-center px-6">
                <View className="bg-warmth-light rounded-full p-6 mb-6">
                    <Ionicons
                        name="log-out-outline"
                        size={64}
                        color="#d97706"
                    />
                </View>

                <Text className="text-2xl font-work-black text-center mb-4 text-neutral-800">
                    Cerrar Sesión
                </Text>

                <Text className="text-center text-neutral-600 mb-8 font-work-medium text-base leading-6">
                    ¿Estás seguro que deseas cerrar sesión?{'\n'}
                    Tus progresos se mantendrán guardados.
                </Text>                <View className="w-full max-w-sm">
                    <Pressable
                        onPress={handleLogout}
                        className="bg-tertiary rounded-xl py-4 items-center mb-4 active:bg-tertiary-600 shadow-lg"
                    >
                        <Text className="text-white font-work-black text-lg">
                            Confirmar Cierre de Sesión
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => {/* Navegar atrás o al home */ }}
                        className="bg-neutral-100 rounded-xl py-4 items-center active:bg-neutral-200 border border-neutral-300"
                    >
                        <Text className="text-neutral-700 font-work-black text-lg">
                            Cancelar
                        </Text>
                    </Pressable>
                </View>

                <View className="mt-12 bg-growth-light rounded-xl p-4 border-l-4 border-secondary">
                    <Text className="text-sm text-growth-dark text-center font-work-medium">
                        🌱 Recuerda que tu progreso es valioso.{'\n'}
                        Cada paso cuenta en tu proceso de crecimiento.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default LogoutScreen;