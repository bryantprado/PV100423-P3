import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function Profile() {
  const { profile } = useAuthStore();

  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold mb-4">My Profile</Text>
      {profile ? (
        <>
          <Text className="text-lg mb-2">Name: {profile.nombre}</Text>
          <Text className="text-lg mb-2">Description: {profile.descripcion}</Text>
          <Text className="text-lg mb-2">Skills: {profile.habilidades}</Text>
          <Text className="text-lg mb-2">Experience: {profile.experiencia}</Text>
          <Text className="text-lg mb-2">Rate: ${profile.tarifa_por_hora}/hr</Text>
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-3 mt-4"
            onPress={() => router.push({ pathname: '/edit-profile' })}
          >
            <Text className="text-white text-center">Edit Profile</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text className="text-lg mb-4">No profile found. Create one to get started!</Text>
          <TouchableOpacity
            className="bg-green-500 rounded-lg p-3"
            onPress={() => router.push({ pathname: '/edit-profile' })}
          >
            <Text className="text-white text-center">Create Profile</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}