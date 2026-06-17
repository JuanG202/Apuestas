import { useState } from "react";
import Usuarios from "./componentes/Usuarios";
import Partidos from "./componentes/Partidos";
import Apuestas from "./componentes/Apuestas";
import Resultados from "./componentes/Resultados";
import TablaPosiciones from "./componentes/TablaPosiciones";
import "./App.css";

function App() {
  const [vista, setVista] = useState("usuarios");

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Apuestas</h2>

        <button onClick={() => setVista("usuarios")}>
          Usuarios
        </button>

        <button onClick={() => setVista("partidos")}>
          Partidos
        </button>

        <button onClick={() => setVista("apuestas")}>
          Apuestas
        </button>

        <button onClick={() => setVista("resultados")}>
          Resultados
        </button>

        <button onClick={() => setVista("tabla")}>
          Tabla
        </button>
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