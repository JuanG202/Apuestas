import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Partidos() {
  const { partidos, agregarPartido } = useApp();
  const [fecha, setFecha] = useState("");
  const [local, setLocal] = useState("");
  const [visitante, setVisitante] = useState("");

  const handleGuardar = () => {
    if (!fecha || !local.trim() || !visitante.trim()) return;
    agregarPartido({ fecha, local: local.trim(), visitante: visitante.trim() });
    setLocal("");
    setVisitante("");
  };

  const fechasUnicas = [...new Set(partidos.map((p) => p.fecha))].sort();

  return (
    <div>
      <div className="section-header">
        <h1>Partidos</h1>
        <p>Programa los partidos con fecha, equipo local y visitante</p>
      </div>

      <div className="card">
        <div className="card-title">Nuevo partido</div>
        <div className="form-row">
          <input
            className="input-field"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Equipo local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Equipo visitante"
            value={visitante}
            onChange={(e) => setVisitante(e.target.value)}
          />
          <button className="btn-primary" onClick={handleGuardar}>
            Guardar
          </button>
        </div>
      </div>

      {partidos.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📅</div>
          <p>Sin partidos programados todavía.</p>
        </div>
      ) : (
        fechasUnicas.map((f) => (
          <div key={f} className="card">
            <div className="card-title">
              {new Date(f + "T00:00:00").toLocaleDateString("es-CO", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </div>
            <div className="tabla-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Local</th>
                    <th style={{ textAlign: "center" }}>vs</th>
                    <th>Visitante</th>
                  </tr>
                </thead>
                <tbody>
                  {partidos.filter((p) => p.fecha === f).map((p) => (
                    <tr key={p.id}>
                      <td className="partido-nombre">{p.local}</td>
                      <td style={{ textAlign: "center", color: "var(--texto-suave)", fontSize: 11 }}>VS</td>
                      <td className="partido-nombre">{p.visitante}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
            <p className="created">
        Created by:{" "}
        <a href="https://elmundodelatecnologiaf.vercel.app/" target="_blank" rel="noopener noreferrer" className="created-link">
          El Mundo de la tecnología
        </a>
      </p>
    </div>
  );
}
