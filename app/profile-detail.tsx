import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { Button } from '../src/components/Button';
import { supabase } from '../src/lib/supabase';

interface Profile {
  id: string;
  nombre: string;
  descripcion: string;
  habilidades: string;
  experiencia: string;
  tarifa_por_hora: number;
  foto: string | null;
}

export default function ProfileDetail() {
  const { id } = useLocalSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Profile not found');
    } else if (!data || !data.nombre || data.nombre.trim() === '') {
      Alert.alert('Error', 'This profile appears to be incomplete');
      setProfile(null);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleContact = () => {
    Alert.alert('Contact', 'Message sent! (Simulated)');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Profile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-6 bg-white">
      <View className="items-center mb-6">
        {profile.foto ? (
          <Image source={{ uri: profile.foto }} className="w-32 h-32 rounded-full mb-2" />
        ) : (
          <View className="w-32 h-32 bg-gray-200 rounded-full justify-center items-center mb-2">
            <Text className="text-gray-500">No Photo</Text>
          </View>
        )}
      </View>
      <Text className="text-2xl font-bold mb-4">{profile.nombre}</Text>
      <Text className="text-lg mb-2">Description: {profile.descripcion}</Text>
      <Text className="text-lg mb-2">Skills: {profile.habilidades}</Text>
      <Text className="text-lg mb-2">Experience: {profile.experiencia}</Text>
      <Text className="text-lg mb-4">Rate: ${profile.tarifa_por_hora}/hr</Text>
      <Button title="Contact" onPress={handleContact} />
    </ScrollView>
  );
}