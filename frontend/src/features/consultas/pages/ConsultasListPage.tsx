import React, { useState } from "react";
import { useConsultas } from "../hooks/useConsultas";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  User, 
  Search, 
  Filter, 
  Plus, 
  Trash2,
  MoreVertical
} from "lucide-react";
import "../styles/ConsultasList.css";

const ConsultasListPage: React.FC = () => {
  const { consultas, loading, error, remove } = useConsultas();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");

  const filteredConsultas = consultas.filter((consulta) => {
    const matchesSearch =
      consulta.paciente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.medico?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "TODOS" || consulta.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Certeza que deseja excluir esta consulta?")) {
      try {
        await remove(id);
      } catch (err) {
        alert("Erro ao excluir consulta.");
      }
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Consultas</h1>
          <p className="text-gray-500 mt-1">
            Gerencie agendamentos e histórico de atendimentos
          </p>
        </div>
        <Link
          to="/consultas/agendar"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm gap-2"
          style={{ paddingLeft: "25px", paddingRight: "25px", paddingTop: "5px", paddingBottom: "5px" }}
        >
          <Plus size={20} />
          Nova Consulta
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-xs">
          <p className="text-red-700 font-medium">Erro ao carregar dados</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      <div className="rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative border border-gray-200 rounded-lg p-2">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por paciente, médico ou ID..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 placeholder-gray-400"
              style={{ paddingLeft: "40px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64 relative border border-gray-200 rounded-lg p-2">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 placeholder-gray-400"
              style={{ paddingLeft: "35px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="TODOS">Todos os Status</option>
              <option value="AGENDADA">Agendada</option>
              <option value="CONFIRMADA">Confirmada</option>
              <option value="REALIZADA">Realizada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden" style={{ marginTop: "15px"}}>
        {filteredConsultas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50/50">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Nenhuma consulta encontrada
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Tente ajustar seus filtros de busca ou agende uma nova consulta.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto" style={{ padding: "10px"}}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Médico
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Data e Hora
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Motivo
                  </th>
                  <th className="py-5 px-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredConsultas.map((consulta) => (
                  <tr
                    key={consulta.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {consulta.paciente?.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {consulta.paciente?.nome}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            SUS: {consulta.paciente?.cartaoSus}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-3">
                        <Stethoscope size={16} className="text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            Dr(a). {consulta.medico?.nome}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {consulta.medico?.especialidade}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="font-medium">
                            {new Date(consulta.dataHora).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Clock size={14} className="text-gray-400" />
                          <span>
                            {new Date(consulta.dataHora).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          consulta.status
                        )}`}
                      >
                        {consulta.status.charAt(0).toUpperCase() +
                          consulta.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <div className="max-w-[200px] truncate text-gray-600 text-sm" title={consulta.motivo}>
                        {consulta.motivo || "—"}
                      </div>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <button 
                        onClick={() => handleDelete(consulta.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                        title="Excluir Consulta"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultasListPage;
