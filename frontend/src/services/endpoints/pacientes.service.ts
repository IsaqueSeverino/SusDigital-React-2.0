import { api } from '../api';
import { Paciente, CreatePacienteData, UpdatePacienteData } from '@/types/paciente.types';

export const pacientesService = {
  // Listar todos os pacientes
  getAll: async () => {
    const response = await api.get<Paciente[]>('/pacientes');
    return response.data;
  },

  // Obter paciente por ID
  getById: async (id: string) => {
    const response = await api.get<Paciente>(`/pacientes/${id}`);
    return response.data;
  },

  // Criar novo paciente
  create: async (data: CreatePacienteData) => {
    const response = await api.post<Paciente>('/pacientes', data);
    return response.data;
  },

  // Atualizar paciente
  update: async (id: string, data: UpdatePacienteData) => {
    const response = await api.put<Paciente>(`/pacientes/${id}`, data);
    return response.data;
  },

  // Deletar paciente
  delete: async (id: string) => {
    await api.delete(`/pacientes/${id}`);
  },

  // Buscar pacientes
  search: async (query: string) => {
    const response = await api.get<Paciente[]>(`/pacientes/search?q=${query}`);
    return response.data;
  },
};
