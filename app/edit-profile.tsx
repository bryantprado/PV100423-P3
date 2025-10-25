import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { useAuthStore } from '../src/store/useAuthStore';

export default function EditProfile() {
  const { profile, updateProfile } = useAuthStore();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [habilidades, setHabilidades] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [tarifaPorHora, setTarifaPorHora] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre || '');
      setDescripcion(profile.descripcion || '');
      setHabilidades(profile.habilidades || '');
      setExperiencia(profile.experiencia || '');
      setTarifaPorHora(profile.tarifa_por_hora?.toString() || '');
      setFoto(profile.foto || null);
    }
  }, [profile]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access media library');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!nombre || !descripcion || !habilidades || !experiencia || !tarifaPorHora) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    const result = await updateProfile({
      nombre,
      descripcion,
      habilidades,
      experiencia,
      tarifa_por_hora: parseFloat(tarifaPorHora),
    });
    setLoading(false);
    if (result.success) {
      Alert.alert('Success', 'Profile updated');
      router.back();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <ScrollView className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Edit Profile</Text>
      <TouchableOpacity className="mb-4" onPress={pickImage}>
        {foto ? (
          <Image source={{ uri: foto }} className="w-32 h-32 rounded-lg" />
        ) : (
          <View className="w-32 h-32 bg-gray-200 rounded-lg justify-center items-center">
            <Text className="text-gray-500">Select Photo</Text>
          </View>
        )}
      </TouchableOpacity>
      <Input
        label="Name"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Enter your name"
      />
      <Input
        label="Description"
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Enter a description"
        multiline
      />
      <Input
        label="Skills"
        value={habilidades}
        onChangeText={setHabilidades}
        placeholder="Enter your skills"
      />
      <Input
        label="Experience"
        value={experiencia}
        onChangeText={setExperiencia}
        placeholder="Enter your experience"
        multiline
      />
      <Input
        label="Hourly Rate"
        value={tarifaPorHora}
        onChangeText={setTarifaPorHora}
        placeholder="Enter hourly rate"
        keyboardType="numeric"
      />
      <Button title="Save" onPress={handleSave} disabled={loading} />
    </ScrollView>
  );
}