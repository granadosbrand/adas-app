// ============================================
// User Types
// ============================================

export interface User {
    id: string;
    username?: string;
    timezone?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateUserRequest {
    username?: string;
    timezone?: string;
}

// ============================================
// Settings Types
// ============================================

export interface UserSettings {
    user_id: string;
    min_days: number;
    min_relapses: number;
    window_minutes: number;
    early_margin_minutes: number;
    max_step_up_pct: number;
    updated_at: string;
}

export interface UpdateSettingsRequest {
    min_days?: number;
    min_relapses?: number;
    window_minutes?: number;
    early_margin_minutes?: number;
    max_step_up_pct?: number;
}

// ============================================
// Mode Types
// ============================================

export type ModeType = 'evaluation' | 'survivor';

export interface ModeResponse {
    user_id: string;
    mode: ModeType;
}

// ============================================
// Relapse Types
// ============================================

export type RelapseDifficulty = 'easy' | 'medium' | 'hard';

export interface Relapse {
    id: string;
    user_id: string;
    occurred_at: string;
    planned: boolean;
    difficulty?: RelapseDifficulty;
    checkpoint_id?: string;
    created_at: string;
}

export interface CreateRelapseRequest {
    occurred_at: string; // ISO 8601 format
    planned: boolean;
    difficulty?: RelapseDifficulty; // opcional si planned=false
}

export interface ListRelapsesParams {
    from?: string; // ISO 8601 format
    to?: string;   // ISO 8601 format
    limit?: number;
}

// ============================================
// Checkpoint Types
// ============================================

export type CheckpointStatus = 'pending' | 'reached' | 'early' | 'missed' | 'canceled';

export interface OriginRule {
    reason: string;
    by?: string;
    [key: string]: any;
}

export interface Checkpoint {
    id: string;
    user_id: string;
    scheduled_for: string;
    target_hours: number;
    origin_rule: OriginRule;
    status: CheckpointStatus;
    reached_at?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateCheckpointRequest {
    scheduled_for: string; // ISO 8601 format
    target_hours: number;
    origin_rule: OriginRule;
    status?: CheckpointStatus;
}

export interface UpdateCheckpointStatusRequest {
    status: CheckpointStatus;
    reached_at?: string | null; // ISO 8601 format, null permitido para missed
}

export interface ListCheckpointsParams {
    status?: CheckpointStatus;
    from?: string; // ISO 8601 format
    to?: string;   // ISO 8601 format
    limit?: number;
}

// ============================================
// Generic API Response Types
// ============================================

export interface ApiError {
    error: string;
    message?: string;
    details?: any;
}

export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
    success: boolean;
}
