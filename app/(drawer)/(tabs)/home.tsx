import CheckpointCard from '@/components/set-home/CheckpointCard';
import RelapseModal from '@/components/set-home/RelapseModal';
import SetButton from '@/components/set-home/SetButton';
import useUserStore from '@/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const navigation = useNavigation();
    const user = useUserStore((s) => s.user);
    const mode = useUserStore((s) => s.mode);
    const pendingCheckpoint = useUserStore((s) => s.pendingCheckpoint);

    const [showPastEventModal, setShowPastEventModal] = useState(false);

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.toggleDrawer());
    };

    const isSurvivorMode = mode === 'survivor';
    const hasCheckpoint = isSurvivorMode && pendingCheckpoint;

    return (
        <SafeAreaView className="flex-1 bg-neutral-50">
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-neutral-100 shadow-sm">
                <Pressable onPress={openDrawer} className="p-2 rounded-full bg-primary-50 active:bg-primary-100">
                    <Ionicons name="menu" size={20} color="#4f46e5" />
                </Pressable>
                <Text className="text-lg font-work-medium text-neutral-800">Mi Progreso</Text>
                <View style={{ width: 32 }} />
            </View>

            {/* Contenido principal */}
            <ScrollView className="flex-1 w-full px-6" contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
                {/* Top area - Checkpoint card si existe */}
                <View className="pt-6">
                    {hasCheckpoint && (
                        <CheckpointCard checkpoint={pendingCheckpoint} />
                    )}
                    {!hasCheckpoint && isSurvivorMode && (
                        <View className="bg-insight-light rounded-2xl p-4 border border-accent-200">
                            <View className="flex-row items-center">
                                <Ionicons name="information-circle" size={24} color="#8b5cf6" />
                                <Text className="text-accent-dark font-work-black ml-3 flex-1">
                                    No hay checkpoint pendiente
                                </Text>
                            </View>
                            <Text className="text-accent-dark/80 text-sm font-work-medium mt-2">
                                Registra una recaída para generar tu próximo objetivo
                            </Text>
                        </View>
                    )}
                    {!isSurvivorMode && (
                        <View className="bg-primary-light rounded-2xl p-4 border border-primary-200">
                            <View className="flex-row items-center">
                                <Ionicons name="bar-chart" size={24} color="#4f46e5" />
                                <Text className="text-primary-dark font-work-black ml-3 flex-1">
                                    Modo Evaluación
                                </Text>
                            </View>
                            <Text className="text-primary-dark/80 text-sm font-work-medium mt-2">
                                Estás en fase de evaluación. Registra tus recaídas para establecer tu patrón base
                            </Text>
                        </View>
                    )}
                </View>

                {/* Center area - Botón principal */}
                <View className="items-center py-8">
                    <SetButton />
                    <Text className="text-neutral-600 font-work-medium text-sm mt-4">
                        Presiona para registrar
                    </Text>

                    {/* Botón para eventos pasados */}
                    <Pressable
                        onPress={() => setShowPastEventModal(true)}
                        className="flex-row items-center mt-6 px-4 py-2 bg-neutral-100 rounded-full active:bg-neutral-200"
                    >
                        <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                        <Text className="text-neutral-600 font-work-medium text-xs ml-2">
                            Registrar evento pasado
                        </Text>
                    </Pressable>
                </View>

                {/* Bottom card - Mensaje motivacional */}
                <View className="pb-6">
                    <View className="bg-growth-light rounded-2xl p-4">
                        <Text className="text-center text-growth text-sm font-work-medium">
                            Cada paso cuenta en tu proceso de crecimiento 🌱
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Modal para eventos pasados */}
            <RelapseModal
                visible={showPastEventModal}
                onClose={() => setShowPastEventModal(false)}
                onSuccess={() => setShowPastEventModal(false)}
            />
        </SafeAreaView>
    );
};

export default HomeScreen;