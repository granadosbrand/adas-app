import LanguageSelector from '@/components/shared/LanguageSelector';
import useUserStore from '@/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  const user = useUserStore((s) => s.user);
  const { t } = useTranslation('profile');

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 px-6">
        {/* Language Selector */}
        <View className="absolute top-0 right-0 z-10">
          <LanguageSelector />
        </View>

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
            ID: {user?.id || t('notAvailable')}
          </Text>
        </View>

        {/* Información del usuario */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-neutral-200 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="p-3 rounded-lg mr-3">
              <Ionicons name="information-circle" size={24} color="#1ca6c0" />
            </View>
            <Text className="text-lg font-work-black text-neutral-800">
              {t('accountInfo')}
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-neutral-500 font-work-medium text-sm mb-1">
              {t('username')}
            </Text>
            <Text className="text-neutral-800 font-work-medium text-base">
              {user?.username || t('notSpecified')}
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-neutral-500 font-work-medium text-sm mb-1">
              {t('timezone')}
            </Text>
            <Text className="text-neutral-800 font-work-medium text-base">
              {user?.timezone || t('notSpecified')}
            </Text>
          </View>

          <View>
            <Text className="text-neutral-500 font-work-medium text-sm mb-1">
              {t('accountCreated')}
            </Text>
            <Text className="text-neutral-800 font-work-medium text-base">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : t('notAvailable')}
            </Text>
          </View>
        </View>

        {/* Mensaje de privacidad */}
        <View className="bg-growth-light rounded-xl p-4 border-l-4 border-secondary">
          <View className="flex-row items-center mb-2">
            <Ionicons name="shield-checkmark" size={20} color="#10b981" />
            <Text className="text-growth-dark font-work-black ml-2">
              {t('privacyTitle')}
            </Text>
          </View>
          <Text className="text-growth-dark text-sm font-work-medium">
            {t('privacyMessage')}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;