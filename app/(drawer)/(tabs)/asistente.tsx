import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

const AsistenteScreen = () => {
    const navigation = useNavigation();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.toggleDrawer());
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                <Pressable onPress={openDrawer}>
                    <Ionicons name="menu" size={24} color="#6366f1" />
                </Pressable>
                <Text className="text-lg font-work-medium">Asistente IA</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Contenido principal */}
            <View className="flex-1 items-center justify-center px-6">
                <Ionicons
                    name="chatbubble-ellipses"
                    size={80}
                    color="#6366f1"
                    style={{ marginBottom: 20 }}
                />
                <Text className="text-2xl font-work-black text-center mb-4">
                    Asistente Personal
                </Text>
                <Text className="text-center text-neutral-600 dark:text-neutral-300 font-work-medium">
                    Próximamente tendrás acceso a un{'\n'}
                    asistente de IA que te ayudará en{'\n'}
                    tu proceso de recuperación
                </Text>

                {/* Placeholder para el futuro chat */}
                <View className="mt-8 w-full max-w-sm">
                    <View className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 mb-3">
                        <Text className="text-neutral-500 italic">
                            "¿Cómo te sientes hoy?"
                        </Text>
                    </View>
                    <View className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 mb-3">
                        <Text className="text-neutral-500 italic">
                            "¿Necesitas hablar sobre algo específico?"
                        </Text>
                    </View>
                    <View className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
                        <Text className="text-neutral-500 italic">
                            "Estoy aquí para apoyarte"
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AsistenteScreen;