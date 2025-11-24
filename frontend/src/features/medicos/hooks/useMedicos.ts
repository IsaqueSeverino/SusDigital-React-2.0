import { useState, useEffect } from 'react';
import { medicosService } from '../../../services/endpoints/medicos.service';
import { Medico, CreateMedicoData } from '@/types/medico.types';

interface UseMedicosReturn {
  medicos: Medico[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (data: CreateMedicoData) => Promise<void>;
  update: (id: string, data: Partial<CreateMedicoData>) => Promise<void>;
  deleteMedico: (id: string) => Promise<void>;
  getById: (id: string) => Promise<Medico | null>;
  getByEspecialidade: (especialidade: string) => Promise<Medico[]>;
}

export const useMedicos = (): UseMedicosReturn => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMedicos();
  }, []);

  const loadMedicos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await medicosService.getAll();
      setMedicos(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar médicos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadMedicos();
  };

  const create = async (data: CreateMedicoData) => {
    await medicosService.create(data);
    await loadMedicos();
  };

  const update = async (id: string, data: Partial<CreateMedicoData>) => {
    await medicosService.update(id, data);
    await loadMedicos();
  };

  const deleteMedico = async (id: string) => {
    await medicosService.delete(id);
    await loadMedicos();
  };

  const getById = async (id: string): Promise<Medico | null> => {
    try {
      return await medicosService.getById(id);
    } catch {
      return null;
    }
  };

  const getByEspecialidade = async (especialidade: string): Promise<Medico[]> => {
    try {
      return await medicosService.getByEspecialidade(especialidade);
    } catch {
      return [];
    }
  };

  return {
    medicos,
    loading,
    error,
    refresh,
    create,
    update,
    deleteMedico,
    getById,
    getByEspecialidade,
  };
};
