import React from "react";
import { DashboardStats as DashboardStatsType } from "../../types/dashboard.types";
import { DashboardCard } from "./DashboardCard";
import { User, Stethoscope, Calendar, FileText } from "lucide-react";

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const cardsConfig = [
    {
      type: "pacientes" as const,
      icon: <User size={24} />,
      title: "Pacientes",
      value: stats.pacientes,
      label: "Total de pacientes cadastrados",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-l-blue-500",
      iconBg: "bg-blue-100",
      titleColor: "text-gray-900",
    },
    {
      type: "medicos" as const,
      icon: <Stethoscope size={24} />,
      title: "Médicos",
      value: stats.medicos,
      label: "Total de médicos no sistema",
      bgColor: "from-red-50 to-red-100",
      borderColor: "border-l-red-500",
      iconBg: "bg-red-100",
      titleColor: "text-gray-900",
    },
    {
      type: "consultas" as const,
      icon: <Calendar size={24} />,
      title: "Consultas",
      value: stats.consultas,
      label: "Total de consultas registradas",
      bgColor: "from-yellow-50 to-yellow-100",
      borderColor: "border-l-yellow-500",
      iconBg: "bg-yellow-100",
      titleColor: "text-gray-900",
    },
    {
      type: "prontuarios" as const,
      icon: <FileText size={24} />,
      title: "Prontuários",
      value: stats.prontuarios,
      label: "Total de prontuários arquivados",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-l-green-500",
      iconBg: "bg-green-100",
      titleColor: "text-gray-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardsConfig.map((card) => (
        <DashboardCard
          key={card.type}
          icon={card.icon}
          title={card.title}
          value={card.value}
          label={card.label}
          type={card.type}
          bgColor={card.bgColor}
          borderColor={card.borderColor}
          iconBg={card.iconBg}
          titleColor={card.titleColor}
        />
      ))}
    </div>
  );
};
