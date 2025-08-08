import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';

interface Props extends PressableProps {
    children: string;
    color?: 'primary' | 'secondary' | 'tertiary';
    variant?: 'contained' | 'outlined' | 'text-only'
    className?: string;
}

const CustomButton = ({ children, color = 'primary', variant = 'contained', className, ...props }: Props) => {

    const btnColor = {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        tertiary: 'bg-tertiary',
    }[color]

    const textColor = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        tertiary: 'text-tertiary',
    }[color]

    if (variant === 'text-only') {
        return (
            <Pressable
                {...props}
                className={`p-3 ${className}`}>
                <Text className={`text-center ${textColor} font-work-medium`}>
                    {children}
                </Text>
            </Pressable >
        )
    }

    return (


        <Pressable
            {...props}
            className={`p-3 rounded-md ${btnColor} active:opacity-90 ${className}`}>
            <Text className='text-white text-center font-work-medium'>
                {children}
            </Text>
        </Pressable>


    );
}

export default CustomButton