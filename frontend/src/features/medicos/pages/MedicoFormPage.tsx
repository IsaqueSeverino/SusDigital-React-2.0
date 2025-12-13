import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMedicos } from '../hooks/useMedicos';
import { CreateMedicoData } from '@/types/medico.types';
import { medicosService } from '../../../services/endpoints/medicos.service';
import '../styles/MedicoFormPage.css';

const medicoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  crm: z.string().min(4, 'CRM inválido (mínimo 4 caracteres)'),
  especialidade: z.string().min(3, 'Especialidade deve ter no mínimo 3 caracteres'),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  email: z.string().email('Email inválido'),
});

type MedicoFormData = z.infer<typeof medicoSchema>;

const MedicoFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { create, update } = useMedicos();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(!!id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MedicoFormData>({
    resolver: zodResolver(medicoSchema),
  });

  useEffect(() => {
    if (id) {
      const loadMedico = async () => {
        try {
          setPageLoading(true);
          const data = await medicosService.getById(id);
          reset({
            nome: data.nome,
            crm: data.crm,
            especialidade: data.especialidade,
            telefone: data.telefone || '',
            endereco: data.endereco || '',
            email: data.email || '',
          });
        } catch (err) {
          console.error('Erro ao carregar médico:', err);
        } finally {
          setPageLoading(false);
        }
      };
      loadMedico();
    }
  }, [id, reset]);

  const onSubmit = async (data: MedicoFormData) => {
    try {
      setIsLoading(true);
      if (id) {
        await update(id, data);
      } else {
        await create(data as CreateMedicoData);
      }
      navigate('/medicos');
    } catch (err) {
      console.error('Erro ao salvar médico:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="medico-form-page">
      <h1>{id ? 'Editar Médico' : 'Novo Médico'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="medico-form">
        <div className="form-group">
          <label htmlFor="nome">Nome Completo *</label>
          <input
            id="nome"
            type="text"
            placeholder="Dr. Nome do Médico"
            {...register('nome')}
            className={errors.nome ? 'input-error' : ''}
          />
          {errors.nome && <span className="field-error">{errors.nome.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="crm">CRM *</label>
          <input
            id="crm"
            type="text"
            placeholder="12345/UF"
            {...register('crm')}
            className={errors.crm ? 'input-error' : ''}
          />
          {errors.crm && <span className="field-error">{errors.crm.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="especialidade">Especialidade *</label>
          <input
            id="especialidade"
            type="text"
            placeholder="Cardiologia, Pediatria..."
            {...register('especialidade')}
            className={errors.especialidade ? 'input-error' : ''}
          />
          {errors.especialidade && <span className="field-error">{errors.especialidade.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            placeholder="medico@hospital.com"
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
            className={errors.telefone ? 'input-error' : ''}
          />
          {errors.telefone && <span className="field-error">{errors.telefone.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="endereco">Endereço</label>
          <input
            id="endereco"
            type="text"
            placeholder="Rua, número, complemento"
            {...register('endereco')}
            className={errors.endereco ? 'input-error' : ''}
          />
          {errors.endereco && <span className="field-error">{errors.endereco.message}</span>}
        </div>

        <div className="form-actions" style={{ marginTop: '20px' }}>
          <button
            type="button"
            onClick={() => navigate('/medicos')}
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

export default MedicoFormPage;
