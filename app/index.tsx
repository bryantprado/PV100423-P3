import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { useAuthStore } from '../src/store/useAuthStore';

export default function Index() {
  const { user, loading } = useAuthStore();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Prevent infinite navigation loops by tracking if navigation has already occurred.
    // The original issue was that changes in 'user' or 'loading' would repeatedly trigger navigation,
    // causing the "Maximum update depth exceeded" error when logging in successfully.
    if (!loading && !hasNavigated.current) {
      hasNavigated.current = true;
      if (user) {
        router.replace('/');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return null;
}
