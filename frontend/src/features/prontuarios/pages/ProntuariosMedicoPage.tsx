import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProntuarios } from "../hooks/useProntuarios";
import { 
  FileText, 
  Search, 
  Plus, 
  Trash2,
  Calendar
} from "lucide-react";
import "../styles/ProntuariosMedicoPage.css"; 
import Loading from "@/components/common/Loading"; 

const ProntuariosMedicoPage: React.FC = () => {
  const { prontuarios, loading, error, deleteProntuario } = useProntuarios();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProntuarios = prontuarios.filter((p) => {
    const term = searchTerm.toLowerCase();
    const nome = p.paciente?.nome?.toLowerCase() || "";
    const diagnostico = p.diagnostico?.toLowerCase() || "";
    const sintomas = p.sintomas?.toLowerCase() || "";
    
    return nome.includes(term) || diagnostico.includes(term) || sintomas.includes(term);
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Certeza que deseja excluir este prontuário?")) {
      try {
        await deleteProntuario(id);
      } catch (err) {
        alert("Erro ao excluir prontuário.");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prontuários Médicos</h1>
          <p className="text-gray-500 mt-1">
            Gestão de históricos e evoluções clínicas
          </p>
        </div>
        <Link
          to="/prontuarios/novo"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm gap-2"
          style={{ paddingLeft: "25px", paddingRight: "25px", paddingTop: "5px", paddingBottom: "5px" }}
        >
          <Plus size={20} />
          Novo Prontuário
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
              placeholder="Buscar por paciente, diagnóstico ou sintomas..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 placeholder-gray-400"
              style={{ paddingLeft: "40px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden" style={{ marginTop: "15px"}}>
        {filteredProntuarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50/50">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Nenhum prontuário encontrado
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Tente ajustar sua busca ou cadastre um novo registro.
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
                    Paciente
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Diagnóstico
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sintomas
                  </th>
                  <th className="py-5 px-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProntuarios.map((prontuario) => (
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
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold text-xs">
                            {prontuario.paciente?.nome?.charAt(0).toUpperCase() || "P"}
                         </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {prontuario.paciente?.nome || "Paciente não identificado"}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            CNS: {prontuario.paciente?.cartaoSus || "Não informado"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {prontuario.diagnostico}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <div className="max-w-[200px] truncate text-gray-600 text-sm" title={prontuario.sintomas}>
                        {prontuario.sintomas || "—"}
                      </div>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDelete(prontuario.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                          title="Excluir Prontuário"
                        >
                          <Trash2 size={18} />
                        </button>
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

export default ProntuariosMedicoPage;
