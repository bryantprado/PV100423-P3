import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', ...props }) => {
  const baseClasses = "rounded-lg p-3 items-center";
  const variantClasses = variant === 'primary' ? "bg-blue-500" : "bg-gray-500";

  return (
    <TouchableOpacity className={`${baseClasses} ${variantClasses}`} {...props}>
      <Text className="text-white font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};