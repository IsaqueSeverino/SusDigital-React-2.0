import React, { useState } from 'react';
import { Loader2, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { RegisterData } from '@/types/user.types';
import { AxiosError } from 'axios';

const registerSchema = z
  .object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    cpf: z.string().min(11, 'CPF inválido'),
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    senhaConfirm: z.string(),
    tipo: z.enum(['ADMIN', 'MEDICO', 'PACIENTE']),
    dataNascimento: z.string().optional(),
    telefone: z.string().optional(),
  })
  .refine((data) => data.senha === data.senhaConfirm, {
    message: 'Senhas não conferem',
    path: ['senhaConfirm'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');

      const { senhaConfirm, ...registerData } = data;
      await registerUser(registerData as RegisterData);
      navigate('/login');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        (axiosError instanceof Error ? axiosError.message : null) ||
        'Erro ao registrar. Tente novamente.';
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="register-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="nome">Nome Completo</label>
        <input
          id="nome"
          type="text"
          placeholder="Seu nome"
          {...register('nome')}
          className={errors.nome ? 'input-error' : ''}
        />
        {errors.nome && <span className="field-error">{errors.nome.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="cpf">CPF</label>
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
        <label htmlFor="tipo">Tipo de Usuário</label>
        <select
          id="tipo"
          {...register('tipo')}
          className={errors.tipo ? 'input-error' : ''}
        >
          <option value="">Selecione um tipo</option>
          <option value="PACIENTE">Paciente</option>
          <option value="MEDICO">Médico</option>
          <option value="ADMIN">Administrador</option>
        </select>
        {errors.tipo && <span className="field-error">{errors.tipo.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="dataNascimento">Data de Nascimento</label>
        <input
          id="dataNascimento"
          type="date"
          {...register('dataNascimento')}
        />
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

      <div className="form-group">
        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          placeholder="Sua senha"
          {...register('senha')}
          className={errors.senha ? 'input-error' : ''}
        />
        {errors.senha && <span className="field-error">{errors.senha.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="senhaConfirm">Confirme a Senha</label>
        <input
          id="senhaConfirm"
          type="password"
          placeholder="Confirme sua senha"
          {...register('senhaConfirm')}
          className={errors.senhaConfirm ? 'input-error' : ''}
        />
        {errors.senhaConfirm && (
          <span className="field-error">{errors.senhaConfirm.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className="submit-btn flex items-center justify-center gap-2">
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Registrando...</span>
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            <span>Registrar</span>
          </>
        )}
      </button>
    </form>
  );
};