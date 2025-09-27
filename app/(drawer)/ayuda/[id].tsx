import { ayudaArticles } from '@/store/products.store'
import { Redirect, useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'

const AyudaScreen = () => {

    const params = useLocalSearchParams<{ id?: string }>()
    const blog = ayudaArticles.find((item: any) => item.id === params.id)
    const navigation = useNavigation()

    useEffect(() => {

        navigation.setOptions({
            title: blog?.title ?? 'Producto'
        })

    }, [blog])


    if (!blog) return <Redirect href='/ayuda' />

    return (
        <View className='flex flex-1 bg-neutral-50'>
            {/* Header del artículo */}
            <View className='bg-white px-4 py-6 border-b border-neutral-200'>
                <View className='bg-accent-light px-3 py-1 rounded-full self-start mb-3'>
                    <Text className='font-work-medium text-sm text-accent-dark'>{blog.category}</Text>
                </View>
                <Text className='font-work-black text-2xl text-neutral-800 leading-8'>{blog.title}</Text>
            </View>

            {/* Contenido del artículo */}
            <View className='flex-1 px-4 py-6'>
                <View className='bg-white rounded-xl p-5 border border-neutral-200 shadow-sm'>
                    <Text className='text-base text-neutral-700 leading-7 font-work-medium'>{blog.content}</Text>
                </View>

                {/* Mensaje de apoyo */}
                <View className='bg-growth-light rounded-xl p-4 mt-6 border-l-4 border-secondary'>
                    <Text className='text-growth-dark font-work-medium text-center'>
                        🌱 Recuerda: cada paso cuenta en tu proceso de crecimiento personal
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default AyudaScreen