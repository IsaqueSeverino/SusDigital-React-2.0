import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';

interface PrivateRouteProps {
  allowedRoles?: Array<'ADMIN' | 'MEDICO' | 'PACIENTE'>;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Renderiza enquanto carrega
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Carregando...</div>
      </div>
    );
  }

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se há restrição de roles e o usuário não tem permissão
  if (allowedRoles && user && !allowedRoles.includes(user.tipo)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Se passou em todas as verificações, renderiza as rotas filhas
  return <Outlet />;
};
