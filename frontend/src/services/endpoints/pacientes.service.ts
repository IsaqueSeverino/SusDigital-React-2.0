import { api } from '../api';
import { Paciente, CreatePacienteData, UpdatePacienteData } from '@/types/paciente.types';

export const pacientesService = {
  getAll: async () => {
    const response = await api.get<Paciente[]>('/pacientes');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Paciente>(`/pacientes/${id}`);
    return response.data;
  },

  create: async (data: CreatePacienteData) => {
    const response = await api.post<Paciente>('/pacientes', data);
    return response.data;
  },

  update: async (id: string, data: UpdatePacienteData) => {
    const response = await api.put<Paciente>(`/pacientes/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/pacientes/${id}`);
  },

  search: async (query: string) => {
    const response = await api.get<Paciente[]>(`/pacientes?q=${query}`);
    return response.data;
  },
};
