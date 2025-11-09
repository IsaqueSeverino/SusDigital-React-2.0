import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';

// Layouts
import MainLayout from '@/components/layout/MainLayout';

// Auth Pages
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';

// Pacientes Pages
import PacientesListPage from '@/features/pacientes/pages/PacientesListPage';
import PacienteDetailPage from '@/features/pacientes/pages/PacienteDetailPage';
import PacienteFormPage from '@/features/pacientes/pages/PacienteFormPage';

// Consultas Pages
import ConsultasListPage from '@/features/consultas/pages/ConsultasListPage';
import AgendarConsultaPage from '@/features/consultas/pages/AgendarConsultaPage';

// Médicos Pages
import MedicosListPage from '@/features/medicos/pages/MedicosListPage';

// Prontuários Pages
import ProntuariosListPage from '@/features/prontuarios/pages/ProntuariosListPage';

// Dashboard
import DashboardPage from '@/features/dashboard/pages/DashboardPage';

const router = createBrowserRouter([
  // ===== ROTAS PÚBLICAS =====
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // ===== ROTAS PROTEGIDAS =====
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          // Dashboard
          {
            index: true,
            element: <DashboardPage />,
          },

          // ===== PACIENTES =====
          {
            path: 'pacientes',
            children: [
              {
                index: true,
                element: <PacientesListPage />,
              },
              {
                path: 'novo',
                element: <PacienteFormPage />,
              },
              {
                path: ':id',
                element: <PacienteDetailPage />,
              },
              {
                path: ':id/editar',
                element: <PacienteFormPage />,
              },
            ],
          },

          // ===== CONSULTAS =====
          {
            path: 'consultas',
            children: [
              {
                index: true,
                element: <ConsultasListPage />,
              },
              {
                path: 'agendar',
                element: <AgendarConsultaPage />,
              },
            ],
          },

          // ===== MÉDICOS (apenas ADMIN) =====
          {
            element: <PrivateRoute allowedRoles={['ADMIN']} />,
            children: [
              {
                path: 'medicos',
                element: <MedicosListPage />,
              },
            ],
          },

          // ===== PRONTUÁRIOS =====
          {
            path: 'prontuarios',
            element: <ProntuariosListPage />,
          },
        ],
      },
    ],
  },

  // ===== FALLBACK =====
  {
    path: '*',
    element: <div>Página não encontrada</div>,
  },
]);

export const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};
