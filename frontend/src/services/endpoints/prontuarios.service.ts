import { api } from '../api';
import { Prontuario, CreateProntuarioData, UpdateProntuarioData } from '@/types/prontuario.types';

export const prontuariosService = {
  getAll: async (): Promise<Prontuario[]> => {
    const response = await api.get<Prontuario[]>('/prontuarios');
    return response.data ?? [];
  },

  getById: async (id: string): Promise<Prontuario> => {
    const response = await api.get<Prontuario>(`/prontuarios/${id}`);
    return response.data;
  },

  create: async (data: CreateProntuarioData): Promise<Prontuario> => {
    const response = await api.post<Prontuario>('/prontuarios', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProntuarioData): Promise<Prontuario> => {
    const response = await api.put<Prontuario>(`/prontuarios/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/prontuarios/${id}`);
  },

  getByPaciente: async (pacienteId: string): Promise<Prontuario[]> => {
    const response = await api.get<Prontuario[]>(`/prontuarios/paciente/${pacienteId}`);
    return response.data;
  },
};
