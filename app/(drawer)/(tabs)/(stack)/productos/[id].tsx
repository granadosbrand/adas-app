import { products } from '@/store/products.store'
import { Redirect, useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'

const ProductScreen = () => {

    const params = useLocalSearchParams()
    const producto = products.find(item => item.id === params.id)
    const navigation = useNavigation()

    useEffect(() => {

        navigation.setOptions({
            title: producto?.title ?? 'Producto'
        })

    }, [producto])


    if (!producto) return <Redirect href='/productos' />

    return (
        <View className='flex flex-1 px-4'>
            <Text className='font-work-black text-2xl'>{producto.title}</Text>
            <Text className=''>{producto.description}</Text>
            <Text className='font-work-black'>{producto.price}</Text>
        </View>
    )
}

export default ProductScreen