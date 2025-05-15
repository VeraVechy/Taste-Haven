import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data.user });
    return data;
  },
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
  setUser: (user) => set({ user, loading: false }),
}));

export default useAuthStore;