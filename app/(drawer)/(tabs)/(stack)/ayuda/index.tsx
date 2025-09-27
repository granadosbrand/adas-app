import { ayudaArticles } from '@/store/products.store';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

const index = () => {
  return (


    <View className="flex flex-1 px-4">

      <Text className="text-xl font-bold text-white">
        Ayuda
      </Text>

      <FlatList
        data={ayudaArticles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className='mt-10'>

            <Text className='text-2xl font-work-black' >{item.title}</Text>
            <Text className='text-base mt-2'>{item.summary}</Text>

            <View className='flex flex-row justify-between mt-2'>
              <Text className='font-work-black text-sm'>
                {item.category}
              </Text>
              <Link className='text-primary' href={`/ayuda/${item.id}`}>
                Leer artículo
              </Link>
            </View>

          </View>
        )}
      />


    </View>


  );
}

export default index