import { api } from '../api';
import { Medico, CreateMedicoData } from '@/types/medico.types';

export const medicosService = {
  getAll: async () => {
    const response = await api.get<Medico[]>('/medicos');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Medico>(`/medicos/${id}`);
    return response.data;
  },

  create: async (data: CreateMedicoData) => {
    const response = await api.post<Medico>('/medicos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateMedicoData>) => {
    const response = await api.put<Medico>(`/medicos/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/medicos/${id}`);
  },

  getByEspecialidade: async (especialidade: string) => {
    const response = await api.get<Medico[]>(`/medicos/especialidade/${especialidade}`);
    return response.data;
  },
};
