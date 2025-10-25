import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Onboarding() {
  const handleGetStarted = () => {
    router.replace('/login');
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-3xl font-bold text-center mb-4">Welcome to TalentConnect</Text>
      <Text className="text-lg text-center mb-8">Connect with talents and opportunities.</Text>
      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-3 items-center"
        onPress={handleGetStarted}
      >
        <Text className="text-white font-semibold">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}