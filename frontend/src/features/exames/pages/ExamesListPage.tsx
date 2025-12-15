import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useExames } from "../hooks/useExames";
import { 
  TestTube, 
  Search, 
  Plus, 
  Trash2,
  Calendar
} from "lucide-react";
import "../styles/ExamesListPage.css";
import Loading from "@/components/common/Loading";

const ExamesListPage: React.FC = () => {
  const { exames, loading, error, deleteExame } = useExames();
  const [searchTerm, setSearchTerm] = useState("");

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const pacienteId = user?.perfil?.id || user?.paciente?.id;

  const examesFiltrados = exames.filter((exame) => {
    if (pacienteId && exame.consulta && exame.consulta.pacienteId !== pacienteId && user?.tipo === 'PACIENTE') {
        return false; 
    }

    const term = searchTerm.toLowerCase();
    const nome = exame.nome?.toLowerCase() || "";
    const tipo = exame.tipo?.toLowerCase() || "";
    const medicoNome = exame.consulta?.medico?.nome?.toLowerCase() || "";
    
    return nome.includes(term) || tipo.includes(term) || medicoNome.includes(term);
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Certeza que deseja excluir este exame?")) {
      try {
        await deleteExame(id);
      } catch (err) {
        alert("Erro ao excluir exame.");
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
          <h1 className="text-2xl font-bold text-gray-900">Exames Laboratoriais</h1>
          <p className="text-gray-500 mt-1">
            Gestão de pedidos e resultados de exames
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
              placeholder="Buscar por nome do exame, tipo ou médico..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 placeholder-gray-400"
              style={{ paddingLeft: "40px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden" style={{ marginTop: "15px"}}>
        {examesFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50/50">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <TestTube className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Nenhum exame encontrado
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Seus exames e resultados aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto" style={{ padding: "10px"}}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Exame
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="py-5 px-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {examesFiltrados.map((exame) => (
                  <tr
                    key={exame.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <TestTube size={18} />
                         </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {exame.nome}
                          </div>
                          {exame.consulta?.medico?.nome && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              Solicitado por: {exame.consulta.medico.nome}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {exame.tipo}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="font-medium">
                          {new Date(exame.dataExame).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="max-w-[200px] truncate text-gray-600 text-sm" title={exame.resultado}>
                        {exame.resultado || (
                          <span className="text-yellow-600 text-xs bg-yellow-50 px-2 py-1 rounded">Pendente</span>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDelete(exame.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                          title="Excluir Exame"
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

export default ExamesListPage;
