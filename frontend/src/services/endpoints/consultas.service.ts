import { api } from '../api';
import { Consulta, CreateConsultaData, UpdateConsultaData } from '@/types/consulta.types';

export const consultasService = {
  getAll: async () => {
    const response = await api.get<Consulta[]>('/consultas');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Consulta>(`/consultas/${id}`);
    return response.data;
  },

  create: async (data: CreateConsultaData) => {
    const response = await api.post<Consulta>('/consultas', data);
    return response.data;
  },

  update: async (id: string, data: UpdateConsultaData) => {
    const response = await api.put<Consulta>(`/consultas/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/consultas/${id}`);
  },

  // Buscar consultas por data
  getByDate: async (data: string) => {
    const response = await api.get<Consulta[]>(`/consultas/data/${data}`);
    return response.data;
  },

  // Buscar consultas do paciente
  getByPaciente: async (pacienteId: string) => {
    const response = await api.get<Consulta[]>(`/consultas/paciente/${pacienteId}`);
    return response.data;
  },
};
