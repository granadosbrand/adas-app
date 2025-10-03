import React, { useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native'
import useAuthStore from '../store/useAuthStore'
import CustomButton from './shared/CustomButton'

export default function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)

    const { signIn, signUp, loading } = useAuthStore()

    const handleAuth = async () => {
        if (!email || !password) {
            return
        }

        try {
            if (isSignUp) {
                await signUp(email, password)
            } else {
                await signIn(email, password)
            }
        } catch {
            // Error ya manejado en el store
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 justify-center px-6 py-8">
                    {/* Header */}
                    <View className="mb-8">
                        <Text className="text-4xl font-work-black text-primary mb-2">
                            {isSignUp ? 'Crear Cuenta' : 'Bienvenido'}
                        </Text>
                        <Text className="text-base font-work-light text-gray-600">
                            {isSignUp
                                ? 'Regístrate para comenzar tu camino'
                                : 'Inicia sesión para continuar'}
                        </Text>
                    </View>

                    {/* Email Input */}
                    <View className="mb-4">
                        <Text className="text-sm font-work-medium text-gray-700 mb-2">
                            Correo electrónico
                        </Text>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-lg px-4 py-3 font-work-medium text-base"
                            onChangeText={setEmail}
                            value={email}
                            placeholder="correo@ejemplo.com"
                            autoCapitalize="none"
                            autoComplete="email"
                            keyboardType="email-address"
                            editable={!loading}
                        />
                    </View>

                    {/* Password Input */}
                    <View className="mb-6">
                        <Text className="text-sm font-work-medium text-gray-700 mb-2">
                            Contraseña
                        </Text>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-lg px-4 py-3 font-work-medium text-base"
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry={true}
                            placeholder="••••••••"
                            autoCapitalize="none"
                            autoComplete="password"
                            editable={!loading}
                        />
                    </View>

                    {/* Action Button */}
                    <CustomButton
                        onPress={handleAuth}
                        disabled={loading || !email || !password}
                        color="primary"
                        className="mb-4 opacity-100 disabled:opacity-50"
                    >
                        {loading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
                    </CustomButton>

                    {loading && (
                        <ActivityIndicator
                            size="small"
                            color="#6366f1"
                            className="mb-4"
                        />
                    )}

                    {/* Toggle Sign Up / Sign In */}
                    <View className="flex-row justify-center items-center">
                        <Text className="text-gray-600 font-work-light">
                            {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                        </Text>
                        <CustomButton
                            onPress={() => setIsSignUp(!isSignUp)}
                            disabled={loading}
                            variant="text-only"
                            color="primary"
                        >
                            {isSignUp ? 'Iniciar Sesión' : 'Registrarse'}
                        </CustomButton>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}