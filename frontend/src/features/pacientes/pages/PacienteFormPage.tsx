import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePacientes } from '../hooks/usePacientes';
import { Paciente } from '../../../types/paciente.types';
import { pacientesService } from '../../../services/endpoints/pacientes.service';
import { CreatePacienteData } from '@/types/paciente.types';
import '../styles/PacienteFormPage.css';

const pacienteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().min(11, 'CPF inválido'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
});

type PacienteFormData = z.infer<typeof pacienteSchema>;

const PacienteFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { create, update } = usePacientes();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<Paciente | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
  });

  // Carrega dados do paciente se for edição
  useEffect(() => {
    if (id) {
      const loadPaciente = async () => {
        try {
          const data = await pacientesService.getById(id);
          setInitialData(data);
          reset({
            nome: data.nome,
            cpf: data.cpf,
            dataNascimento: data.dataNascimento?.toISOString()
              .split('T')[0], // retorna string YYYY-MM-DD
            telefone: data.telefone || '',
            endereco: data.endereco || '',
            email: data.email || '',
          });
        } catch (err) {
          console.error('Erro ao carregar paciente:', err);
        }
      };
      loadPaciente();
    }
  }, [id, reset]);

  const onSubmit = async (data: PacienteFormData) => {
    try {
      setIsLoading(true);
      if (id) {
        await update(id, data);
      } else {
        await create(data as CreatePacienteData);
      }
      navigate('/pacientes');
    } catch (err) {
      console.error('Erro ao salvar paciente:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="paciente-form-page">
      <h1>{id ? 'Editar Paciente' : 'Novo Paciente'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="paciente-form">
        <div className="form-group">
          <label htmlFor="nome">Nome Completo *</label>
          <input
            id="nome"
            type="text"
            placeholder="Nome do paciente"
            {...register('nome')}
            className={errors.nome ? 'input-error' : ''}
          />
          {errors.nome && <span className="field-error">{errors.nome.message}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cpf">CPF *</label>
            <input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              {...register('cpf')}
              className={errors.cpf ? 'input-error' : ''}
            />
            {errors.cpf && <span className="field-error">{errors.cpf.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dataNascimento">Data de Nascimento *</label>
            <input
              id="dataNascimento"
              type="date"
              {...register('dataNascimento')}
              className={errors.dataNascimento ? 'input-error' : ''}
            />
            {errors.dataNascimento && <span className="field-error">{errors.dataNascimento.message}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              {...register('email')}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              type="tel"
              placeholder="(11) 99999-9999"
              {...register('telefone')}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="endereco">Endereço</label>
          <input
            id="endereco"
            type="text"
            placeholder="Rua, número, complemento"
            {...register('endereco')}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/pacientes')}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="btn btn-primary"
          >
            {isSubmitting || isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PacienteFormPage;
