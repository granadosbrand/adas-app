import {
    ApiError,
    CreateRelapseRequest,
    CreateRelapseResponse,
    ListRelapsesParams,
    Relapse,
} from '@/types/api.types';
import apiClient from './client';

/**
 * Servicio para gestionar recaídas (relapses)
 */
export const relapsesService = {
    /**
     * POST /api/v1/users/{userId}/relapses — Insertar recaída
     */
    createRelapse: async (
        userId: string,
        request: CreateRelapseRequest
    ): Promise<{ data?: CreateRelapseResponse; error?: ApiError }> => {
        return apiClient.post<CreateRelapseResponse>(`/api/v1/users/${userId}/relapses`, request);
    },

    /**
     * GET /api/v1/users/{userId}/relapses — Listar recaídas
     */
    listRelapses: async (
        userId: string,
        params?: ListRelapsesParams
    ): Promise<{ data?: Relapse[]; error?: ApiError }> => {
        return apiClient.get<Relapse[]>(`/api/v1/users/${userId}/relapses`, params);
    },
};
