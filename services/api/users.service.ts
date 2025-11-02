import {
    ApiError,
    CreateUserRequest,
    ModeResponse,
    UpdateSettingsRequest,
    User,
    UserSettings,
} from '@/types/api.types';
import apiClient from './client';

/**
 * Servicio para gestionar usuarios y configuraciones
 */
export const usersService = {
    /**
     * POST /api/v1/users — Crear usuario
     */
    createUser: async (request: CreateUserRequest): Promise<{ data?: User; error?: ApiError }> => {
        return apiClient.post<User>('/api/v1/users', request);
    },

    /**
     * GET /api/v1/users/{userId} — Obtener usuario
     */
    getUser: async (userId: string): Promise<{ data?: User; error?: ApiError }> => {
        return apiClient.get<User>(`/api/v1/users/${userId}`);
    },

    /**
     * GET /api/v1/users/{userId}/settings — Obtener settings
     */
    getSettings: async (userId: string): Promise<{ data?: UserSettings; error?: ApiError }> => {
        return apiClient.get<UserSettings>(`/api/v1/users/${userId}/settings`);
    },

    /**
     * PUT /api/v1/users/{userId}/settings — Actualizar settings
     */
    updateSettings: async (
        userId: string,
        settings: UpdateSettingsRequest
    ): Promise<{ data?: UserSettings; error?: ApiError }> => {
        return apiClient.put<UserSettings>(`/api/v1/users/${userId}/settings`, settings);
    },

    /**
     * GET /api/v1/users/{userId}/mode — Devuelve "evaluation" o "survivor"
     */
    getMode: async (userId: string): Promise<{ data?: ModeResponse; error?: ApiError }> => {
        return apiClient.get<ModeResponse>(`/api/v1/users/${userId}/mode`);
    },

    /**
     * POST /api/v1/users/{userId}/activate-survivor — Forzar/activar survivor
     */
    activateSurvivor: async (userId: string): Promise<{ data?: any; error?: ApiError }> => {
        return apiClient.post(`/api/v1/users/${userId}/activate-survivor`);
    },
};
