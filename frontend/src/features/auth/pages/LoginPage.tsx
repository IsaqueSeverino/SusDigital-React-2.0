import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "@/context/useAuth";
import "./AuthPages.css";

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-page login-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>SUS Digital</h1>
          <h2>Fazer Login</h2>
          <LoginForm />
          <p className="auth-footer">
            Não tem conta? <Link to="/register">Registre-se aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
