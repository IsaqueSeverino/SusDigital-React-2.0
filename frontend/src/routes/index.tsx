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
import MedicoDetailPage from '@/features/medicos/pages/MedicoDetailPage';
import MedicoFormPage from '@/features/medicos/pages/MedicoFormPage';
import ConsultasIdMedico from '@/features/consultas/pages/ConsultasIdMedico';

import UsuariosListPage from '@/features/usuarios/Pages/UsuariosListPage';
import ProfilePage from '@/features/usuarios/Pages/ProfilePage';

import ProntuariosMedicoPage from "../features/prontuarios/pages/ProntuariosMedicoPage";

import DashboardPage from '@/features/dashboard/pages/DashboardPage';

import ExamesListPage from '@/features/exames/pages/ExamesListPage';
import ConsultasIdPaciente from '@/features/consultas/pages/ConsultasIdPaciente';
import ProntuariosPacientePage from '@/features/prontuarios/pages/ProntuariosPacientePage';
import ExameFormPage from '@/features/exames/pages/ExameFormPage';
import ProntuarioFormPage from '@/features/prontuarios/pages/ProntuarioFormPage';

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
            path: 'perfil',
            element: <ProfilePage />,
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
                children: [
                  {
                    index: true,
                    element: <MedicosListPage />,
                  },
                  {
                    path: 'novo',
                    element: <MedicoFormPage />,
                  },
                  {
                    path: ':id',
                    element: <MedicoDetailPage />,
                  },
                  {
                    path: ':id/editar',
                    element: <MedicoFormPage />,
                  },
                ],
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
            element: <ProntuariosMedicoPage />,
          },

          {
            path: 'meus-exames',
            element: <ExamesListPage />
          },

          {
            path: 'minhas-consultas',
            element: <ConsultasIdPaciente />
          },

          {
            path: 'meus-prontuarios',
            element: <ProntuariosPacientePage />
          },
          {
            path: 'exames/novo',
            element: <ExameFormPage />
          },
          {
            path: 'prontuarios/novo',
            element: <ProntuarioFormPage />
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
