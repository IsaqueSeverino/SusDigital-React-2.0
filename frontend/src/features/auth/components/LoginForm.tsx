import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { LoginCredentials } from '@/types/user.types';
import { AxiosError } from 'axios';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setIsLoading(true);

      await login(data as LoginCredentials);
      navigate('/');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        (axiosError instanceof Error ? axiosError.message : null) ||
        'Erro ao fazer login. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && (
          <span className="field-error">{errors.email.message}</span>
        )}
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
        {errors.senha && (
          <span className="field-error">{errors.senha.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="submit-btn"
      >
        {isSubmitting || isLoading ? '🔄 Entrando...' : '🔓 Entrar'}
      </button>
    </form>
  );
};