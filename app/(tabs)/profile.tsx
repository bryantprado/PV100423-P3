import TOTPManager from '@/src/components/TOTPManager';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function Profile() {
  const { profile } = useAuthStore();

  const data = profile ? [profile] : [];

  const renderItem = ({ item }: { item: any }) => (
    <View className="p-6">
      <View className="items-center mb-6">
        {item.foto ? (
          <Image source={{ uri: item.foto }} className="w-32 h-32 rounded-full mb-2" />
        ) : (
          <View className="w-32 h-32 bg-gray-200 rounded-full justify-center items-center mb-2">
            <Text className="text-gray-500">No Photo</Text>
          </View>
        )}
      </View>
      <Text className="text-lg mb-2">Name: {item.nombre}</Text>
      <Text className="text-lg mb-2">Description: {item.descripcion}</Text>
      <Text className="text-lg mb-2">Skills: {item.habilidades}</Text>
      <Text className="text-lg mb-2">Experience: {item.experiencia}</Text>
      <Text className="text-lg mb-2">Rate: ${item.tarifa_por_hora}/hr</Text>
      <TOTPManager />
      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-3 mt-4"
        onPress={() => router.push({ pathname: '/edit-profile' })}
      >
        <Text className="text-white text-center">Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const ListEmptyComponent = () => (
    <View className="p-6">
      <Text className="text-lg mb-4">No profile found. Create one to get started!</Text>
      <TouchableOpacity
        className="bg-green-500 rounded-lg p-3"
        onPress={() => router.push({ pathname: '/edit-profile' })}
      >
        <Text className="text-white text-center">Create Profile</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <Text className="text-2xl font-bold mb-4 p-6">My Profile</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}