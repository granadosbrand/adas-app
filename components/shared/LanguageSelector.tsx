import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, Text } from 'react-native';

const LanguageSelector = () => {
    const { t, i18n } = useTranslation('common');
    const [modalVisible, setModalVisible] = useState(false);

    const currentLanguage = i18n.language === 'es' ? 'ES' : 'EN';

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setModalVisible(false);
    };

    return (
        <>
            <Pressable
                onPress={() => setModalVisible(true)}
                className="flex-row items-center bg-white rounded-lg px-3 py-2 border border-neutral-200 shadow-sm"
            >
                <Ionicons name="language" size={20} color="#6b7280" />
                <Text className="ml-2 font-work-medium text-neutral-700">
                    {currentLanguage}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </Pressable>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    className="flex-1 bg-black/50 justify-center items-center"
                    onPress={() => setModalVisible(false)}
                >
                    <Pressable className="bg-white rounded-2xl p-6 mx-6 w-full max-w-sm">
                        <Text className="text-lg font-work-black text-neutral-800 mb-4 text-center">
                            {t('selectLanguage')}
                        </Text>

                        <Pressable
                            onPress={() => changeLanguage('en')}
                            className={`flex-row items-center p-4 rounded-xl mb-2 ${i18n.language === 'en' ? 'bg-primary' : 'bg-neutral-50'
                                }`}
                        >
                            <Text className={`font-work-medium text-base ${i18n.language === 'en' ? 'text-white' : 'text-neutral-800'
                                }`}>
                                🇺🇸 {t('english')}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => changeLanguage('es')}
                            className={`flex-row items-center p-4 rounded-xl mb-4 ${i18n.language === 'es' ? 'bg-primary' : 'bg-neutral-50'
                                }`}
                        >
                            <Text className={`font-work-medium text-base ${i18n.language === 'es' ? 'text-white' : 'text-neutral-800'
                                }`}>
                                🇪🇸 {t('spanish')}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setModalVisible(false)}
                            className="bg-neutral-200 rounded-xl py-3 items-center"
                        >
                            <Text className="font-work-medium text-neutral-700">
                                {t('cancel')}
                            </Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

export default LanguageSelector;