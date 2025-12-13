import React, { useState } from "react";
import { useProntuarios } from "../hooks/useProntuarios";
import { 
  FileText, 
  Search, 
  Calendar,
  Activity
} from "lucide-react";
import "../styles/ProntuariosPacientePage.css";

const ProntuariosPacientePage: React.FC = () => {
  const { prontuarios, loading, error } = useProntuarios();
  const [searchTerm, setSearchTerm] = useState("");

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const pacienteId = user?.perfil?.id || user?.paciente?.id;

  const meusProntuarios = prontuarios.filter((p) => {
    if (pacienteId && p.pacienteId !== pacienteId) {
      return false;
    }

    const term = searchTerm.toLowerCase();
    const diagnostico = p.diagnostico?.toLowerCase() || "";
    const sintomas = p.sintomas?.toLowerCase() || "";
    const tratamento = p.tratamento?.toLowerCase() || "";
    
    return diagnostico.includes(term) || sintomas.includes(term) || tratamento.includes(term);
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Meus Prontuários</h1>
          <p className="text-gray-500 mt-1">
            Meu histórico médico e evoluções clínicas
          </p>
        </div>
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
              placeholder="Buscar por diagnóstico, sintomas ou tratamento..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 placeholder-gray-400"
              style={{ paddingLeft: "40px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden" style={{ marginTop: "15px"}}>
        {meusProntuarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50/50">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Nenhum registro encontrado
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Você ainda não possui histórico de prontuários registrado.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto" style={{ padding: "10px"}}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Diagnóstico
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sintomas
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tratamento
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Observações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {meusProntuarios.map((prontuario) => (
                  <tr
                    key={prontuario.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="font-medium">
                          {new Date(prontuario.data).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {prontuario.diagnostico || "—"}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <div className="max-w-[200px] truncate text-gray-600 text-sm" title={prontuario.sintomas}>
                        {prontuario.sintomas || "—"}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="max-w-[200px] truncate text-gray-600 text-sm" title={prontuario.tratamento}>
                        {prontuario.tratamento || "—"}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="max-w-[200px] truncate text-gray-500 text-sm" title={prontuario.observacoes}>
                        {prontuario.observacoes || "—"}
                      </div>
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

export default ProntuariosPacientePage;
