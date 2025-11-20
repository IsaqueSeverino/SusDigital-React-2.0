import { api } from '../api';
import { Usuario } from '@/types/user.types';

export const usuariosService = {
  getAll: async (): Promise<Usuario[]> => {
    const response = await api.get<{ usuarios?: Usuario[]; data?: Usuario[] }>('/usuarios');
      
    return response.data.usuarios ?? response.data.data ?? [];
  },

  getById: async (id: string): Promise<Usuario> => {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },

  getByTipo: async (tipo: string): Promise<Usuario[]> => {
    const response = await api.get<Usuario[]>(`/usuarios/tipo/${tipo}`);
    return response.data;
  },
};
