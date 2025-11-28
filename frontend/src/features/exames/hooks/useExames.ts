import { useState, useEffect } from 'react';
import { examesService } from '../../../services/endpoints/exames.service';
import { Exame, ExameTipo, CreateExameData, UpdateExameData } from '@/types/exame.types';

interface UseExamesReturn {
  exames: Exame[];
  loading: boolean;
  error: string | null;
  refresh: (params?: { consultaId?: string; tipo?: ExameTipo }) => Promise<void>;
  getById: (id: string) => Promise<Exame | null>;
  create: (data: CreateExameData) => Promise<void>;
  update: (id: string, data: UpdateExameData) => Promise<void>;
  deleteExame: (id: string) => Promise<void>;
}

export const useExames = (initialParams?: { consultaId?: string; tipo?: ExameTipo }): UseExamesReturn => {
  const [exames, setExames] = useState<Exame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadExames = async (params = initialParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await examesService.getAll(params);
      setExames(data ?? []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar exames';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExames(initialParams);
  }, [initialParams?.consultaId, initialParams?.tipo]);

  const refresh = async (params?: { consultaId?: string; tipo?: ExameTipo }) => {
    await loadExames(params ?? initialParams);
  };

  const getById = async (id: string): Promise<Exame | null> => {
    try {
      return await examesService.getById(id);
    } catch {
      return null;
    }
  };

  const create = async (data: CreateExameData) => {
    await examesService.create(data);
    await loadExames();
  };

  const update = async (id: string, data: UpdateExameData) => {
    await examesService.update(id, data);
    await loadExames();
  };

  const deleteExame = async (id: string) => {
    await examesService.delete(id);
    await loadExames();
  };

  return {
    exames,
    loading,
    error,
    refresh,
    getById,
    create,
    update,
    deleteExame,
  };
};
