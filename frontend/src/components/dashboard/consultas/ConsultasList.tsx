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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "AGENDADA":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CONFIRMADA":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "REALIZADA":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELADA":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  if (loading)
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex items-center p-4 border rounded-lg bg-gray-50">
            <div className="h-10 w-10 bg-gray-200 rounded-full mr-4"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );

  if (!consultas || consultas.length === 0)
    return (
      <div className="text-center pt-8 pb-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <Calendar className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        <p className="text-gray-500 font-medium">Nenhuma consulta agendada.</p>
        <p className="text-xs text-gray-400 mt-1">As próximas consultas aparecerão aqui.</p>
      </div>
    );

  return (
    <ul className="space-y-6">
      {consultas.map((consulta) => (
        <li
          key={consulta.id}
          className="group hover:bg-gray-50 transition-all duration-200 p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <User size={20} />
                </div>
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-base font-semibold text-gray-900 truncate">
                    {consulta.paciente?.nome || "Paciente desconhecido"}
                  </h4>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Stethoscope size={14} className="mr-1.5 text-gray-400" />
                    <span className="truncate">
                      {consulta.medico?.nome} <span className="text-gray-300 mx-1">•</span> {consulta.medico?.especialidade}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={13} className="mr-1.5 text-gray-400" />
                      {new Date(consulta.dataHora).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1.5 text-gray-400" />
                      {new Date(consulta.dataHora).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                {consulta.motivo && (
                  <div className="mt-3 text-xs bg-gray-50 px-3 py-2 rounded border border-gray-100 text-gray-600 inline-block max-w-full truncate">
                    <span className="font-medium text-gray-700">Motivo:</span> {consulta.motivo}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Status */}
            <div className="flex-shrink-0 self-start sm:self-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                  consulta.status
                )}`}
              >
                {getStatusLabel(consulta.status)}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
