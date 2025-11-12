import { formatDayHeader, formatTimeOnly, parseToDate } from '@/lib/dateUtils';
import { relapsesService } from '@/services/api';
import useUserStore from '@/store/useUserStore';
import { Relapse, RelapseDifficulty } from '@/types/api.types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Tipos para el filtro
type DifficultyFilter = 'all' | 'easy' | 'normal' | 'hard';

interface DifficultyInfo {
    label: string;
    color: string;
    bgColor: string;
    icon: string;
}

export default function HistorialScreen() {
    const { t } = useTranslation('historial');
    const user = useUserStore((s) => s.user);
    const [relapses, setRelapses] = useState<Relapse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

    // Cargar datos al enfocar la pantalla
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        if (!user?.id) return;

        try {
            setIsLoading(true);
            const response = await relapsesService.listRelapses(user.id);
            setRelapses(response.data || []);
        } catch (error) {
            console.error('Error loading relapses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };
    // Filtrar recaídas por dificultad
    const filteredRelapses = useMemo(() => {
        if (difficultyFilter === 'all') return relapses;
        return relapses.filter((r: Relapse) => r.difficulty === difficultyFilter);
    }, [relapses, difficultyFilter]);

    // Agrupar recaídas por día
    const relapsesByDay = useMemo(() => {
        const groups: { date: string; dayLabel: string; relapses: typeof relapses }[] = [];

        filteredRelapses.forEach((relapse: Relapse) => {
            const dateObj = parseToDate(relapse.occurred_at);
            if (!dateObj) return;
            const dateKey = dateObj.format('YYYY-MM-DD');
            const dayLabel = formatDayHeader(relapse.occurred_at);

            const existingGroup = groups.find((g) => g.date === dateKey);
            if (existingGroup) {
                existingGroup.relapses.push(relapse);
            } else {
                groups.push({
                    date: dateKey,
                    dayLabel,
                    relapses: [relapse],
                });
            }
        });

        return groups;
    }, [filteredRelapses]);

    const getDifficultyInfo = (difficulty: RelapseDifficulty | undefined): DifficultyInfo | null => {
        const difficultyMap: Record<string, DifficultyInfo> = {
            easy: { label: t('difficulty.low'), color: '#10b981', bgColor: '#d1fae5', icon: 'speedometer' },
            normal: {
                label: t('difficulty.normal'),
                color: '#f59e0b',
                bgColor: '#fef3c7',
                icon: 'speedometer',
            },
            hard: {
                label: t('difficulty.high'),
                color: '#ef4444',
                bgColor: '#fee2e2',
                icon: 'flame',
            },
        };

        return difficulty ? difficultyMap[difficulty] || null : null;
    };

    // Opciones de filtro
    const filterOptions: { value: DifficultyFilter; label: string; icon: string }[] = [
        { value: 'all', label: t('filters.all'), icon: 'list' },
        { value: 'easy', label: t('filters.easy'), icon: 'speedometer' },
        { value: 'normal', label: t('filters.normal'), icon: 'speedometer' },
        { value: 'hard', label: t('filters.hard'), icon: 'flame' },
    ];

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-neutral-50 justify-center items-center">
                <ActivityIndicator size="large" color="#1ca6c0" />
                <Text className="text-neutral-600 mt-4 font-work-medium">{t('loading')}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-neutral-50" edges={['bottom']}>
            {/* Header con filtros */}
            <View className="bg-white px-5 pt-4 pb-3 border-b border-neutral-200">
                <Text className="text-2xl font-work-black text-neutral-800 mb-4">
                    {t('title')}
                </Text>

                {/* Filtro por dificultad */}
                <View className="flex-row flex-wrap gap-2">
                    {filterOptions.map((option) => {
                        const isActive = difficultyFilter === option.value;
                        return (
                            <Pressable
                                key={option.value}
                                onPress={() => setDifficultyFilter(option.value)}
                                className={`flex-row items-center px-3 py-2 rounded-lg border ${isActive
                                    ? 'bg-primary-light border-primary'
                                    : 'bg-white border-neutral-300'
                                    }`}
                            >
                                <Ionicons
                                    name={option.icon as any}
                                    size={16}
                                    color={isActive ? '#1ca6c0' : '#6b7280'}
                                />
                                <Text
                                    className={`ml-1 text-sm font-work-medium ${isActive ? 'text-primary' : 'text-neutral-600'
                                        }`}
                                >
                                    {option.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Contador de resultados */}
                <View className="mt-3 flex-row items-center">
                    <Ionicons name="information-circle" size={16} color="#6b7280" />
                    <Text className="text-xs text-neutral-600 font-work-medium ml-1">
                        {filteredRelapses.length} {filteredRelapses.length === 1 ? t('relapse.singular') : t('relapse.plural')}
                        {difficultyFilter !== 'all' && ` ${t('relapse.filtered')}`}
                    </Text>
                </View>
            </View>

            {/* Lista de recaídas */}
            {relapsesByDay.length === 0 ? (
                <View className="flex-1 justify-center items-center px-6">
                    <View className="bg-neutral-200 rounded-full p-6 mb-4">
                        <Ionicons name="search" size={64} color="#6b7280" />
                    </View>
                    <Text className="text-lg text-neutral-800 text-center font-work-black mb-2">
                        {difficultyFilter === 'all'
                            ? t('empty.noRelapses')
                            : t('empty.noRelapsesFiltered')}
                    </Text>
                    <Text className="text-neutral-600 text-center font-work-medium">
                        {difficultyFilter === 'all'
                            ? t('empty.keepGoing')
                            : t('empty.tryAnotherFilter')}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={relapsesByDay}
                    keyExtractor={(item) => item.date}
                    contentContainerClassName="px-5 py-4"
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={['#1ca6c0']}
                        />
                    }
                    renderItem={({ item: dayGroup }) => (
                        <View className="mb-6">
                            {/* Header del día */}
                            <View className="flex-row items-center mb-3">
                                <View className="bg-primary-100 px-3 py-1 rounded-full">
                                    <Text className="text-primary-700 font-work-black text-sm">
                                        {dayGroup.dayLabel}
                                    </Text>
                                </View>
                                <View className="flex-1 h-px bg-neutral-200 ml-3" />
                                <Text className="text-neutral-500 text-xs font-work-medium ml-3">
                                    {dayGroup.relapses.length}{' '}
                                    {dayGroup.relapses.length === 1 ? t('relapse.singular') : t('relapse.plural')}
                                </Text>
                            </View>

                            {/* Lista de recaídas del día */}
                            {dayGroup.relapses.map((relapse: Relapse) => {
                                const difficultyInfo = getDifficultyInfo(relapse.difficulty);

                                return (
                                    <View
                                        key={relapse.id}
                                        className="bg-white p-4 rounded-xl mb-3 border border-neutral-200 shadow-sm"
                                    >
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-1">
                                                {/* Hora */}
                                                <View className="flex-row items-center mb-2">
                                                    <Ionicons name="time-outline" size={16} color="#6b7280" />
                                                    <Text className="text-lg font-work-black text-neutral-800 ml-2">
                                                        {formatTimeOnly(relapse.occurred_at)}
                                                    </Text>
                                                </View>

                                                {/* Dificultad (si existe) */}
                                                {difficultyInfo && (
                                                    <View className="flex-row items-center mb-2">
                                                        <Ionicons
                                                            name={difficultyInfo.icon as any}
                                                            size={16}
                                                            color={difficultyInfo.color}
                                                        />
                                                        <View
                                                            className="px-2 py-1 rounded-lg ml-2"
                                                            style={{ backgroundColor: difficultyInfo.bgColor }}
                                                        >
                                                            <Text
                                                                className="text-xs font-work-medium"
                                                                style={{ color: difficultyInfo.color }}
                                                            >
                                                                {difficultyInfo.label}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                )}

                                                {/* Tipo de recaída */}
                                                <View className="flex-row items-center">
                                                    <Ionicons
                                                        name={relapse.planned ? 'calendar' : 'alert-circle-outline'}
                                                        size={14}
                                                        color={relapse.planned ? '#1ca6c0' : '#6b7280'}
                                                    />
                                                    <Text className="text-xs text-neutral-600 font-work-medium ml-1">
                                                        {relapse.planned ? t('relapseType.planned') : t('relapseType.unplanned')}
                                                    </Text>
                                                </View>

                                                {/* Checkpoint vinculado */}
                                                {relapse.checkpoint_id && (
                                                    <View className="flex-row items-center mt-2">
                                                        <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                                                        <Text className="text-xs text-secondary-600 font-work-medium ml-1">
                                                            {t('checkpoint.linked')}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}
