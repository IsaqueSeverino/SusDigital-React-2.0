import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm";
import { useAuth } from "@/context/useAuth";
import "./AuthPages.css";

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-page register-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>SUS Digital</h1>
          <h2>Criar Conta</h2>
          <RegisterForm />
          <p className="auth-footer">
            Já tem conta? <Link to="/login">Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
