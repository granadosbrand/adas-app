import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AsistenteScreen = () => {
    const navigation = useNavigation();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.toggleDrawer());
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-50">
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-neutral-100 shadow-sm">
                <Pressable onPress={openDrawer} className="p-2 rounded-full bg-primary-50 active:bg-primary-100">
                    <Ionicons name="menu" size={20} color="#4f46e5" />
                </Pressable>
                <Text className="text-lg font-work-medium text-neutral-800">Asistente IA</Text>
                <View style={{ width: 32 }} />
            </View>

            {/* Contenido principal */}
            <View className="flex-1 items-center justify-center px-6">
                <View className="bg-accent-light rounded-full p-6 mb-6">
                    <Ionicons
                        name="chatbubble-ellipses"
                        size={64}
                        color="#8b5cf6"
                    />
                </View>
                <Text className="text-2xl font-work-black text-center mb-4 text-neutral-800">
                    Asistente Personal
                </Text>
                <Text className="text-center text-neutral-600 font-work-medium text-base leading-6">
                    Próximamente tendrás acceso a un{'\n'}
                    asistente de IA que te ayudará en{'\n'}
                    tu proceso de reflexión y crecimiento
                </Text>

                {/* Placeholder para el futuro chat */}
                <View className="mt-8 w-full max-w-sm">
                    <View className="bg-insight-light rounded-xl p-4 mb-3 border-l-4 border-accent">
                        <Text className="text-accent-dark font-work-medium">
                            "¿Cómo te sientes hoy?"
                        </Text>
                    </View>
                    <View className="bg-warmth-light rounded-xl p-4 mb-3 border-l-4 border-tertiary">
                        <Text className="text-tertiary-dark font-work-medium">
                            "¿Qué has aprendido de ti mismo?"
                        </Text>
                    </View>
                    <View className="bg-growth-light rounded-xl p-4 border-l-4 border-secondary">
                        <Text className="text-growth-dark font-work-medium">
                            "Estoy aquí para acompañarte"
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AsistenteScreen;