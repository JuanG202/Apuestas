import { useState } from "react";
import Usuarios from "./componentes/Usuarios";
import Partidos from "./componentes/Partidos";
import Apuestas from "./componentes/Apuestas";
import Resultados from "./componentes/Resultados";
import TablaPosiciones from "./componentes/TablaPosiciones";
import "./App.css";

const NAV = [
  { id: "usuarios", label: "Usuarios", icon: "👤" },
  { id: "partidos", label: "Partidos", icon: "📅" },
  { id: "apuestas", label: "Apuestas", icon: "🎯" },
  { id: "resultados", label: "Resultados", icon: "✅" },
  { id: "tabla", label: "Tabla", icon: "🏆" },
];

function App() {
  const [vista, setVista] = useState("usuarios");

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>PRODE</h2>
          <span>Sistema de apuestas</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-btn${vista === n.id ? " active" : ""}`}
              onClick={() => setVista(n.id)}
            >
              <span className="icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="contenido">
        {vista === "usuarios" && <Usuarios />}
        {vista === "partidos" && <Partidos />}
        {vista === "apuestas" && <Apuestas />}
        {vista === "resultados" && <Resultados />}
        {vista === "tabla" && <TablaPosiciones />}
      </main>
    </div>
  );
}

export default App;
