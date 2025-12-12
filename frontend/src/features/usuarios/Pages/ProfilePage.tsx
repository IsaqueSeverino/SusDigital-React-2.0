import React from 'react';
import { useAuth } from '@/context/useAuth';
import { Usuario } from '@/types/user.types';
import SusCard from '../components/SusCard';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  // Helper to safely access user properties, assuming user might match Usuario or have direct properties like in Header
  const safeUser = user as unknown as Usuario & { nome?: string };



  if (!user) {
    return <div className="p-8">Usuário não autenticado.</div>;
  }

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-[80vh]">
       <SusCard user={safeUser} />
    </div>
  );
};

export default ProfilePage;
