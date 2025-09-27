import { ayudaArticles } from '@/store/products.store';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

const index = () => {
  return (


    <View className="flex flex-1 px-4">

      <View className="bg-gradient-to-r from-primary-50 to-insight-light rounded-xl p-4 mb-4">
        <Text className="text-2xl font-work-black text-neutral-800">
          Artículos de Ayuda
        </Text>
        <Text className="text-neutral-600 font-work-medium">
          Guías para acompañarte en tu proceso de crecimiento
        </Text>
      </View>

      <FlatList
        data={ayudaArticles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className='bg-white rounded-xl p-4 mb-4 border border-neutral-200 shadow-sm'>
            <Text className='text-xl font-work-black text-neutral-800 mb-2'>{item.title}</Text>
            <Text className='text-base text-neutral-600 leading-6 mb-3'>{item.summary}</Text>

            <View className='flex flex-row justify-between items-center'>
              <View className='bg-accent-light px-3 py-1 rounded-full'>
                <Text className='font-work-medium text-sm text-accent-dark'>
                  {item.category}
                </Text>
              </View>
              <Link 
                className='bg-primary text-white px-4 py-2 rounded-lg font-work-medium' 
                href={`/ayuda/${item.id}`}
              >
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