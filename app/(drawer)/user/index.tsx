import useUserStore from '@/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  const user = useUserStore((s) => s.user);

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 px-6">
        {/* Header con avatar */}
        <View className="items-center pt-8 pb-6">
          <View className="bg-primary rounded-full h-24 w-24 items-center justify-center mb-4 shadow-lg">
            <Text className="text-white font-work-black text-3xl">
              {user?.username?.substring(0, 2).toUpperCase() || 'US'}
            </Text>
          </View>
          <Text className="text-2xl font-work-black text-neutral-800">
            {user?.username || 'Usuario'}
          </Text>
          <Text className="text-neutral-500 font-work-medium mt-1">
            ID: {user?.id || 'No disponible'}
          </Text>
        </View>

        {/* Información del usuario */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-neutral-200 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="bg-insight-light p-3 rounded-lg mr-3">
              <Ionicons name="information-circle" size={24} color="#8b5cf6" />
            </View>
            <Text className="text-lg font-work-black text-neutral-800">
              Información de Cuenta
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-neutral-500 font-work-medium text-sm mb-1">
              Nombre de usuario
            </Text>
            <Text className="text-neutral-800 font-work-medium text-base">
              {user?.username || 'No especificado'}
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-neutral-500 font-work-medium text-sm mb-1">
              Zona horaria
            </Text>
            <Text className="text-neutral-800 font-work-medium text-base">
              {user?.timezone || 'No especificado'}
            </Text>
          </View>

          <View>
            <Text className="text-neutral-500 font-work-medium text-sm mb-1">
              Cuenta creada
            </Text>
            <Text className="text-neutral-800 font-work-medium text-base">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'No disponible'}
            </Text>
          </View>
        </View>

        {/* Mensaje de privacidad */}
        <View className="bg-growth-light rounded-xl p-4 border-l-4 border-secondary">
          <View className="flex-row items-center mb-2">
            <Ionicons name="shield-checkmark" size={20} color="#10b981" />
            <Text className="text-growth-dark font-work-black ml-2">
              Tu privacidad es importante
            </Text>
          </View>
          <Text className="text-growth-dark text-sm font-work-medium">
            Tus datos están seguros y solo se usan para mejorar tu experiencia en ADAS.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;