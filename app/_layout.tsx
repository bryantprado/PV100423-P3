import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../globals.css";
import { supabase } from "../src/lib/supabase";
import { useAuthStore } from "../src/store/useAuthStore";

export default function RootLayout() {
  const { user, loading, setLoading } = useAuthStore();

  useEffect(() => {
    // Listen for auth changes. This subscription updates the store when auth state changes,
    // but we ensure it doesn't cause unnecessary re-renders by only updating if the state has changed.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = useAuthStore.getState().user;
      const currentLoading = useAuthStore.getState().loading;

      if (session?.user?.id !== currentUser?.id) {
        useAuthStore.setState({ user: session?.user || null, session });
        if (session?.user && session.user.id && session.user.id.trim() !== '') {
          useAuthStore.getState().fetchProfile();
        } else {
          useAuthStore.setState({ profile: null });
        }
      }

      if (currentLoading) {
        useAuthStore.setState({ loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    // SafeAreaProvider ensures that the app respects the device's safe area (e.g., notches, home indicators).
    // The original error related to react-native-safe-area-context was likely due to missing SafeAreaProvider,
    // which can cause layout issues and potentially contribute to render loops if components try to adjust for safe areas without proper context.
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}