import { formatRelative } from '@/lib/dateUtils';
import { checkpointsService, relapsesService } from '@/services/api';
import useUserStore from '@/store/useUserStore';
import { Checkpoint, Relapse } from '@/types/api.types';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AvancesScreen = () => {
  const navigation = useNavigation();
  const user = useUserStore((s) => s.user);

  const [relapses, setRelapses] = useState<Relapse[]>([]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  // Cargar datos desde la API
  const loadData = async (isRefresh = false) => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    // Cargar relapses y checkpoints en paralelo
    const [relapsesResult, checkpointsResult] = await Promise.all([
      relapsesService.listRelapses(user.id, { limit: 100 }),
      checkpointsService.listCheckpoints(user.id, { limit: 100 }),
    ]);

    if (relapsesResult.data) {
      setRelapses(relapsesResult.data);
    }

    if (checkpointsResult.data) {
      setCheckpoints(checkpointsResult.data);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  };

  // Cargar datos cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user?.id])
  );

  // Refrescar datos
  const handleRefresh = () => {
    loadData(true);
  };

  // Simular progreso diario de la última semana (basado en relapses)
  const getWeekProgress = () => {
    const today = new Date();
    const weekData = [0, 0, 0, 0, 0, 0, 0]; // L, M, X, J, V, S, D

    relapses.forEach((relapse) => {
      const relapseDate = new Date(relapse.occurred_at);
      const diffTime = today.getTime() - relapseDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Solo últimos 7 días
      if (diffDays >= 0 && diffDays < 7) {
        const dayIndex = (today.getDay() - diffDays + 7) % 7;
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Ajustar para L-D
        weekData[adjustedIndex]++;
      }
    });

    return weekData;
  };

  const weekProgress = getWeekProgress();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50">
        <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-neutral-100 shadow-sm">
          <Pressable onPress={openDrawer} className="p-2 rounded-full bg-primary-50 active:bg-primary-100">
            <Ionicons name="menu" size={20} color="#4f46e5" />
          </Pressable>
          <Text className="text-lg font-work-medium text-neutral-800">Mis Avances</Text>
          <View style={{ width: 32 }} />
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="text-neutral-600 font-work-medium mt-4">Cargando avances...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-neutral-100 shadow-sm">
        <Pressable onPress={openDrawer} className="p-2 rounded-full bg-primary-50 active:bg-primary-100">
          <Ionicons name="menu" size={20} color="#4f46e5" />
        </Pressable>
        <Text className="text-lg font-work-medium text-neutral-800">Mis Avances</Text>
        <View style={{ width: 32 }} />
      </View>

      <View className="flex-1 px-4">
        {/* Estadísticas principales */}
        <View className="flex-row justify-between mt-4 mb-6">
          <View className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 flex-1 mr-2 border border-primary-200">
            <Text className="text-3xl font-work-black text-primary-600">
              {relapses.length}
            </Text>
            <Text className="text-primary-600 font-work-medium text-sm">
              Total recaídas
            </Text>
          </View>
          <View className="bg-gradient-to-br from-growth-light to-secondary-100 rounded-xl p-4 flex-1 ml-2 border border-secondary-200">
            <Text className="text-3xl font-work-black text-growth-dark">
              {checkpoints.filter((c) => c.status === 'reached').length}
            </Text>
            <Text className="text-growth-dark font-work-medium text-sm">
              Checkpoints logrados
            </Text>
          </View>
        </View>

        {/* Gráfico simple de barras */}
        <View className="bg-white rounded-xl p-5 mb-6 border border-neutral-100 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="bg-insight-light p-2 rounded-lg mr-3">
              <Ionicons name="bar-chart" size={20} color="#8b5cf6" />
            </View>
            <Text className="text-lg font-work-black text-neutral-800">Progreso Semanal</Text>
          </View>
          <View className="flex-row items-end justify-between h-32">
            {weekProgress.map((value, index) => (
              <View key={index} className="flex-1 items-center">
                <View
                  className="bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg mx-1"
                  style={{ height: (value / 8) * 120, minHeight: value > 0 ? 12 : 4 }}
                />
                <Text className="text-xs mt-2 text-neutral-500 font-work-medium">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {relapses.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <View className="bg-growth-light rounded-full p-6 mb-4">
              <Ionicons name="checkmark-circle" size={64} color="#10b981" />
            </View>
            <Text className="text-lg text-neutral-800 text-center font-work-black mb-2">
              ¡Excelente trabajo!
            </Text>
            <Text className="text-neutral-600 text-center font-work-medium">
              No tienes recaídas registradas aún.{'\n'}
              Sigue adelante con tu proceso.
            </Text>
          </View>
        ) : (
          <FlatList
            data={relapses}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#4f46e5']} />
            }
            renderItem={({ item, index }) => (
              <View className="bg-white p-4 rounded-xl mb-3 border border-neutral-200">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Ionicons
                        name={item.planned ? 'calendar' : 'alert-circle'}
                        size={16}
                        color={item.planned ? '#8b5cf6' : '#ef4444'}
                      />
                      <Text className="text-lg font-work-medium text-neutral-800 ml-2">
                        Recaída #{relapses.length - index}
                      </Text>
                    </View>
                    <Text className="text-neutral-600 font-work-medium">
                      {formatRelative(item.occurred_at)}
                    </Text>
                    {item.planned && item.difficulty && (
                      <View className="mt-2">
                        <Text className="text-xs text-accent-dark bg-insight-light px-2 py-1 rounded-lg self-start">
                          Dificultad: {item.difficulty}
                        </Text>
                      </View>
                    )}
                    {item.checkpoint_id && (
                      <Text className="text-xs text-secondary-600 mt-1">
                        Vinculada a checkpoint
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AvancesScreen;