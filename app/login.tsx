import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { useAuthStore } from '../src/store/useAuthStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.replace('/');
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-6">Login to TalentConnect</Text>
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
      <Button title="Login" onPress={handleLogin} disabled={loading} />
      <Link href="/register" className="text-blue-500 text-center mt-4">
        Don't have an account? Register
      </Link>
    </View>
  );
}