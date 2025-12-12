import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useConsultas } from "../hooks/useConsultas";
import { medicosService } from "../../../services/endpoints/medicos.service";
import { pacientesService } from "../../../services/endpoints/pacientes.service";
import { Medico } from "@/types/medico.types";
import { Paciente } from "@/types/paciente.types";
import "../styles/AgendarConsultaPage.css";

const agendarSchema = z.object({
  pacienteId: z.string().min(1, "Selecione um paciente"),
  medicoId: z.string().min(1, "Selecione um médico"),
  dataHora: z.string().min(1, "Selecione data e hora"),
  motivo: z.string().min(1, "Informe o motivo da consulta"),
  observacoes: z.string().optional(),
});

type AgendarFormData = z.infer<typeof agendarSchema>;

const AgendarConsultaPage: React.FC = () => {
  const navigate = useNavigate();
  const { create } = useConsultas();
  const [medicos, setMedicos] = React.useState<Medico[]>([]);
  const [pacientes, setPacientes] = React.useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AgendarFormData>({
    resolver: zodResolver(agendarSchema),
  });

  React.useEffect(() => {
     const userStr = localStorage.getItem("user");
     const user = userStr ? JSON.parse(userStr) : null;
     
     if (user?.tipo === "PACIENTE") {
         const pid = user?.paciente?.id || user?.perfil?.id;
         if(pid) setValue("pacienteId", pid);
     } else if (user?.tipo === "MEDICO") {
         const mid = user?.medico?.id || user?.perfil?.id;
         if(mid) setValue("medicoId", mid);
     }
  }, [setValue]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const isPaciente = user?.tipo === "PACIENTE";
        const pacienteId = user?.paciente?.id || user?.perfil?.id;

        const isMedico = user?.tipo === "MEDICO";
        const medicoId = user?.medico?.id || user?.perfil?.id;

        if (isPaciente && pacienteId) {
          const medicosData = await medicosService.getAll();
          setMedicos(medicosData);
          setPacientes([{ id: pacienteId, nome: user.nome || user.perfil?.nome || "Você" } as Paciente]);
        } else if (isMedico && medicoId) {
           const pacientesData = await pacientesService.getAll();
           setPacientes(pacientesData);
           setMedicos([{
               id: medicoId,
               nome: user.nome || user.perfil?.nome || "Você",
               crm: user.medico?.crm || "",
               especialidade: user.medico?.especialidade || "",
               email: user.email || "",
               criadoEm: new Date(),
               atualizadoEm: new Date()
           } as Medico]);
        } else {
          const [medicosData, pacientesData] = await Promise.all([
            medicosService.getAll(),
            pacientesService.getAll(),
          ]);
          setMedicos(medicosData);
          setPacientes(pacientesData);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    loadData();
  }, []);

  const onSubmit = async (data: AgendarFormData) => {
    try {
      setIsLoading(true);
      await create({
        pacienteId: data.pacienteId,
        medicoId: data.medicoId,
        dataHora: new Date(data.dataHora).toISOString(),
        motivo: data.motivo,
        observacoes: data.observacoes,
      });
    } catch (err) {
      console.error("Erro ao agendar consulta:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="agendar-consulta-page">
      <h1>Agendar Consulta</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="agendar-form">
        <div className="form-group">
          <label htmlFor="pacienteId">Paciente *</label>
          <select
            id="pacienteId"
            {...register("pacienteId")}
            className={errors.pacienteId ? "input-error" : ""}
          >
            <option value="">Selecione um paciente</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
          {errors.pacienteId && (
            <span className="field-error">{errors.pacienteId.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="medicoId">Médico *</label>
          <select
            id="medicoId"
            {...register("medicoId")}
            className={errors.medicoId ? "input-error" : ""}
          >
            <option value="">Selecione um médico</option>
            {medicos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
          {errors.medicoId && (
            <span className="field-error">{errors.medicoId.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="dataHora">Data e Hora *</label>
          <input
            id="dataHora"
            type="datetime-local"
            {...register("dataHora")}
            className={errors.dataHora ? "input-error" : ""}
          />
          {errors.dataHora && (
            <span className="field-error">{errors.dataHora.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="motivo">Motivo *</label>
          <input
            id="motivo"
            type="text"
            placeholder="Ex: Consulta de rotina, Dor de cabeça..."
            {...register("motivo")}
            className={errors.motivo ? "input-error" : ""}
          />
          {errors.motivo && (
            <span className="field-error">{errors.motivo.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="observacoes">Descrição</label>
          <textarea
            id="observacoes"
            rows={4}
            placeholder="Motivo da consulta, sintomas, etc..."
            {...register("observacoes")}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/consultas")}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="btn btn-primary"
          >
            {isSubmitting || isLoading ? "Agendando..." : "Agendar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgendarConsultaPage;
