import { useContext } from 'react';
import { AuthContext, AuthContextData } from './auth.context';

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return context;
};
