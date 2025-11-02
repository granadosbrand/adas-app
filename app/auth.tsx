import { usersService } from '@/services/api';
import useUserStore from '@/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import * as Burnt from 'burnt';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthScreen = () => {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const setUser = useUserStore((s) => s.setUser);
    const router = useRouter();

    const handleCreateUser = async () => {
        if (!username.trim()) {
            try {
                Burnt.toast({
                    title: 'Error',
                    preset: 'error',
                    message: 'Ingresa un nombre de usuario',
                    haptic: 'error',
                    duration: 2,
                });
            } catch { }
            return;
        }

        setIsLoading(true);
        const { data, error } = await usersService.createUser({
            username: username.trim(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

        setIsLoading(false);

        if (error || !data) {
            try {
                Burnt.toast({
                    title: 'Error al crear usuario',
                    preset: 'error',
                    message: error?.message || 'Intenta nuevamente',
                    haptic: 'error',
                    duration: 3,
                });
            } catch { }
            return;
        }

        setUser(data);
        try {
            Burnt.toast({
                title: '¡Bienvenido!',
                preset: 'done',
                message: `Usuario ${data.username} creado exitosamente`,
                haptic: 'success',
                duration: 2,
            });
        } catch { }

        router.replace('/(drawer)/(tabs)/home');
    };

    const handleLogin = async () => {
        if (!userId.trim()) {
            try {
                Burnt.toast({
                    title: 'Error',
                    preset: 'error',
                    message: 'Ingresa tu ID de usuario',
                    haptic: 'error',
                    duration: 2,
                });
            } catch { }
            return;
        }

        setIsLoading(true);
        const { data, error } = await usersService.getUser(userId.trim());
        setIsLoading(false);

        if (error || !data) {
            try {
                Burnt.toast({
                    title: 'Usuario no encontrado',
                    preset: 'error',
                    message: 'Verifica tu ID o crea una cuenta nueva',
                    haptic: 'error',
                    duration: 3,
                });
            } catch { }
            return;
        }

        setUser(data);
        try {
            Burnt.toast({
                title: '¡Bienvenido de vuelta!',
                preset: 'done',
                message: `Hola ${data.username}`,
                haptic: 'success',
                duration: 2,
            });
        } catch { }

        router.replace('/(drawer)/(tabs)/home');
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-50">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 px-6 justify-center">
                        {/* Logo/Icono */}
                        <View className="items-center mb-8">
                            <View className="bg-primary rounded-full p-6 mb-4">
                                <Ionicons name="person-add" size={64} color="#fff" />
                            </View>
                            <Text className="text-3xl font-work-black text-neutral-800 mb-2">
                                ADAS
                            </Text>
                            <Text className="text-center text-neutral-600 font-work-medium">
                                Sistema de Apoyo para Adicciones
                            </Text>
                        </View>

                        {/* Toggle Login/Register */}
                        <View className="flex-row bg-white rounded-xl p-1 mb-6 border border-neutral-200">
                            <Pressable
                                onPress={() => setIsLogin(true)}
                                className={`flex-1 py-3 rounded-lg ${isLogin ? 'bg-primary' : 'bg-transparent'
                                    }`}
                            >
                                <Text
                                    className={`text-center font-work-medium ${isLogin ? 'text-white' : 'text-neutral-600'
                                        }`}
                                >
                                    Ingresar
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setIsLogin(false)}
                                className={`flex-1 py-3 rounded-lg ${!isLogin ? 'bg-primary' : 'bg-transparent'
                                    }`}
                            >
                                <Text
                                    className={`text-center font-work-medium ${!isLogin ? 'text-white' : 'text-neutral-600'
                                        }`}
                                >
                                    Crear Cuenta
                                </Text>
                            </Pressable>
                        </View>

                        {/* Formulario */}
                        <View className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
                            {isLogin ? (
                                // Login Form
                                <>
                                    <Text className="text-lg font-work-black text-neutral-800 mb-4">
                                        Ingresar con ID
                                    </Text>
                                    <TextInput
                                        className="bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 mb-4 font-work-medium text-neutral-800"
                                        placeholder="Ingresa tu ID de usuario"
                                        placeholderTextColor="#9ca3af"
                                        value={userId}
                                        onChangeText={setUserId}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <Pressable
                                        onPress={handleLogin}
                                        disabled={isLoading}
                                        className="bg-primary rounded-xl py-4 items-center active:opacity-80"
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text className="text-white font-work-black text-lg">
                                                Ingresar
                                            </Text>
                                        )}
                                    </Pressable>
                                </>
                            ) : (
                                // Register Form
                                <>
                                    <Text className="text-lg font-work-black text-neutral-800 mb-4">
                                        Crear Nueva Cuenta
                                    </Text>
                                    <TextInput
                                        className="bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 mb-4 font-work-medium text-neutral-800"
                                        placeholder="Elige un nombre de usuario"
                                        placeholderTextColor="#9ca3af"
                                        value={username}
                                        onChangeText={setUsername}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <Pressable
                                        onPress={handleCreateUser}
                                        disabled={isLoading}
                                        className="bg-primary rounded-xl py-4 items-center active:opacity-80"
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text className="text-white font-work-black text-lg">
                                                Crear Cuenta
                                            </Text>
                                        )}
                                    </Pressable>
                                    <View className="mt-4 bg-insight-light p-3 rounded-lg">
                                        <Text className="text-accent-dark text-sm font-work-medium">
                                            💡 Guarda tu ID de usuario después de crear la cuenta
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>

                        {/* Mensaje informativo */}
                        <View className="mt-6 bg-growth-light rounded-xl p-4">
                            <Text className="text-center text-growth-dark font-work-medium">
                                Tu privacidad es importante. No compartimos tu información.
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AuthScreen;
