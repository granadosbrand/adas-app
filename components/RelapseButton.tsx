import React, { useState } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';
import useAuthStore from '../store/useAuthStore';
import CustomButton from './shared/CustomButton';

/**
 * Componente para registrar recaídas con diferentes niveles de dificultad
 * Uso: <RelapseButton />
 */
const RelapseButton = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const { registerRelapse } = useAuthStore();

    const handleRegisterRelapse = async (difficulty: number) => {
        try {
            await registerRelapse(difficulty);
            setModalVisible(false);
        } catch {
            Alert.alert('Error', 'No se pudo registrar la recaída');
        }
    };

    const difficultyLevels = [
        { level: 1, label: 'Leve', description: 'Un pequeño tropiezo', color: 'bg-yellow-500' },
        { level: 2, label: 'Moderada', description: 'Recaída significativa', color: 'bg-orange-500' },
        { level: 3, label: 'Severa', description: 'Recaída importante', color: 'bg-red-500' },
    ];

    return (
        <View>
            <CustomButton
                onPress={() => setModalVisible(true)}
                color="tertiary"
                variant="outlined"
            >
                Registrar Recaída
            </CustomButton>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 pb-8">
                        <Text className="text-2xl font-work-black text-neutral-800 mb-2">
                            Registrar Recaída
                        </Text>
                        <Text className="text-base font-work-light text-neutral-600 mb-6">
                            Selecciona el nivel de dificultad
                        </Text>

                        {difficultyLevels.map((item) => (
                            <Pressable
                                key={item.level}
                                onPress={() => handleRegisterRelapse(item.level)}
                                className="bg-neutral-50 rounded-xl p-4 mb-3 border border-neutral-200 active:bg-neutral-100"
                            >
                                <View className="flex-row items-center">
                                    <View className={`w-4 h-4 rounded-full ${item.color} mr-3`} />
                                    <View className="flex-1">
                                        <Text className="text-lg font-work-black text-neutral-800">
                                            {item.label}
                                        </Text>
                                        <Text className="text-sm font-work-light text-neutral-600">
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}

                        <CustomButton
                            onPress={() => setModalVisible(false)}
                            variant="text-only"
                            color="secondary"
                            className="mt-4"
                        >
                            Cancelar
                        </CustomButton>

                        <View className="mt-4 bg-growth-light rounded-xl p-4 border-l-4 border-secondary">
                            <Text className="text-sm text-growth-dark text-center font-work-medium">
                                💪 Cada día es una nueva oportunidad.{'\n'}
                                Reconocer una recaída es el primer paso para superarla.
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default RelapseButton;
