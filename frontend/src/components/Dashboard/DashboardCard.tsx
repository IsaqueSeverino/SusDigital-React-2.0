import React from 'react';

interface DashboardCardProps {
  icon: string;
  title: string;
  value: number;
  label: string;
  type: 'pacientes' | 'medicos' | 'consultas' | 'prontuarios';
  bgColor: string;
  borderColor: string;
  iconBg: string;
  titleColor?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  value,
  label,
  bgColor,
  borderColor,
  iconBg,
  titleColor

}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 ${borderColor} p-6 overflow-hidden relative group`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      ></div>

      <div className="relative z-10">
        <div className={`${iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}>
          {icon}
        </div>

        <h3 className={`text-sm font-semibold ${titleColor} uppercase tracking-wide mb-2`}>
          {title}
        </h3>

        <p className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 animate-pulse-slow">
          {value}
        </p>

        <p className="text-xs lg:text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
};
