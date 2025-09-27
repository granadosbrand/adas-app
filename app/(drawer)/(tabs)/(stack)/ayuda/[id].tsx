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
        <View className='flex flex-1 px-4'>
            <Text className='font-work-black text-2xl'>{blog.title}</Text>
            <Text className='mt-4 text-base'>{blog.content}</Text>
            <Text className='font-work-black mt-6 text-sm'>{blog.category}</Text>
        </View>
    )
}

export default AyudaScreen