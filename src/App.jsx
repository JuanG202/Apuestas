import { useState } from "react";
import Usuarios from "./componentes/Usuarios";
import Partidos from "./componentes/Partidos";
import Apuestas from "./componentes/Apuestas";
import Resultados from "./componentes/Resultados";
import TablaPosiciones from "./componentes/TablaPosiciones";
import { AppProvider } from "./context/AppContext";
import "./App.css";

const NAV = [
  { id: "usuarios", label: "Usuarios", icon: "👤" },
  { id: "partidos", label: "Partidos", icon: "📅", privado: true }, // Marcado como privado
  { id: "resultados", label: "Resultados", icon: "✅", privado: true }, // Marcado como privado
  { id: "apuestas", label: "Apuestas", icon: "🎯" },
  { id: "tabla", label: "Tabla", icon: "🏆" },
];

function App() {
  const [vista, setVista] = useState("usuarios");
  const [isAdmin, setIsAdmin] = useState(false); // Estado para saber si ya puso la contraseña

  // Contraseña requerida para ingresar (Cámbiala por la que gustes)
  const PASSWORD_CORRECTA = "Admin123"; 

  const handleNavegacion = (nodo) => {
    // Si la vista es privada y el usuario no está autenticado como Admin...
    if (nodo.privado && !isAdmin) {
      const pass = prompt("🔑 Introduce la contraseña de administrador para acceder:");
      
      if (pass === PASSWORD_CORRECTA) {
        setIsAdmin(true);
        setVista(nodo.id);
      } else if (pass !== null) {
        alert("❌ Contraseña incorrecta. Acceso denegado.");
      }
      // Si presiona 'Cancelar', simplemente no hace nada.
    } else {
      // Si no es privada o ya está autenticado, navega normalmente
      setVista(nodo.id);
    }
  };

  return (
    <AppProvider>
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
                onClick={() => handleNavegacion(n)} // Nueva función que controla el acceso
              >
                <span className="icon">
                  {n.icon}
                  {n.privado && !isAdmin && <span style={{ fontSize: 10, marginLeft: 4 }}>🔒</span>}
                </span>
                <span>{n.label}</span>
              </button>
            ))}
          </nav>
          
          {/* Botón opcional para cerrar sesión de administrador si ya ingresó */}
          {isAdmin && (
            <button 
              className="nav-btn" 
              style={{ marginTop: "auto", color: "var(--rojo)", borderTop: "1px solid var(--borde)" }}
              onClick={() => {
                setIsAdmin(false);
                setVista("usuarios");
                alert("Sesión de administrador cerrada.");
              }}
            >
              <span className="icon">🔓</span>
              <span>Bloquear Paneles</span>
            </button>
          )}
        </aside>
        <main className="contenido">
          {vista === "usuarios" && <Usuarios />}
          {vista === "partidos" && <Partidos />}
          {vista === "apuestas" && <Apuestas />}
          {vista === "resultados" && <Resultados />}
          {vista === "tabla" && <TablaPosiciones />}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;