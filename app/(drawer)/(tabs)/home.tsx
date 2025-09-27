import SetButton from '@/components/set-home/SetButton';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

const HomeScreen = () => {
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
                <Text className="text-lg font-work-medium">Mi Progreso</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Contenido principal */}
            <View className="flex-1 items-center justify-center px-6">
                <SetButton />
                <Text className="mt-8 text-center text-neutral-600 dark:text-neutral-300 font-work-medium">
                    Presiona SET cuando hayas completado{'\n'}un paso hacia tu recuperación
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;