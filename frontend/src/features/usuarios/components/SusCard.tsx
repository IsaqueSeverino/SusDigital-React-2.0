import React from 'react';
import { Usuario } from '@/types/user.types';
import fundo1 from '@/assets/fundo1.jpg';
import bandeira from '@/assets/bandeira.jpg';
import bendeiraF from '@/assets/bendeiraF.jpg';
import emblemaF from '@/assets/EmblemaF.jpg';
import bandeiraP from '@/assets/BandeiraP.jpg';
import emblemaP from '@/assets/EmblemaP.jpg';

interface SusCardProps {
  user: Usuario;
}

const SusCard: React.FC<SusCardProps> = ({ user }) => {
  // Try to get name from properties, or fallback to 'Usuário'
  let displayName = user.medico?.nome || user.paciente?.nome || (user as any).nome;
  
  // If no name found, try to extract from email (Capitalized)
  if (!displayName && user.email) {
     const nameFromEmail = user.email.split('@')[0];
     displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
  }

  // Fallback string if everything fails
  displayName = displayName || 'Usuário';

  const displayRole = user.tipo || 'Nível de acesso desconhecido';
  const displayInitial = displayName.charAt(0).toUpperCase();

  const checkUser = (names: string[]) => names.some(identifier => 
    displayName.toLowerCase().includes(identifier) || 
    user.email.toLowerCase().includes(identifier)
  );

  // Lista especifica de usuarios
  const isRedGroup = checkUser(['bruno', 'luan']);
  const isGreenGroup = checkUser(['isaque', 'warley', 'vitor']);
  
  // Dynamic styles based on user
  let borderColor = '#3262A2'; // Default Blue
  let headerBg = fundo1;
  let bodyBg = bandeira;
  let headerBgPosition = 'bottom';

  if (isRedGroup) {
      borderColor = '#7E0005';
      headerBg = bendeiraF;
      bodyBg = emblemaF;
      headerBgPosition = 'center';
  } else if (isGreenGroup) {
      borderColor = '#044F29';
      headerBg = bandeiraP;
      bodyBg = emblemaP;
      headerBgPosition = 'center'; // Assuming center for P variant too, can be adjusted
  } 

  // Default to true if undefined, only explicitly false is Inactive
  const isActive = user.ativo !== false;

  return (
    <div className="w-full max-w-[650px] h-[350px] relative bg-white rounded-[20px] overflow-hidden shadow-2xl mx-auto font-sans transition-transform hover:scale-[1.01] duration-300">
        
        {/* Left Border Strip */}
        <div 
          className="absolute top-0 left-0 h-full w-[5px] z-50 pointer-events-none" 
          style={{ backgroundColor: borderColor }} 
        />

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-white bg-gradient-to-t from-white/20 to-white/20 pointer-events-none" />

        {/* Top Header Bar */}
        <div 
            className="absolute top-0 -left-[20px] w-[120%] h-[55px] z-0 shadow-md bg-cover"
            style={{ 
              backgroundImage: `url('${headerBg}')`,
              backgroundPosition: headerBgPosition
            }}
        ></div>

        {/* Background Image (Body) */}
        <div 
           className="absolute top-[50px] inset-x-0 bottom-0 opacity-[0.15] z-0 pointer-events-none mix-blend-multiply"
           style={{ 
             backgroundImage: `url('${bodyBg}')`,
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}
         />

        {/* Header Text */}
        <div className="absolute top-[4px] left-[15px] z-10">
            <h1 className="text-white text-[24px] font-bold drop-shadow-md" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                 Perfil
            </h1>
        </div>
        <div className="absolute top-[29px] left-[15px] z-10">
            <p className="text-white text-[13px] font-medium drop-shadow-md" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                Gerencie suas informações pessoais
            </p>
        </div>

        {/* Avatar Section */}
        <div className="absolute top-[63px] left-[21px] w-[90px] h-[90px] bg-white rounded-full shadow-md z-10 flex items-center justify-center">
            <div className="w-[80px] h-[80px] bg-[#DADADA] rounded-full flex items-center justify-center">
                <span className="text-[#929090] text-[32px] font-extrabold" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                    {displayInitial}
                </span>
            </div>
        </div>

        {/* User Info Section - Absolute positioned elements mapped from original HTML */}
        
        {/* Name */}
        <div className="absolute top-[68px] left-[136px] max-w-[480px]">
            <h2 className="text-black text-[24px] font-extrabold leading-tight truncate" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                {displayName}
            </h2>
        </div>

        {/* Role */}
        <div className="absolute top-[94px] left-[136px]">
            <span className="text-[#212BE0] text-[13px] font-medium uppercase tracking-wide" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                {displayRole}
            </span>
        </div>

        {/* Grid Fields */}

        {/* Email */}
        <div className="absolute top-[137px] left-[136px]">
            <label className="text-[#616161] text-[15px] font-medium block" style={{ fontFamily: 'Albert Sans, sans-serif' }}>Email</label>
            <p className="text-black text-[15px] font-medium truncate w-[220px]" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                {user.email}
            </p>
        </div>

        {/* ID */}
        <div className="absolute top-[137px] left-[385px]">
            <label className="text-[#616161] text-[15px] font-medium block" style={{ fontFamily: 'Albert Sans, sans-serif' }}>ID do Usuário</label>
            <p className="text-black text-[15px] font-medium font-mono truncate w-[220px]" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                {user.id}
            </p>
        </div>

        {/* Status */}
        <div className="absolute top-[200px] left-[136px]">
            <label className="text-[#616161] text-[15px] font-medium block" style={{ fontFamily: 'Albert Sans, sans-serif' }}>Status da Conta</label>
            <p className={`text-[15px] font-medium ${isActive ? 'text-green-600' : 'text-[#C50000]'}`} style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                {isActive ? 'Ativo' : 'Inativo'}
            </p>
        </div>

        {/* Created At */}
        <div className="absolute top-[200px] left-[385px]">
             <label className="text-[#616161] text-[15px] font-medium block" style={{ fontFamily: 'Albert Sans, sans-serif' }}>Data do Cadastro</label>
             <p className="text-[#0D0D0D] text-[15px] font-medium" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
             </p>
        </div>

    </div>
  );
};

export default SusCard;
