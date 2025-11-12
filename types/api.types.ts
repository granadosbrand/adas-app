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
// Login Types
// ============================================

export interface LoginRequest {
    username: string;
}

export interface LoginResponse {
    user: User;
    settings: UserSettings;
    pending_checkpoint?: Checkpoint | null;
    mode: ModeType;
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

export type RelapseDifficulty = 'easy' | 'normal' | 'hard';

export interface Relapse {
    id: string;
    user_id: string;
    occurred_at: string;
    planned?: boolean;
    difficulty?: RelapseDifficulty;
    checkpoint_id?: string;
    created_at: string;
}

export interface CreateRelapseRequest {
    occurred_at: string; // UTC
    planned?: boolean;
    difficulty?: RelapseDifficulty; // opcional si planned=false
}

export type RelapseRelation = 'reached' | 'early' | 'missed' | 'none';

export interface RelapseClassification {
    relation: RelapseRelation;
    diff_minutes: number;
}

export interface CreateRelapseResponse {
    relapse: Relapse;
    classification: RelapseClassification;
    mode: ModeType; // Modo actual después del relapse (puede haber cambiado)
    checkpoint_reached?: string | null; // UUID del checkpoint alcanzado
    pending_checkpoint?: Checkpoint | null; // Nuevo checkpoint creado
}

export interface ListRelapsesParams {
    from?: string; // UTC
    to?: string;   // UTC
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
    scheduled_for: string; // UTC
    target_hours: number;
    origin_rule: OriginRule;
    status?: CheckpointStatus;
}

export interface UpdateCheckpointStatusRequest {
    status: CheckpointStatus;
    reached_at?: string | null; // UTC, null permitido para missed
}

export interface ListCheckpointsParams {
    status?: CheckpointStatus;
    from?: string; // UTC
    to?: string;   // UTC
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
