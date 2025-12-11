import React from "react";
import { Consulta } from "@/types/consulta.types";
import { User, Stethoscope, Calendar, Clock } from "lucide-react";

interface ConsultasListProps {
  consultas: Consulta[];
  loading?: boolean;
}

export const ConsultasList: React.FC<ConsultasListProps> = ({
  consultas,
  loading,
}) => {
  if (loading)
    return <p className="text-gray-600">Carregando próximas consultas...</p>;
  if (!consultas || consultas.length === 0)
    return <p className="text-gray-500">Nenhuma consulta agendada.</p>;
  return (
    <ul className="space-y-5">
      {consultas.map((consulta) => (
        <li
          key={consulta.id}
          className="py-3 flex flex-col lg:flex-row lg:items-center justify-between border border-gray-200 rounded"
        >
          <div className="flex-1">
            <div className="font-bold text-blue-800 mb-1 flex items-center gap-2">
              <User size={16} />
              {consulta.paciente?.nome || "Paciente desconhecido"}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Stethoscope size={16} />
              <span>{consulta.medico?.nome} • {consulta.medico?.especialidade}</span>
            </div>
            <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
              <Calendar size={14} />
              <span>{new Date(consulta.dataHora).toLocaleDateString("pt-BR")}</span>
              <Clock size={14} className="ml-2" />
              <span>{new Date(consulta.dataHora).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}</span>
            </div>
            {consulta.motivo && (
              <div className="text-xs text-gray-500">
                <span className="font-medium">Motivo:</span> {consulta.motivo}
              </div>
            )}
          </div>
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold mt-2 lg:mt-0 w-fit">
            {consulta.status}
          </span>
        </li>
      ))}
    </ul>
  );
};
