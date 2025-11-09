import React from 'react';
import { AuthProvider } from '@/context/AuthProvider';
import { AppRoutes } from '@/routes';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
