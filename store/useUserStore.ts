import { ModeType, User, UserSettings } from '@/types/api.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
    // Estado del usuario
    user: User | null;
    settings: UserSettings | null;
    mode: ModeType | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Acciones
    setUser: (user: User | null) => void;
    setSettings: (settings: UserSettings | null) => void;
    setMode: (mode: ModeType | null) => void;
    logout: () => void;
    hydrate: () => void;
}

/**
 * Store global para gestionar el estado del usuario autenticado
 */
const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            // Estado inicial
            user: null,
            settings: null,
            mode: null,
            isAuthenticated: false,
            isLoading: false,

            // Establecer usuario y marcar como autenticado
            setUser: (user: User | null) => {
                set({
                    user,
                    isAuthenticated: !!user,
                });
            },

            // Actualizar configuración del usuario
            setSettings: (settings: UserSettings | null) => {
                set({ settings });
            },

            // Actualizar modo actual (evaluation/survivor)
            setMode: (mode: ModeType | null) => {
                set({ mode });
            },

            // Cerrar sesión y limpiar estado
            logout: () => {
                set({
                    user: null,
                    settings: null,
                    mode: null,
                    isAuthenticated: false,
                });
            },

            // Hidratar datos (útil para refrescar desde API)
            hydrate: () => {
                set({ isLoading: false });
            },
        }),
        {
            name: 'adas-user-storage', // Clave única para AsyncStorage
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useUserStore;
