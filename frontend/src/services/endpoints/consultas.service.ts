import { api } from '../api';
import { Consulta, ConsultasListResponse, CreateConsultaData, UpdateConsultaData } from '@/types/consulta.types';

export const consultasService = {
  getAll: async ({ page = 1, limit = 100 } = {}): Promise<ConsultasListResponse> => {
    const response = await api.get<ConsultasListResponse>('/consultas', { params: { page, limit } });
    return response.data;
  },

  getById: async (id: string): Promise<Consulta> => {
    const response = await api.get<Consulta>(`/consultas/${id}`);
    return response.data;
  },

  create: async (data: CreateConsultaData): Promise<Consulta> => {
    const response = await api.post<Consulta>('/consultas', data);
    return response.data;
  },

  update: async (id: string, data: UpdateConsultaData): Promise<Consulta> => {
    const response = await api.put<Consulta>(`/consultas/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/consultas/${id}`);
  },

  getByDate: async (data: string, { page = 1, limit = 100 } = {}): Promise<ConsultasListResponse> => {
    const response = await api.get<ConsultasListResponse>(`/consultas/data/${data}`, { params: { page, limit } });
    return response.data;
  },

  getByPaciente: async (pacienteId: string, { page = 1, limit = 100 } = {}): Promise<ConsultasListResponse> => {
    const response = await api.get<ConsultasListResponse>(`/consultas/paciente/${pacienteId}`, { params: { page, limit } });
    return response.data;
  },
};
