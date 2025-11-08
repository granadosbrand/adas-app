import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AsistenteScreen = () => {
    const { t } = useTranslation('asistente');
    const navigation = useNavigation();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.toggleDrawer());
    };

    return (
        <SafeAreaView className="flex-1 bg-primary-50">
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-neutral-100 shadow-sm">
                <Pressable onPress={openDrawer} className="p-2 rounded-full bg-primary-50 active:bg-primary-100">
                    <Ionicons name="menu" size={20} color="#1ca6c0" />
                </Pressable>
                <Text className="text-lg font-work-medium text-neutral-800">{t('header')}</Text>
                <View style={{ width: 32 }} />
            </View>

            {/* Contenido principal */}
            <View className="flex-1 items-center justify-center px-6">
                <View className="bg-primary-light rounded-full p-6 mb-6">
                    <Ionicons
                        name="chatbubble-ellipses"
                        size={64}
                        color="#1ca6c0"
                    />
                </View>
                <Text className="text-2xl font-work-black text-center mb-4 text-neutral-800">
                    {t('title')}
                </Text>
                <Text className="text-center text-neutral-600 font-work-medium text-base leading-6">
                    {t('description')}
                </Text>

                {/* Placeholder para el futuro chat */}
                <View className="mt-8 w-full max-w-sm">
                    <View className="bg-insight-light rounded-xl p-4 mb-3 border-l-4 border-accent">
                        <Text className="text-accent-dark font-work-medium">
                            {t('examples.question1')}
                        </Text>
                    </View>
                    <View className="bg-warmth-light rounded-xl p-4 mb-3 border-l-4 border-tertiary">
                        <Text className="text-tertiary-dark font-work-medium">
                            {t('examples.question2')}
                        </Text>
                    </View>
                    <View className="bg-growth-light rounded-xl p-4 border-l-4 border-secondary">
                        <Text className="text-growth-dark font-work-medium">
                            {t('examples.response1')}
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AsistenteScreen;