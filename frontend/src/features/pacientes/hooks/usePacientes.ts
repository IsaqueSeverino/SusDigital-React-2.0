import { useState, useEffect } from 'react';
import { pacientesService } from '../../../services/endpoints/pacientes.service';
import { Paciente, CreatePacienteData, UpdatePacienteData } from '@/types/paciente.types';

interface UsePacientesReturn {
  pacientes: Paciente[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  search: (query: string) => Promise<void>;
  create: (data: CreatePacienteData) => Promise<void>;
  update: (id: string, data: UpdatePacienteData) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export const usePacientes = (): UsePacientesReturn => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pacientesService.getAll();
      setPacientes(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pacientes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadPacientes();
  };

  const search = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      if (query.trim() === '') {
        await loadPacientes();
      } else {
        const data = await pacientesService.search(query);
        setPacientes(data);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar pacientes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: CreatePacienteData) => {
    await pacientesService.create(data);
    await loadPacientes();
  };

  const update = async (id: string, data: UpdatePacienteData) => {
    await pacientesService.update(id, data);
    await loadPacientes();
  };

  const deleteFunc = async (id: string) => {
    await pacientesService.delete(id);
    await loadPacientes();
  };

  return {
    pacientes,
    loading,
    error,
    refresh,
    search,
    create,
    update,
    delete: deleteFunc,
  };
};