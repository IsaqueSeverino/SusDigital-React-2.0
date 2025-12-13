import { useState, useEffect } from 'react';
import { prontuariosService } from '../../../services/endpoints/prontuarios.service';
import { pacientesService } from '../../../services/endpoints/pacientes.service';
import { Prontuario, CreateProntuarioData, UpdateProntuarioData } from '@/types/prontuario.types';

interface UseProntuariosReturn {
  prontuarios: Prontuario[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => Promise<Prontuario | null>;
  create: (data: CreateProntuarioData) => Promise<void>;
  update: (id: string, data: UpdateProntuarioData) => Promise<void>;
  deleteProntuario: (id: string) => Promise<void>;
  getByPaciente: (pacienteId: string) => Promise<Prontuario[]>;
}

export const useProntuarios = (): UseProntuariosReturn => {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProntuarios();
  }, []);

  const loadProntuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prontuariosData, pacientesData] = await Promise.all([
        prontuariosService.getAll(),
        pacientesService.getAll()
      ]);

      const enrichedProntuarios = prontuariosData.map(prontuario => {
        const paciente = pacientesData.find(p => p.id === prontuario.pacienteId);
        return {
          ...prontuario,
          paciente: (paciente as any) || prontuario.paciente 
        };
      });

      setProntuarios(enrichedProntuarios);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar prontuários';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadProntuarios();
  };

  const getById = async (id: string): Promise<Prontuario | null> => {
    try {
      return await prontuariosService.getById(id);
    } catch {
      return null;
    }
  };

  const create = async (data: CreateProntuarioData) => {
    await prontuariosService.create(data);
    await loadProntuarios();
  };

  const update = async (id: string, data: UpdateProntuarioData) => {
    await prontuariosService.update(id, data);
    await loadProntuarios();
  };

  const deleteProntuario = async (id: string) => {
    await prontuariosService.delete(id);
    await loadProntuarios();
  };

  const getByPaciente = async (pacienteId: string): Promise<Prontuario[]> => {
    try {
      return await prontuariosService.getByPaciente(pacienteId);
    } catch {
      return [];
    }
  };

  return {
    prontuarios,
    loading,
    error,
    refresh,
    getById,
    create,
    update,
    deleteProntuario,
    getByPaciente,
  };
};
