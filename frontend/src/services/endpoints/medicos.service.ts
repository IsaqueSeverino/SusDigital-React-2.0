import { api } from '../api';
import { Medico, CreateMedicoData } from '@/types/medico.types';

export const medicosService = {
  getAll: async (): Promise<Medico[]> => {
    const response = await api.get<Medico[]>('/medicos');
    return response.data;
  },

  getById: async (id: string): Promise<Medico> => {
    const response = await api.get<Medico>(`/medicos/${id}`);
    return response.data;
  },

  create: async (data: CreateMedicoData): Promise<Medico> => {
    const response = await api.post<Medico>('/medicos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateMedicoData>): Promise<Medico> => {
    const response = await api.put<Medico>(`/medicos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/medicos/${id}`);
  },

  getByEspecialidade: async (especialidade: string): Promise<Medico[]> => {
    const response = await api.get<Medico[]>(`/medicos/especialidade/${especialidade}`);
    return response.data;
  },
};
