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
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,

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
    const { user } = get();
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') {
        // Profile not found, create one
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            nombre: '',
            descripcion: '',
            habilidades: '',
            experiencia: '',
            tarifa_por_hora: 0,
            foto: null,
          });
        if (insertError) {
          console.error('Error creating profile:', insertError);
          return;
        }
        // Fetch again
        const { data: newData, error: newError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (newError) {
          console.error('Error fetching new profile:', newError);
          return;
        }
        set({ profile: newData });
      } else {
        console.error('Error fetching profile:', error);
      }
    } else {
      set({ profile: data });
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return { success: false, error: 'No user logged in' };
    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: user.id, ...updates });
    if (error) return { success: false, error: error.message };
    await get().fetchProfile();
    return { success: true };
  },
}));