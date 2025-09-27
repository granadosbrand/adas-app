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
              {records.length}
            </Text>
            <Text className="text-primary-600 font-work-medium text-sm">
              Total registros
            </Text>
          </View>
          <View className="bg-gradient-to-br from-growth-light to-secondary-100 rounded-xl p-4 flex-1 ml-2 border border-secondary-200">
            <Text className="text-3xl font-work-black text-growth-dark">
              {records.length > 0 ? Math.ceil(records.length / 7) : 0}
            </Text>
            <Text className="text-growth-dark font-work-medium text-sm">
              Semanas activo
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