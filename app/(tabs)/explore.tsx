import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/lib/supabase';

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

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      console.error('Error fetching profiles:', error);
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.nombre.toLowerCase().includes(search.toLowerCase()) ||
    profile.habilidades.toLowerCase().includes(search.toLowerCase())
  );

  const renderProfile = ({ item }: { item: Profile }) => (
    <TouchableOpacity
      className="bg-gray-100 p-4 mb-2 rounded-lg"
      onPress={() => router.push({ pathname: '/profile-detail', params: { id: item.id } })}
    >
      <Text className="text-lg font-semibold">{item.nombre}</Text>
      <Text className="text-gray-600">{item.descripcion}</Text>
      <Text className="text-blue-500">Skills: {item.habilidades}</Text>
      <Text className="text-green-500">Rate: ${item.tarifa_por_hora}/hr</Text>
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
      <Text className="text-2xl font-bold mb-4">Explore Talents</Text>
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