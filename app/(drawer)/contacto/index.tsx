import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Pressable, SafeAreaView, Text, View } from 'react-native';

const ContactoScreen = () => {
    const contactOptions = [
        {
            icon: 'call-outline',
            title: 'Línea de Crisis 24/7',
            subtitle: '123-456-7890',
            action: () => Linking.openURL('tel:1234567890'),
        },
        {
            icon: 'chatbubble-outline',
            title: 'Chat de Apoyo',
            subtitle: 'Disponible 9:00 - 18:00',
            action: () => { }, // Placeholder
        },
        {
            icon: 'mail-outline',
            title: 'Email de Soporte',
            subtitle: 'soporte@recuperacion.com',
            action: () => Linking.openURL('mailto:soporte@recuperacion.com'),
        },
        {
            icon: 'location-outline',
            title: 'Centros Cercanos',
            subtitle: 'Encuentra ayuda profesional',
            action: () => { }, // Placeholder
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
            <View className="flex-1 px-4">
        <View className="bg-gradient-to-r from-warmth-light to-growth-light rounded-xl p-4 mt-6 mb-8">
          <Text className="text-2xl font-work-black text-neutral-800 mb-2">
            ¿Necesitas Ayuda?
          </Text>
          <Text className="text-neutral-700 font-work-medium">
            Estamos aquí para acompañarte. No estás solo en este proceso.
          </Text>
        </View>                {contactOptions.map((option, index) => (
                    <Pressable
                        key={index}
                        onPress={option.action}
                        className="bg-white dark:bg-neutral-800 rounded-lg p-4 mb-4 border border-neutral-200 dark:border-neutral-700 active:bg-neutral-50 dark:active:bg-neutral-700"
                    >
                        <View className="flex-row items-center">
                            <View className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-3 mr-4">
                                <Ionicons
                                    name={option.icon as any}
                                    size={24}
                                    color="#6366f1"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-work-medium mb-1">
                                    {option.title}
                                </Text>
                                <Text className="text-neutral-600 dark:text-neutral-300">
                                    {option.subtitle}
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward-outline"
                                size={20}
                                color="#9ca3af"
                            />
                        </View>
                    </Pressable>
                ))}

                {/* Mensaje de emergencia */}
                <View className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mt-8">
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="warning-outline" size={20} color="#ef4444" />
                        <Text className="text-red-600 dark:text-red-400 font-work-black ml-2">
                            En caso de emergencia
                        </Text>
                    </View>
                    <Text className="text-red-600 dark:text-red-400 mb-3">
                        Si estás en crisis inmediata o tienes pensamientos de autolesión,
                        busca ayuda inmediatamente.
                    </Text>
                    <Pressable
                        onPress={() => Linking.openURL('tel:911')}
                        className="bg-red-600 rounded-lg py-3 items-center"
                    >
                        <Text className="text-white font-work-black">
                            LLAMAR AL 911
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ContactoScreen;