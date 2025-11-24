import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';

import MainLayout from '@/components/layout/MainLayout';

import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';

import PacientesListPage from '@/features/pacientes/pages/PacientesListPage';
import PacienteDetailPage from '@/features/pacientes/pages/PacienteDetailPage';
import PacienteFormPage from '@/features/pacientes/pages/PacienteFormPage';

import ConsultasListPage from '@/features/consultas/pages/ConsultasListPage';
import AgendarConsultaPage from '@/features/consultas/pages/AgendarConsultaPage';

import MedicosListPage from '@/features/medicos/pages/MedicosListPage';
import ConsultasIdMedico from '@/features/consultas/pages/ConsultasIdMedico';

import UsuariosListPage from '@/features/usuarios/Pages/UsuariosListPage';

import ProntuariosListPage from '@/features/prontuarios/pages/ProntuariosListPage';

import DashboardPage from '@/features/dashboard/pages/DashboardPage';

const router = createBrowserRouter([

  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [

          {
            index: true,
            element: <DashboardPage />,
          },

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

          {
            element: <PrivateRoute allowedRoles={['ADMIN']} />,
            children: [
              {
                path: 'medicos',
                element: <MedicosListPage />,
              },
            ],
          },

          {
            element: <PrivateRoute allowedRoles={['ADMIN']} />,
            children: [
              {
                path: 'usuarios',
                element: <UsuariosListPage />,
              },
            ],
          },
          
          {
            path: 'consultas-medico',
            element: <ConsultasIdMedico />
          },
          {
            path: 'prontuarios',
            element: <ProntuariosListPage />,
          },
        ],
      },
    ],
  },

  {
    path: '*',
    element: <div>Página não encontrada</div>,
  },
]);

export const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};
