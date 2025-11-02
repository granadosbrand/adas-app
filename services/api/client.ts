import env from '@/config/env';
import { ApiError } from '@/types/api.types';

/**
 * Cliente HTTP base para realizar peticiones a la API
 */
class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = env.API_BASE_URL;
    }

    /**
     * Método genérico para realizar peticiones HTTP
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<{ data?: T; error?: ApiError }> {
        const url = `${this.baseUrl}${endpoint}`;

        console.log("url: ", url)

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            const responseData = await response.json();

            if (!response.ok) {
                return {
                    error: {
                        error: responseData.error || 'Request failed',
                        message: responseData.message || `HTTP ${response.status}`,
                        details: responseData,
                    },
                };
            }

            // Tu API devuelve: { data: {...}, success: true }
            // Extraemos el data interno si existe
            const actualData = responseData.data !== undefined ? responseData.data : responseData;

            return { data: actualData };
        } catch (error) {
            console.error('API Request Error:', error);
            return {
                error: {
                    error: 'NetworkError',
                    message: error instanceof Error ? error.message : 'Unknown error',
                },
            };
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, params?: Record<string, any>): Promise<{ data?: T; error?: ApiError }> {
        let url = endpoint;

        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }

        return this.request<T>(url, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, body?: any): Promise<{ data?: T; error?: ApiError }> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, body?: any): Promise<{ data?: T; error?: ApiError }> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, body?: any): Promise<{ data?: T; error?: ApiError }> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string): Promise<{ data?: T; error?: ApiError }> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export default new ApiClient();
