import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <View className="mb-4">
      {label && <Text className="text-gray-700 mb-1">{label}</Text>}
      <TextInput
        className="border border-gray-300 rounded-lg p-3 text-base"
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="text-red-500 mt-1">{error}</Text>}
    </View>
  );
};