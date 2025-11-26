import React from "react";

interface DashboardHeaderProps {
  lastUpdate?: Date;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdate,
}) => {
  return (
    <header className="mb-8 pb-6 border-b-2 border-gray-200">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
        Dashboard
      </h1>
      {lastUpdate && (
        <p className="text-sm text-gray-500 italic">
          Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
        </p>
      )}
    </header>
  );
};
