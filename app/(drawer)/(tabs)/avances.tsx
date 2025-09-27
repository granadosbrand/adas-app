import useRecordStore from '@/store/useRecords';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';

const AvancesScreen = () => {
  const navigation = useNavigation();
  const records = useRecordStore((s) => s.records);
  const clear = useRecordStore((s) => s.clear);
  const removeRecord = useRecordStore((s) => s.removeRecord);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  // Datos para gráficos básicos
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32;
  const maxRecords = Math.max(records.length, 5);

  // Simular progreso diario de la última semana
  const weekProgress = [3, 5, 2, 4, 6, 3, records.length % 8];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
        <Pressable onPress={openDrawer}>
          <Ionicons name="menu" size={24} color="#6366f1" />
        </Pressable>
        <Text className="text-lg font-work-medium">Mis Avances</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-4">
        {/* Estadísticas principales */}
        <View className="flex-row justify-between mt-4 mb-6">
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex-1 mr-2">
            <Text className="text-2xl font-work-black text-blue-600 dark:text-blue-400">
              {records.length}
            </Text>
            <Text className="text-blue-600 dark:text-blue-400 font-work-medium">
              Total registros
            </Text>
          </View>
          <View className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex-1 ml-2">
            <Text className="text-2xl font-work-black text-green-600 dark:text-green-400">
              {records.length > 0 ? Math.ceil(records.length / 7) : 0}
            </Text>
            <Text className="text-green-600 dark:text-green-400 font-work-medium">
              Semanas activo
            </Text>
          </View>
        </View>

        {/* Gráfico simple de barras */}
        <View className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 mb-6">
          <Text className="text-lg font-work-black mb-4">Progreso Semanal</Text>
          <View className="flex-row items-end justify-between h-32">
            {weekProgress.map((value, index) => (
              <View key={index} className="flex-1 items-center">
                <View
                  className="bg-indigo-500 rounded-t w-8"
                  style={{ height: (value / 8) * 120 }}
                />
                <Text className="text-xs mt-2 text-neutral-600 dark:text-neutral-300">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {records.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-neutral-500 text-center">
              No tienes registros aún.{'\n'}
              Presiona el botón SET en la pantalla principal para comenzar.
            </Text>
          </View>
        ) : (
          <FlatList
            data={records}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg mb-3">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-lg font-work-medium">
                      Registro #{records.length - index}
                    </Text>
                    <Text className="text-neutral-600 dark:text-neutral-300">
                      {item.label}
                    </Text>
                  </View>
                  <View className="ml-4">
                    <Text
                      className="text-red-500 font-medium"
                      onPress={() => removeRecord(item.id)}
                    >
                      Eliminar
                    </Text>
                  </View>
                </View>
              </View>
            )}
            ListFooterComponent={() => (
              records.length > 0 ? (
                <View className="mt-6 mb-4">
                  <Text
                    className="text-red-500 font-medium text-center text-lg"
                    onPress={clear}
                  >
                    Limpiar todos los registros
                  </Text>
                </View>
              ) : null
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AvancesScreen;