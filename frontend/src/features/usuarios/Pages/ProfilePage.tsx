import React from 'react';
import { useAuth } from '@/context/useAuth';
import { Usuario } from '@/types/user.types';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  // Helper to safely access user properties, assuming user might match Usuario or have direct properties like in Header
  const safeUser = user as unknown as Usuario & { nome?: string };

  const displayName = safeUser?.medico?.nome || safeUser?.paciente?.nome || safeUser?.nome || 'Usuário';
  const displayRole = safeUser?.tipo || 'Nível de acesso desconhecido';

  if (!user) {
    return <div className="p-8">Usuário não autenticado.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="opacity-90 mt-2">Gerencie suas informações pessoais</p>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Avatar / Initials Placeholder */}
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-500 font-bold border-4 border-white shadow-md mx-auto md:mx-0">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 space-y-6 w-full">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{displayName}</h2>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mt-2 font-medium">
                  {displayRole}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-800 font-medium">{safeUser.email}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">ID do Usuário</label>
                  <p className="text-gray-800 font-mono text-sm">{safeUser.id}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Status da Conta</label>
                  <p className={`font-medium ${safeUser.ativo ? 'text-green-600' : 'text-red-600'}`}>
                    {safeUser.ativo ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Data de Cadastro</label>
                  <p className="text-gray-800">
                    {safeUser.createdAt ? new Date(safeUser.createdAt).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
              </div>

              {/* Conditional rendering for Doctor specific info */}
              {safeUser.medico && (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 border-b border-blue-200 pb-2">Informações Médicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <span className="block text-sm text-gray-500">CRM</span>
                        <span className="font-medium text-gray-800">{safeUser.medico.crm}</span>
                     </div>
                     <div>
                        <span className="block text-sm text-gray-500">Especialidade</span>
                        <span className="font-medium text-gray-800">{safeUser.medico.especialidade}</span>
                     </div>
                  </div>
                </div>
              )}

              {/* Conditional rendering for Patient specific info */}
              {safeUser.paciente && (
                <div className="bg-green-50 p-4 rounded-md border border-green-100 mt-6">
                   <h3 className="text-lg font-semibold text-green-800 mb-4 border-b border-green-200 pb-2">Dados do Paciente</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <span className="block text-sm text-gray-500">CPF</span>
                        <span className="font-medium text-gray-800">{safeUser.paciente.cpf}</span>
                     </div>
                     <div>
                        <span className="block text-sm text-gray-500">Cartão SUS</span>
                        <span className="font-medium text-gray-800">{safeUser.paciente.cartaoSus}</span>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
