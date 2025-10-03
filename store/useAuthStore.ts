import { Session, User } from '@supabase/supabase-js';
import * as Burnt from 'burnt';
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
    session: Session | null;
    user: User | null;
    loading: boolean;
    setSession: (session: Session | null) => void;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    initialize: () => Promise<void>;
    registerRelapse: (difficulty: number) => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
    session: null,
    user: null,
    loading: true,

    setSession: (session: Session | null) => {
        set({
            session,
            user: session?.user ?? null,
        });
    },

    initialize: async () => {
        try {
            // Obtener sesión actual
            const { data: { session } } = await supabase.auth.getSession();
            get().setSession(session);

            // Escuchar cambios en la autenticación
            supabase.auth.onAuthStateChange((_event, session) => {
                get().setSession(session);
            });
        } catch (error) {
            console.error('Error initializing auth:', error);
        } finally {
            set({ loading: false });
        }
    },

    signIn: async (email: string, password: string) => {
        set({ loading: true });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            get().setSession(data.session);

            Burnt.toast({
                title: '¡Bienvenido de vuelta!',
                preset: 'done',
                duration: 2,
                haptic: 'success',
                from: 'top',
            });
        } catch (error: any) {
            Burnt.toast({
                title: 'Error al iniciar sesión',
                message: error.message || 'Por favor verifica tus credenciales',
                preset: 'error',
                duration: 3,
                haptic: 'error',
                from: 'top',
            });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    signUp: async (email: string, password: string) => {
        set({ loading: true });
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            if (!data.session) {
                Burnt.toast({
                    title: '¡Registro exitoso!',
                    message: 'Por favor verifica tu correo electrónico',
                    preset: 'done',
                    duration: 4,
                    from: 'top',
                });
            } else {
                get().setSession(data.session);
                Burnt.toast({
                    title: '¡Cuenta creada!',
                    preset: 'done',
                    duration: 2,
                    haptic: 'success',
                    from: 'top',
                });
            }
        } catch (error: any) {
            Burnt.toast({
                title: 'Error al registrarse',
                message: error.message || 'Inténtalo de nuevo',
                preset: 'error',
                duration: 3,
                haptic: 'error',
                from: 'top',
            });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            get().setSession(null);

            Burnt.toast({
                title: 'Sesión cerrada',
                preset: 'done',
                duration: 2,
                from: 'top',
            });
        } catch (error: any) {
            Burnt.toast({
                title: 'Error al cerrar sesión',
                message: error.message,
                preset: 'error',
                duration: 3,
                from: 'top',
            });
            throw error;
        }
    },

    registerRelapse: async (difficulty: number) => {
        try {
            const user = get().user;
            if (!user) {
                throw new Error('No hay usuario autenticado');
            }

            const { error } = await supabase.from('relapses').insert({
                user_id: user.id,
                happened_at: new Date().toISOString(),
                difficulty,
            });

            if (error) throw error;

            Burnt.toast({
                title: 'Recaída registrada',
                message: 'Recuerda que cada día es una nueva oportunidad',
                preset: 'done',
                duration: 3,
                from: 'top',
            });
        } catch (error: any) {
            Burnt.toast({
                title: 'Error al registrar recaída',
                message: error.message,
                preset: 'error',
                duration: 3,
                from: 'top',
            });
            throw error;
        }
    },
}));

export default useAuthStore;
