import { useState, useEffect } from 'react';
import { usuariosService } from '../../../services/endpoints/users.service';
import { Usuario } from '@/types/user.types';

interface UseUsersReturn {
  users: Usuario[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => Promise<Usuario | null>;
  deleteUser: (id: string) => Promise<void>;
  getByTipo: (tipo: string) => Promise<Usuario[]>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuariosService.getAll();
      setUsers(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuários';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadUsers();
  };

  const getById = async (id: string): Promise<Usuario | null> => {
    try {
      return await usuariosService.getById(id);
    } catch {
      return null;
    }
  };

  const deleteUser = async (id: string) => {
    await usuariosService.delete(id);
    await loadUsers();
  };

  const getByTipo = async (tipo: string): Promise<Usuario[]> => {
    try {
      return await usuariosService.getByTipo(tipo);
    } catch {
      return [];
    }
  };

  return {
    users,
    loading,
    error,
    refresh,
    getById,
    deleteUser,
    getByTipo,
  };
};
