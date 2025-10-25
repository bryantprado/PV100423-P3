import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { useAuthStore } from '../src/store/useAuthStore';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await register(email, password);
    setLoading(false);
    if (result.success) {
      router.replace('/');
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-6">Register for TalentConnect</Text>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <Input
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm your password"
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} disabled={loading} />
      <Link href="/login" className="text-blue-500 text-center mt-4">
        Already have an account? Login
      </Link>
    </View>
  );
}