import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/store/useAuthStore';

interface Profile {
  id: string;
  nombre: string;
  descripcion: string;
  habilidades: string;
  experiencia: string;
  tarifa_por_hora: number;
  foto: string | null;
}

export default function Explore() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [cleaningUp, setCleaningUp] = useState(false);
  const { user } = useAuthStore();

  const fetchProfiles = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('user_id', user?.id || '') // Exclude current user's profile
      .not('nombre', 'is', null) // Exclude profiles with null names
      .neq('nombre', ''); // Exclude profiles with empty names

    if (error) {
      console.error('Error fetching profiles:', error);
    } else {
      // Filter out profiles with empty essential data
      const validProfiles = (data || []).filter(profile =>
        profile.nombre &&
        profile.nombre.trim() !== '' &&
        profile.descripcion &&
        profile.descripcion.trim() !== '' &&
        profile.habilidades &&
        profile.habilidades.trim() !== ''
      );
      setProfiles(validProfiles);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleCleanupEmptyProfiles = useCallback(async () => {
    setCleaningUp(true);
    try {
      await useAuthStore.getState().cleanupEmptyProfiles();
      await fetchProfiles(); // Refresh the list after cleanup
      Alert.alert('Success', 'Empty profiles have been cleaned up');
    } catch (error) {
      Alert.alert('Error', 'Failed to clean up empty profiles');
    } finally {
      setCleaningUp(false);
    }
  }, [fetchProfiles]);

  const filteredProfiles = profiles.filter(profile => {
    const searchTerm = search.toLowerCase();
    return (
      profile.nombre?.toLowerCase().includes(searchTerm) ||
      profile.habilidades?.toLowerCase().includes(searchTerm) ||
      profile.descripcion?.toLowerCase().includes(searchTerm) ||
      profile.experiencia?.toLowerCase().includes(searchTerm)
    );
  });

  const renderProfile = ({ item }: { item: Profile }) => (
    <TouchableOpacity
      className="bg-gray-100 p-4 mb-2 rounded-lg"
      onPress={() => router.push({ pathname: '/profile-detail', params: { id: item.id } })}
    >
      <Text className="text-lg font-semibold">{item.nombre || 'Unnamed'}</Text>
      <Text className="text-gray-600">{item.descripcion || 'No description available'}</Text>
      <Text className="text-blue-500">Skills: {item.habilidades || 'No skills listed'}</Text>
      <Text className="text-green-500">Rate: ${item.tarifa_por_hora || 0}/hr</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-6 bg-white">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">Explore Talents</Text>
        <TouchableOpacity
          className="bg-red-500 rounded-lg px-3 py-2"
          onPress={handleCleanupEmptyProfiles}
          disabled={cleaningUp}
        >
          <Text className="text-white text-sm">
            {cleaningUp ? 'Cleaning...' : 'Clean Empty'}
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Search by name or skills"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredProfiles}
        keyExtractor={(item) => item.id}
        renderItem={renderProfile}
        ListEmptyComponent={<Text>No profiles found</Text>}
      />
    </View>
  );
}