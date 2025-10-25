import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function Home() {
  const { user, profile, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace({ pathname: '/onboarding' });
  };

  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Welcome to TalentConnect</Text>
      {profile && (
        <Text className="text-lg mb-4">Hello, {profile.nombre}!</Text>
      )}
      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-3 mb-4"
        onPress={() => router.push({ pathname: '/edit-profile' })}
      >
        <Text className="text-white text-center">Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-green-500 rounded-lg p-3 mb-4"
        onPress={() => router.push({ pathname: '/explore' })}
      >
        <Text className="text-white text-center">Explore Talents</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-500 rounded-lg p-3"
        onPress={handleLogout}
      >
        <Text className="text-white text-center">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}