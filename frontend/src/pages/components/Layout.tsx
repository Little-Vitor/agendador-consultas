import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Layout({ children }: { children: ReactNode }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="layout">
      <header className="topbar">
        <span className="brand">Agendador de Consultas</span>
        <nav>
          <NavLink to="/consultas">Consultas</NavLink>
          <NavLink to="/medicos">Médicos</NavLink>
          <NavLink to="/pacientes">Pacientes</NavLink>
        </nav>
        <div className="user-info">
          <span>
            {usuario?.nome} ({usuario?.role})
          </span>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
