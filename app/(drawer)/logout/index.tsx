import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable, SafeAreaView, Text, View } from 'react-native';

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
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
            <View className="flex-1 items-center justify-center px-6">
                <Ionicons
                    name="log-out-outline"
                    size={80}
                    color="#ef4444"
                    style={{ marginBottom: 24 }}
                />

                <Text className="text-2xl font-work-black text-center mb-4">
                    Cerrar Sesión
                </Text>

                <Text className="text-center text-neutral-600 dark:text-neutral-300 mb-8 font-work-medium">
                    ¿Estás seguro que deseas cerrar sesión?{'\n'}
                    Tus progresos se mantendrán guardados.
                </Text>

                <View className="w-full max-w-sm">
                    <Pressable
                        onPress={handleLogout}
                        className="bg-red-600 rounded-lg py-4 items-center mb-4 active:bg-red-700"
                    >
                        <Text className="text-white font-work-black text-lg">
                            Confirmar Cierre de Sesión
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => {/* Navegar atrás o al home */ }}
                        className="bg-neutral-200 dark:bg-neutral-700 rounded-lg py-4 items-center active:bg-neutral-300 dark:active:bg-neutral-600"
                    >
                        <Text className="text-neutral-700 dark:text-neutral-200 font-work-black text-lg">
                            Cancelar
                        </Text>
                    </Pressable>
                </View>

                <View className="mt-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
                    <Text className="text-sm text-neutral-600 dark:text-neutral-300 text-center">
                        💡 Recuerda que tu progreso es valioso.{'\n'}
                        Mantén el compromiso contigo mismo.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default LogoutScreen;