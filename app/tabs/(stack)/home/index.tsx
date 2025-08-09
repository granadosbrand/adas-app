import CustomButton from '@/components/shared/CustomButton';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const HomeScreen = () => {
  return (


    <View className="flex-1 items-center justify-center px-10">

      <Text className="text-xl font-bold mb-5 text-primary">
        Home
      </Text>

      <CustomButton
        className='mb-5'
        color='primary'
        onPress={() => router.push('/productos')}
      >
        Productos
      </CustomButton>

      <CustomButton
        className='mb-5'
        color='secondary'
        onPress={() => router.push('/profile')}
      >
        Profile
      </CustomButton>
      <CustomButton
        onPress={() => router.push('/settings')}
        className='mb-5'
        color='secondary'
      >
        Settings
      </CustomButton>

      {/* <Link href='/productos' asChild>
        <CustomButton
          className='mb-5'
          color='secondary'
        >
          Productos
        </CustomButton>
      </Link> */}


    </View >


  );
}

export default HomeScreen