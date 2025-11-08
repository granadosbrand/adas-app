import LanguageSelector from '@/components/shared/LanguageSelector';
import { usersService } from '@/services/api';
import useUserStore from '@/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import Toast from 'react-native-toast-message';

const AuthScreen = () => {
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const setLoginData = useUserStore((s) => s.setLoginData);
    const setUser = useUserStore((s) => s.setUser);
    const router = useRouter();

    const { t } = useTranslation(['auth', 'common']);

    const handleCreateUser = async () => {
        if (!username.trim()) {
            try {
                Toast.show({
                    type: 'error',
                    text1: t('common:error'),
                    text2: t('auth:enterUsernameError'),
                    position: 'bottom',
                    visibilityTime: 2000,
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
                Toast.show({
                    type: 'error',
                    text1: t('auth:createUserError'),
                    text2: error?.message || t('auth:tryAgain'),
                    position: 'bottom',
                    visibilityTime: 3000,
                });
            } catch { }
            return;
        }

        setUser(data);
        try {
            Toast.show({
                type: 'success',
                text1: t('auth:welcomeNewUser'),
                text2: t('auth:userCreatedSuccess', { username: data.username }),
                position: 'bottom',
                visibilityTime: 2000,
            });
        } catch { }

        router.replace('/(drawer)/(tabs)/home');
    };

    const handleLogin = async () => {
        if (!username.trim()) {
            try {
                Toast.show({
                    type: 'error',
                    text1: t('common:error'),
                    text2: t('auth:enterUsernameError'),
                    position: 'bottom',
                    visibilityTime: 2000,
                });
            } catch { }
            return;
        }

        setIsLoading(true);
        const { data, error } = await usersService.login({
            username: username.trim()
        });
        setIsLoading(false);

        if (error || !data) {
            try {
                Toast.show({
                    type: 'error',
                    text1: t('auth:userNotFound'),
                    text2: t('auth:verifyUsernameOrCreate'),
                    position: 'bottom',
                    visibilityTime: 3000,
                });
            } catch { }
            return;
        }

        // Guardar toda la información del login
        setLoginData({
            user: data.user,
            settings: data.settings,
            mode: data.mode,
            pendingCheckpoint: data.pending_checkpoint || null,
        });

        try {
            Toast.show({
                type: 'success',
                text1: t('auth:welcomeBack'),
                text2: t('auth:helloUser', { username: data.user.username }),
                position: 'bottom',
                visibilityTime: 2000,
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
                        {/* Language Selector */}
                        <View className="absolute top-0 right-0 z-10">
                            <LanguageSelector />
                        </View>

                        {/* Logo/Icono */}
                        <View className="items-center mb-8">
                            <View className="bg-primary rounded-full p-6 mb-4">
                                <Ionicons name="person-add" size={64} color="#fff" />
                            </View>
                            <Text className="text-7xl font-work-black text-bold-800 mb-0">
                                ADAS
                            </Text>
                            <Text className="text-center text-bold uppercase mt-0">
                                {t('auth:slogan')}
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
                                    {t('auth:login')}
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
                                    {t('auth:register')}
                                </Text>
                            </Pressable>
                        </View>

                        {/* Formulario */}
                        <View className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
                            {isLogin ? (
                                // Login Form
                                <>
                                    <Text className="text-lg font-work-black text-neutral-800 mb-4">
                                        {t('auth:loginWithUsername')}
                                    </Text>
                                    <TextInput
                                        className="bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 mb-4 font-work-medium text-neutral-800"
                                        placeholder={t('auth:enterUsername')}
                                        placeholderTextColor="#9ca3af"
                                        value={username}
                                        onChangeText={setUsername}
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
                                                {t('auth:login')}
                                            </Text>
                                        )}
                                    </Pressable>
                                </>
                            ) : (
                                // Register Form
                                <>
                                    <Text className="text-lg font-work-black text-neutral-800 mb-4">
                                        {t('auth:createNewAccount')}
                                    </Text>
                                    <TextInput
                                        className="bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 mb-4 font-work-medium text-neutral-800"
                                        placeholder={t('auth:chooseUsername')}
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
                                                {t('auth:register')}
                                            </Text>
                                        )}
                                    </Pressable>
                                    <View className="mt-4 bg-insight-light p-3 rounded-lg">
                                        <Text className="text-accent-dark text-sm font-work-medium">
                                            {t('auth:saveUsernameTip')}
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>

                        {/* Mensaje informativo */}
                        <View className="mt-6 bg-growth-light rounded-xl p-4">
                            <Text className="text-center text-growth-dark font-work-medium">
                                {t('auth:privacyMessage')}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AuthScreen;
