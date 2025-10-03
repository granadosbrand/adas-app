import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import CustomButton from '../../../components/shared/CustomButton'
import useAuthStore from '../../../store/useAuthStore'

const ProfileScreen = () => {
  const { user, session } = useAuthStore();
  const router = useRouter();

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <Text className="text-lg font-work-medium text-neutral-600">
          Cargando perfil...
        </Text>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView className="flex-1">
        {/* Header con avatar */}
        <View className="bg-primary pt-8 pb-12 px-6 rounded-b-3xl">
          <View className="items-center">
            <View className="bg-white w-24 h-24 rounded-full items-center justify-center mb-4 shadow-lg">
              <Ionicons name="person" size={48} color="#4f46e5" />
            </View>
            <Text className="text-2xl font-work-black text-white mb-1">
              {user.email?.split('@')[0]}
            </Text>
            <Text className="text-sm font-work-light text-white/80">
              {user.email}
            </Text>
          </View>
        </View>

        {/* Información del usuario */}
        <View className="px-6 py-6 space-y-4">
          {/* Card de información */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
            <Text className="text-lg font-work-black text-neutral-800 mb-4">
              Información de la Cuenta
            </Text>

            {/* ID de usuario */}
            <View className="mb-4">
              <Text className="text-sm font-work-medium text-neutral-500 mb-1">
                ID de Usuario
              </Text>
              <Text className="text-base font-work-medium text-neutral-800" numberOfLines={1}>
                {user.id}
              </Text>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-sm font-work-medium text-neutral-500 mb-1">
                Correo Electrónico
              </Text>
              <Text className="text-base font-work-medium text-neutral-800">
                {user.email}
              </Text>
            </View>

            {/* Fecha de creación */}
            <View className="mb-4">
              <Text className="text-sm font-work-medium text-neutral-500 mb-1">
                Miembro desde
              </Text>
              <Text className="text-base font-work-medium text-neutral-800">
                {user.created_at ? formatDate(user.created_at) : 'No disponible'}
              </Text>
            </View>

            {/* Último acceso */}
            {user.last_sign_in_at && (
              <View>
                <Text className="text-sm font-work-medium text-neutral-500 mb-1">
                  Último acceso
                </Text>
                <Text className="text-base font-work-medium text-neutral-800">
                  {formatDate(user.last_sign_in_at)}
                </Text>
              </View>
            )}
          </View>

          {/* Card de sesión */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
            <Text className="text-lg font-work-black text-neutral-800 mb-4">
              Estado de Sesión
            </Text>

            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <Text className="text-base font-work-medium text-neutral-800">
                Sesión Activa
              </Text>
            </View>

            {session?.expires_at && (
              <Text className="text-sm font-work-light text-neutral-500 mt-2">
                Expira: {formatDate(new Date(session.expires_at * 1000).toISOString())}
              </Text>
            )}
          </View>

          {/* Mensaje motivacional */}
          <View className="bg-growth-light rounded-2xl p-4 border-l-4 border-secondary mt-4">
            <Text className="text-sm text-growth-dark text-center font-work-medium">
              🌱 Cada día es una oportunidad para crecer.{'\n'}
              Tu progreso es valioso y cada paso cuenta.
            </Text>
          </View>

          {/* Botón de cerrar sesión */}
          <View className="mt-6">
            <CustomButton
              onPress={() => router.push('/(drawer)/logout')}
              color="tertiary"
            >
              Cerrar Sesión
            </CustomButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen