import TOTPVerification from '@/src/components/TOTPVerification';
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
  const [showTOTP, setShowTOTP] = useState(false);
  const [totpProfile, setTotpProfile] = useState<{ id: string; otp_secret: string } | null>(null);
  const { login, profile, checkTOTPRequired } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);

    // First, check if TOTP is required for this email
    const totpCheck = await checkTOTPRequired(email);
    if (totpCheck.required && totpCheck.profile) {
      setTotpProfile(totpCheck.profile);
      setShowTOTP(true);
      setLoading(false);
      return;
    }

    // If no TOTP required, proceed with normal login
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  const handleTOTPVerified = async () => {
    setShowTOTP(false);
    setLoading(true);
    // Now proceed with the actual login after TOTP verification
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  const handleTOTPCancel = () => {
    setShowTOTP(false);
    setTotpProfile(null);
  };

  if (showTOTP) {
    return (
      <TOTPVerification
        secret={totpProfile?.otp_secret || ''}
        onSuccess={handleTOTPVerified}
        onCancel={handleTOTPCancel}
      />
    );
  }

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
        Do not have an account? Register
      </Link>
    </View>
  );
}