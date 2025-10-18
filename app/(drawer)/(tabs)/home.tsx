import SetButton from '@/components/set-home/SetButton';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
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
                <Text className="text-lg font-work-medium text-neutral-800">Mi Progreso</Text>
                <View style={{ width: 32 }} />
            </View>

            {/* Contenido principal */}
            <View className="flex-1 w-full px-6 justify-between">
                {/* Center area for the main action */}
                <View />

                <View className="items-center">
                    <SetButton />
                </View>

                {/* Bottom card */}
                <View className="w-full pb-0">
                    <View className="bg-growth-light rounded-2xl p-4 mx-4">
                        <Text className="text-center text-growth text-sm font-work-medium mt-2">
                            Cada paso cuenta en tu proceso de crecimiento 🌱
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;