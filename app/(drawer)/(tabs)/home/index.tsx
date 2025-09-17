import SetButton from '@/components/set-home/SetButton';
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';

const HomeScreen = () => {

    const [toastMsg, setToastMsg] = useState<string>('');

    // handlers





    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
            <View className="flex-1 items-center justify-center px-6">

                <SetButton 
                
                />
                {/* <Text className="mt-6 text-neutral-600 dark:text-neutral-300">
                    Total registros: <Text className="font-semibold">{timestamps.length}</Text>
                </Text> */}
            </View>




        </SafeAreaView>
    );
};

export default HomeScreen;
