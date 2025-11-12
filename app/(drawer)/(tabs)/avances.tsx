import { formatDayHeader } from '@/lib/dateUtils';
import { calculateUserStats } from '@/lib/statsUtils';
import { checkpointsService, relapsesService } from '@/services/api';
import useUserStore from '@/store/useUserStore';
import { Checkpoint, Relapse } from '@/types/api.types';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useFocusEffect, useNavigation } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Tipo para agrupar relapses por día
interface RelapsesByDay {
  date: string; // ISO date string para el día (YYYY-MM-DD)
  dayLabel: string; // "Hoy", "Ayer", "Lunes 18 Oct"
  relapses: Relapse[];
}

const AvancesScreen = () => {
  const navigation = useNavigation();
  const user = useUserStore((s) => s.user);
  const mode = useUserStore((s) => s.mode);

  const [relapses, setRelapses] = useState<Relapse[]>([]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const { t } = useTranslation('advances');

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

  // Progreso de últimos 7 días completos (de hoy hacia atrás)
  const getWeekProgress = () => {
    const today = dayjs();
    const weekData = [0, 0, 0, 0, 0, 0, 0]; // Hoy, Ayer, -2, -3, -4, -5, -6 días
    const weekLabels = ['Hoy', 'Ayer', '2d', '3d', '4d', '5d', '6d'];

    relapses.forEach((relapse) => {
      const relapseDate = dayjs(relapse.occurred_at);

      // Calcular diferencia en días desde hoy
      const daysDiff = today.diff(relapseDate, 'day');

      // Solo contar si está en los últimos 7 días (0-6 días atrás)
      if (daysDiff >= 0 && daysDiff < 7) {
        weekData[daysDiff]++;
      }
    });

    return { data: weekData, labels: weekLabels };
  };

  // Agrupar relapses por día
  const groupRelapsesByDay = (): RelapsesByDay[] => {
    // Filtrar por dificultad si está activo
    const filteredRelapses = filterDifficulty
      ? relapses.filter(r => r.difficulty === filterDifficulty)
      : relapses;

    const grouped = new Map<string, Relapse[]>();

    filteredRelapses.forEach((relapse) => {
      const dateKey = dayjs(relapse.occurred_at).format('YYYY-MM-DD');
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(relapse);
    });

    // Convertir a array y ordenar por fecha (más reciente primero)
    const result: RelapsesByDay[] = Array.from(grouped.entries()).map(([date, relapses]) => ({
      date,
      dayLabel: formatDayHeader(relapses[0].occurred_at),
      relapses: relapses.sort((a, b) =>
        dayjs(b.occurred_at).valueOf() - dayjs(a.occurred_at).valueOf()
      ),
    }));

    return result.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  };

  const weekProgress = getWeekProgress();
  const relapsesByDay = groupRelapsesByDay();
  const stats = calculateUserStats(relapses, checkpoints);

  // Mapeo de dificultades a colores y labels
  const getDifficultyInfo = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return { label: t('easy'), color: '#10b981', bgColor: '#d1fae5', icon: 'happy-outline' };
      case 'normal':
        return { label: t('normal'), color: '#f59e0b', bgColor: '#fef3c7', icon: 'remove-circle-outline' };
      case 'hard':
        return { label: t('hard'), color: '#ef4444', bgColor: '#fee2e2', icon: 'sad-outline' };
      default:
        return null;
    }
  };

  // Mensaje motivacional según progreso
  const getMotivationalMessage = () => {
    if (stats.totalRelapses === 0) {
      return {
        icon: 'rocket-outline',
        color: '#1ca6c0',
        bgColor: '#ede9fe',
        title: t('startJourney'),
        message: t('registerProgress'),
      };
    }

    const streakDays = Math.floor(stats.currentStreakHours / 24);

    if (streakDays >= 7) {
      return {
        icon: 'trophy-outline',
        color: '#f59e0b',
        bgColor: '#fef3c7',
        title: t('progressStreak', { streak: stats.currentStreakFormatted }),
        message: t('excellentPath'),
      };
    }

    if (stats.trend === 'improving') {
      return {
        icon: 'trending-up-outline',
        color: '#10b981',
        bgColor: '#d1fae5',
        title: t('improving'),
        message: t('averageDays', { days: stats.averageDaysApart }),
      };
    }

    if (stats.trend === 'worsening') {
      return {
        icon: 'heart-outline',
        color: '#ef4444',
        bgColor: '#fee2e2',
        title: t('keepGoing'),
        message: t('newOpportunity'),
      };
    }

    return {
      icon: 'checkmark-circle-outline',
      color: '#06b6d4',
      bgColor: '#cffafe',
      title: t('maintainRhythm'),
      message: t('currentStreak', { streak: stats.currentStreakFormatted }),
    };
  };

  const motivationalCard = getMotivationalMessage();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50">
        <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-neutral-100 shadow-sm">
          <Pressable onPress={openDrawer} className="p-2 rounded-full bg-primary-50 active:bg-primary-100">
            <Ionicons name="menu" size={20} color="#1ca6c0" />
          </Pressable>
          <Text className="text-lg font-work-medium text-neutral-800">{t('myAdvances')}</Text>
          <View style={{ width: 32 }} />
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1ca6c0" />
          <Text className="text-neutral-600 font-work-medium mt-4">{t('loadingAdvances')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-neutral-100 shadow-sm">
        <Pressable onPress={openDrawer} className="p-2 rounded-full bg-primary-50 active:bg-primary-100">
          <Ionicons name="menu" size={20} color="#1ca6c0" />
        </Pressable>
        <Text className="text-lg font-work-medium text-neutral-800">{t('myAdvances')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <View className="flex-1 px-4">
        {/* Mensaje motivacional */}
        <View
          className="mt-4 mb-4 rounded-xl p-4 border"
          style={{
            backgroundColor: motivationalCard.bgColor,
            borderColor: motivationalCard.color + '40'
          }}
        >
          <View className="flex-row items-center">
            <Ionicons name={motivationalCard.icon as any} size={32} color={motivationalCard.color} />
            <View className="flex-1 ml-3">
              <Text className="text-lg font-work-black" style={{ color: motivationalCard.color }}>
                {motivationalCard.title}
              </Text>
              <Text className="text-sm font-work-medium mt-1" style={{ color: motivationalCard.color }}>
                {motivationalCard.message}
              </Text>
            </View>
          </View>
        </View>

        {/* Estadísticas principales */}
        <View className="flex-row justify-between mb-4">
          <View className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 flex-1 mr-2 border border-primary-200">
            <Text className="text-3xl font-work-black text-primary-600">
              {stats.currentStreakFormatted}
            </Text>
            <Text className="text-primary-600 font-work-medium text-sm">
              {t('currentStreak')}
            </Text>
          </View>
          <View className="bg-gradient-to-br from-growth-light to-secondary-100 rounded-xl p-4 flex-1 ml-2 border border-secondary-200">
            <Text className="text-3xl font-work-black text-growth-dark">
              {stats.bestStreakFormatted}
            </Text>
            <Text className="text-growth-dark font-work-medium text-sm">
              {t('bestStreak')}
            </Text>
          </View>
        </View>

        {/* Insights de patrones */}
        {relapses.length >= 3 && (
          <View className="mb-4">
            <Text className="text-sm font-work-black text-neutral-700 mb-2 px-1">
              {t('yourPatterns')}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {stats.mostCommonWeekday && (
                <View className="bg-white rounded-xl p-3 border border-neutral-200 flex-1 min-w-[48%]">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                    <Text className="text-xs text-neutral-500 font-work-medium ml-1">
                      {t('mostCommonDay')}
                    </Text>
                  </View>
                  <Text className="text-lg font-work-black text-neutral-800">
                    {stats.mostCommonWeekday.day}
                  </Text>
                  <Text className="text-xs text-neutral-500">
                    {stats.mostCommonWeekday.count} {stats.mostCommonWeekday.count === 1 ? t('time') : t('times')}
                  </Text>
                </View>
              )}
              {stats.mostCommonTimeRange && (
                <View className="bg-white rounded-xl p-3 border border-neutral-200 flex-1 min-w-[48%]">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="time-outline" size={16} color="#6b7280" />
                    <Text className="text-xs text-neutral-500 font-work-medium ml-1">
                      {t('commonTime')}
                    </Text>
                  </View>
                  <Text className="text-sm font-work-black text-neutral-800">
                    {stats.mostCommonTimeRange.range}
                  </Text>
                  <Text className="text-xs text-neutral-500">
                    {stats.mostCommonTimeRange.count} {stats.mostCommonTimeRange.count === 1 ? t('time') : t('times')}
                  </Text>
                </View>
              )}
              {stats.difficultyPattern && (
                <View className="bg-white rounded-xl p-3 border border-neutral-200 flex-1 min-w-[48%]">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="speedometer-outline" size={16} color="#6b7280" />
                    <Text className="text-xs text-neutral-500 font-work-medium ml-1">
                      {t('commonDifficulty')}
                    </Text>
                  </View>
                  <Text className="text-lg font-work-black text-neutral-800">
                    {stats.difficultyPattern.difficulty}
                  </Text>
                  <Text className="text-xs text-neutral-500">
                    {stats.difficultyPattern.percentage}% de las veces
                  </Text>
                </View>
              )}
              {stats.averageDaysApart > 0 && (
                <View className="bg-white rounded-xl p-3 border border-neutral-200 flex-1 min-w-[48%]">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="analytics-outline" size={16} color="#6b7280" />
                    <Text className="text-xs text-neutral-500 font-work-medium ml-1">
                      {t('average')}
                    </Text>
                  </View>
                  <Text className="text-lg font-work-black text-neutral-800">
                    {stats.averageDaysApart} días
                  </Text>
                  <Text className="text-xs text-neutral-500">
                    {t('betweenRelapses')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Filtro de dificultad - solo si hay datos */}
        {mode === 'survivor' && relapses.length > 0 && (
          <View className="mb-4">
            <Text className="text-sm font-work-medium text-neutral-600 mb-2">{t('quickView')}</Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setFilterDifficulty(null)}
                className={`px-3 py-2 rounded-lg border ${filterDifficulty === null
                  ? 'bg-primary border-primary'
                  : 'bg-white border-neutral-300'
                  }`}
              >
                <Text className={`text-xs font-work-medium ${filterDifficulty === null ? 'text-white' : 'text-neutral-600'
                  }`}>
                  {t('all')}
                </Text>
              </Pressable>
              {['easy', 'normal', 'hard'].map((diff) => {
                const info = getDifficultyInfo(diff);
                if (!info) return null;
                const isActive = filterDifficulty === diff;
                return (
                  <Pressable
                    key={diff}
                    onPress={() => setFilterDifficulty(diff)}
                    className={`px-3 py-2 rounded-lg border`}
                    style={{
                      backgroundColor: isActive ? info.color : '#fff',
                      borderColor: isActive ? info.color : '#d4d4d8',
                    }}
                  >
                    <Text
                      className="text-xs font-work-medium"
                      style={{ color: isActive ? '#fff' : info.color }}
                    >
                      {info.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Gráfico simple de barras */}
        <View className="bg-white rounded-xl p-5 mb-4 border border-neutral-100 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="bg-insight-light p-2 rounded-lg mr-3">
              <Ionicons name="bar-chart" size={20} color="#1ca6c0" />
            </View>
            <Text className="text-lg font-work-black text-neutral-800">{t('last7Days')}</Text>
          </View>
          <View className="flex-row items-end justify-between" style={{ height: 140 }}>
            {(() => {
              // Escalado adaptativo: si la diferencia máxima es grande, usamos escala log para comprimir extremos
              const maxValue = Math.max(...weekProgress.data, 1); // evitar división por cero
              const useLog = maxValue > 10; // umbral para cambiar a escala log

              return weekProgress.data.map((value, index) => {
                const normalized = useLog
                  ? Math.log(value + 1) / Math.log(maxValue + 1)
                  : value / maxValue;

                const heightPercent = value > 0 ? normalized * 100 : 0;
                const barHeight = value > 0 ? Math.max(heightPercent, 10) : 6; // porcentaje relativo dentro del contenedor

                return (
                  <View key={index} className="items-center" style={{ flex: 1 }}>
                    <View
                      accessible
                      accessibilityLabel={`${weekProgress.labels[index]}: ${value}`}
                      className="rounded-t-lg"
                      style={{
                        width: 18,
                        marginHorizontal: 6,
                        height: (barHeight / 100) * 120, // dejar margen dentro del contenedor
                        backgroundColor: value > 0 ? '#3b82f6' : '#e5e7eb',
                        alignSelf: 'flex-end',
                        borderRadius: 6,
                      }}
                    />

                    {/* valor encima de la barra cuando hay datos */}
                    {value > 0 && (
                      <Text className="text-xs mt-2 text-blue-600 font-work-black">
                        {value}
                      </Text>
                    )}

                    <Text className="text-xs mt-2 text-neutral-500 font-work-medium">
                      {weekProgress.labels[index]}
                    </Text>
                  </View>
                );
              });
            })()}
          </View>
          {weekProgress.data.every(v => v === 0) && (
            <View className="mt-4 p-3 bg-neutral-50 rounded-lg">
              <Text className="text-sm text-neutral-600 font-work-medium text-center">
                {t('noRelapses7Days')}
              </Text>
            </View>
          )}
        </View>

        {/* Resumen de totales */}
        <View className="flex-row bg-white rounded-xl p-4 border border-neutral-200 mb-4">
          <View className="flex-1 items-center border-r border-neutral-200">
            <Text className="text-2xl font-work-black text-neutral-800">
              {stats.totalRelapses}
            </Text>
            <Text className="text-xs text-neutral-600 font-work-medium">
              {t('totalRelapses')}
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-work-black text-growth-dark">
              {stats.checkpointsReached}
            </Text>
            <Text className="text-xs text-neutral-600 font-work-medium">
              {t('checkpoints')}
            </Text>
          </View>
        </View>

        {/* Botón para ver historial completo */}
        {relapses.length > 0 && (
          <Pressable
            onPress={() => navigation.navigate('historial/index' as never)}
            className="bg-primary-light rounded-xl p-4 border border-primary-200 flex-row items-center justify-between active:bg-primary-200"
          >
            <View className="flex-row items-center">
              <Ionicons name="list-outline" size={24} color="#1ca6c0" />
              <Text className="text-primary font-work-black text-base ml-3">
                {t('viewFullHistory')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#1ca6c0" />
          </Pressable>
        )}

        {relapses.length === 0 && (
          <View className="flex-1 justify-center items-center py-8">
            <View className="bg-growth-light rounded-full p-6 mb-4">
              <Ionicons name="checkmark-circle" size={64} color="#10b981" />
            </View>
            <Text className="text-lg text-neutral-800 text-center font-work-black mb-2">
              {t('excellentWork')}
            </Text>
            <Text className="text-neutral-600 text-center font-work-medium">
              {t('noRelapsesYet')}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AvancesScreen;