import api from './api';
import type { Sweet, CreateSweetData, UpdateSweetData, SearchParams } from '../types/sweet';

export const sweetsService = {
    async getAll(): Promise<Sweet[]> {
        const response = await api.get<Sweet[]>('/api/sweets');
        return response.data;
    },

    async search(params: SearchParams): Promise<Sweet[]> {
        const response = await api.get<Sweet[]>('/api/sweets/search', { params });
        return response.data;
    },

    async create(data: CreateSweetData): Promise<Sweet> {
        const response = await api.post<Sweet>('/api/sweets', data);
        return response.data;
    },

    async update(id: string, data: UpdateSweetData): Promise<Sweet> {
        const response = await api.put<Sweet>(`/api/sweets/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/api/sweets/${id}`);
    },

    async purchase(id: string, quantity: number): Promise<Sweet> {
        const response = await api.post<Sweet>(`/api/sweets/${id}/purchase`, { quantity });
        return response.data;
    },

    async restock(id: string, quantity: number): Promise<Sweet> {
        const response = await api.post<Sweet>(`/api/sweets/${id}/restock`, { quantity });
        return response.data;
    },
};
