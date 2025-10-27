import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  user_id: string;
  nombre: string;
  descripcion: string;
  habilidades: string;
  experiencia: string;
  tarifa_por_hora: number;
  foto: string | null;
  created_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  cleanupDuplicateProfiles: () => Promise<void>;
  cleanupEmptyProfiles: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  // Internal state
  _fetchingProfile?: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  _fetchingProfile: false,

  setLoading: (loading) => set({ loading }),

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    const { data: { session } } = await supabase.auth.getSession();
    set({ user: session?.user || null, session });
    return { success: true };
  },

  register: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };
    const { data: { session } } = await supabase.auth.getSession();
    set({ user: session?.user || null, session });
    return { success: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },

  fetchProfile: async () => {
    const { user, _fetchingProfile } = get();
    if (!user || _fetchingProfile) return;

    set({ _fetchingProfile: true });

    // First, try to get all profiles for the user
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching profiles:', error);
      set({ _fetchingProfile: false });
      return;
    }

    if (!profiles || profiles.length === 0) {
      // No profile found, create one using upsert to prevent duplicates
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          nombre: '',
          descripcion: '',
          habilidades: '',
          experiencia: '',
          tarifa_por_hora: 0,
          foto: null,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating profile:', insertError);
        set({ _fetchingProfile: false });
        return;
      }

      set({ profile: newProfile });
    } else {
      // One or more profiles found, use the first one and clean up extras
      const mainProfile = profiles[0];
      set({ profile: mainProfile });

      // Clean up any additional profiles to prevent duplicates
      if (profiles.length > 1) {
        const profilesToDelete = profiles.slice(1).map(p => p.id);
        await supabase
          .from('profiles')
          .delete()
          .in('id', profilesToDelete);
        console.log(`Cleaned up ${profilesToDelete.length} duplicate profiles for user ${user.id}`);
      }
    }

    set({ _fetchingProfile: false });
  },

  cleanupDuplicateProfiles: async () => {
    const { user } = get();
    if (!user) return;

    // Get all profiles for the user
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id);

    if (error || !profiles || profiles.length <= 1) return;

    // Keep the first profile and delete the rest
    const profilesToDelete = profiles.slice(1).map(p => p.id);
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .in('id', profilesToDelete);

    if (deleteError) {
      console.error('Error cleaning up duplicate profiles:', deleteError);
    } else {
      console.log(`Cleaned up ${profilesToDelete.length} duplicate profiles for user ${user.id}`);
      // Update the current profile to the first one
      set({ profile: profiles[0] });
    }
  },

  cleanupEmptyProfiles: async () => {
    // Get all profiles that are empty or incomplete
    const { data: emptyProfiles, error } = await supabase
      .from('profiles')
      .select('*')
      .or('nombre.is.null,nombre.eq.,descripcion.is.null,descripcion.eq.,habilidades.is.null,habilidades.eq.');

    if (error) {
      console.error('Error fetching empty profiles:', error);
      return;
    }

    if (!emptyProfiles || emptyProfiles.length === 0) {
      console.log('No empty profiles found');
      return;
    }

    // Delete empty profiles
    const profilesToDelete = emptyProfiles.map(p => p.id);
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .in('id', profilesToDelete);

    if (deleteError) {
      console.error('Error cleaning up empty profiles:', deleteError);
    } else {
      console.log(`Cleaned up ${profilesToDelete.length} empty profiles`);
    }
  },

  updateProfile: async (updates) => {
    const { user, profile } = get();
    if (!user) return { success: false, error: 'No user logged in' };

    let result;

    if (profile && profile.id) {
      // Profile exists, update it using the ID
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      result = data;
    } else {
      // Profile doesn't exist, create it using upsert with user_id
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ user_id: user.id, ...updates })
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      result = data;
    }

    // Update the local state with the new profile data
    set({ profile: result });

    return { success: true };
  },
}));