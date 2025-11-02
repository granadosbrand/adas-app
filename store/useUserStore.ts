import { Checkpoint, ModeType, User, UserSettings } from '@/types/api.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
    // Estado del usuario
    user: User | null;
    settings: UserSettings | null;
    mode: ModeType | null;
    pendingCheckpoint: Checkpoint | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Acciones
    setUser: (user: User | null) => void;
    setSettings: (settings: UserSettings | null) => void;
    setMode: (mode: ModeType | null) => void;
    setPendingCheckpoint: (checkpoint: Checkpoint | null) => void;
    setLoginData: (data: {
        user: User;
        settings: UserSettings;
        mode: ModeType;
        pendingCheckpoint?: Checkpoint | null;
    }) => void;
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
            pendingCheckpoint: null,
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

            // Actualizar checkpoint pendiente
            setPendingCheckpoint: (checkpoint: Checkpoint | null) => {
                set({ pendingCheckpoint: checkpoint });
            },

            // Método conveniente para guardar toda la data del login
            setLoginData: (data) => {
                set({
                    user: data.user,
                    settings: data.settings,
                    mode: data.mode,
                    pendingCheckpoint: data.pendingCheckpoint || null,
                    isAuthenticated: true,
                });
            },

            // Cerrar sesión y limpiar estado
            logout: () => {
                set({
                    user: null,
                    settings: null,
                    mode: null,
                    pendingCheckpoint: null,
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
