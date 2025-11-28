import { api } from '../api';
import { Exame, ExameTipo, CreateExameData, UpdateExameData, ExamesListResponse } from '@/types/exame.types';

export const examesService = {
  getAll: async (params?: { consultaId?: string; tipo?: ExameTipo }): Promise<ExamesListResponse> => {
    const response = await api.get<ExamesListResponse>('/exames', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Exame> => {
    const response = await api.get<Exame>(`/exames/${id}`);
    return response.data;
  },

  create: async (data: CreateExameData): Promise<Exame> => {
    const response = await api.post<Exame>('/exames', data);
    return response.data;
  },

  update: async (id: string, data: UpdateExameData): Promise<Exame> => {
    const response = await api.put<Exame>(`/exames/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/exames/${id}`);
  },
};
