import {
    ApiError,
    Checkpoint,
    CreateCheckpointRequest,
    ListCheckpointsParams,
    UpdateCheckpointStatusRequest,
} from '@/types/api.types';
import apiClient from './client';

/**
 * Servicio para gestionar checkpoints
 */
export const checkpointsService = {
    /**
     * GET /api/v1/users/{userId}/checkpoints/pending — Obtener checkpoint pendiente
     */
    getPendingCheckpoint: async (userId: string): Promise<{ data?: Checkpoint | null; error?: ApiError }> => {
        return apiClient.get<Checkpoint | null>(`/api/v1/users/${userId}/checkpoints/pending`);
    },

    /**
     * POST /api/v1/users/{userId}/checkpoints — Crear checkpoint
     */
    createCheckpoint: async (
        userId: string,
        request: CreateCheckpointRequest
    ): Promise<{ data?: Checkpoint; error?: ApiError }> => {
        return apiClient.post<Checkpoint>(`/api/v1/users/${userId}/checkpoints`, request);
    },

    /**
     * PATCH /api/v1/checkpoints/{checkpointId}/status — Cambiar estado
     */
    updateCheckpointStatus: async (
        checkpointId: string,
        request: UpdateCheckpointStatusRequest
    ): Promise<{ data?: Checkpoint; error?: ApiError }> => {
        return apiClient.patch<Checkpoint>(`/api/v1/checkpoints/${checkpointId}/status`, request);
    },

    /**
     * GET /api/v1/users/{userId}/checkpoints — Listar checkpoints
     */
    listCheckpoints: async (
        userId: string,
        params?: ListCheckpointsParams
    ): Promise<{ data?: Checkpoint[]; error?: ApiError }> => {
        return apiClient.get<Checkpoint[]>(`/api/v1/users/${userId}/checkpoints`, params);
    },
};
