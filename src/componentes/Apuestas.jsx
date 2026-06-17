import { useState } from "react";
import { useApp } from "../context/AppContext";


export default function Apuestas() {
  const { usuarios, partidos, apuestas, guardarApuesta } = useApp();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [scores, setScores] = useState({});
  const [guardados, setGuardados] = useState({});

  const fechasDisponibles = [...new Set(partidos.map((p) => p.fecha))].sort();

  const partidosMostrar = fechaFiltro
    ? partidos.filter((p) => p.fecha === fechaFiltro)
    : partidos;

  const getApuesta = (partidoId) =>
    apuestas.find(
      (a) => a.usuarioId === usuarioSeleccionado?.id && a.partidoId === partidoId
    );

  const getScore = (partidoId, side) => {
    const key = `${partidoId}-${side}`;
    if (scores[key] !== undefined) return scores[key];
    const ap = getApuesta(partidoId);
    if (ap) return side === "local" ? ap.golesLocal : ap.golesVisitante;
    return "";
  };

  const setScore = (partidoId, side, val) => {
    const key = `${partidoId}-${side}`;
    setScores((prev) => ({ ...prev, [key]: val }));
    setGuardados((prev) => ({ ...prev, [partidoId]: false }));
  };

  const handleGuardar = (partido) => {
    if (!usuarioSeleccionado) return;
    const gl = scores[`${partido.id}-local`] ?? getApuesta(partido.id)?.golesLocal ?? "";
    const gv = scores[`${partido.id}-visitante`] ?? getApuesta(partido.id)?.golesVisitante ?? "";
    if (gl === "" || gv === "") return;
    guardarApuesta(usuarioSeleccionado.id, partido.id, gl, gv);
    setGuardados((prev) => ({ ...prev, [partido.id]: true }));
    setTimeout(() => setGuardados((prev) => ({ ...prev, [partido.id]: false })), 2000);
  };

  return (
    <div>
      <div className="section-header">
        <h1>Apuestas</h1>
        <p>Selecciona un usuario y registra sus predicciones de resultado</p>
      </div>

      <div className="card">
        <div className="card-title">Seleccionar usuario</div>
        {usuarios.length === 0 ? (
          <p style={{ color: "var(--texto-suave)", fontSize: 13 }}>
            Primero agrega usuarios en la sección Usuarios.
          </p>
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {usuarios.map((u) => (
              <div
                key={u.id}
                className={`user-chip${usuarioSeleccionado?.id === u.id ? " selected" : ""}`}
                onClick={() => {
                  setUsuarioSeleccionado(u);
                  setScores({});
                  setGuardados({});
                }}
              >
                <div className="avatar">{u.nombre[0].toUpperCase()}</div>
                {u.nombre}
              </div>
            ))}
          </div>
        )}
      </div>

      {usuarioSeleccionado && (
        <>
          <div style={{ marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 10 }}>
              Filtrar por fecha
            </div>
            <div className="chips-row">
              <div
                className={`user-chip${!fechaFiltro ? " selected" : ""}`}
                onClick={() => setFechaFiltro("")}
              >
                Todos
              </div>
              {fechasDisponibles.map((f) => (
                <div
                  key={f}
                  className={`user-chip${fechaFiltro === f ? " selected" : ""}`}
                  onClick={() => setFechaFiltro(f)}
                >
                  {new Date(f + "T00:00:00").toLocaleDateString("es-CO", {
                    day: "2-digit", month: "short",
                  })}
                </div>
              ))}
            </div>
          </div>

          {partidosMostrar.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📅</div>
              <p>No hay partidos para esta fecha.</p>
            </div>
          ) : (
            <div className="tabla-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Partido</th>
                    <th style={{ textAlign: "center" }}>Predicción</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {partidosMostrar.map((p) => (
                    <tr key={p.id}>
                      <td style={{ color: "var(--texto-suave)", fontSize: 12, whiteSpace: "nowrap" }}>
                        {new Date(p.fecha + "T00:00:00").toLocaleDateString("es-CO", {
                          day: "2-digit", month: "short",
                        })}
                      </td>
                      <td>
                        <span className="partido-nombre">{p.local}</span>
                        <span className="vs-text" style={{ margin: "0 8px" }}>vs</span>
                        <span className="partido-nombre">{p.visitante}</span>
                      </td>
                      <td>
                        <div className="score-pair" style={{ justifyContent: "center" }}>
                          <input
                            className="score-input"
                            type="number"
                            min="0"
                            max="99"
                            value={getScore(p.id, "local")}
                            onChange={(e) => setScore(p.id, "local", e.target.value)}
                          />
                          <span className="score-sep">–</span>
                          <input
                            className="score-input"
                            type="number"
                            min="0"
                            max="99"
                            value={getScore(p.id, "visitante")}
                            onChange={(e) => setScore(p.id, "visitante", e.target.value)}
                          />
                        </div>
                      </td>
                      <td>
                        {guardados[p.id] ? (
                          <span className="apuesta-saved">✓ Guardado</span>
                        ) : (
                          <button className="btn-save" onClick={() => handleGuardar(p)}>
                            Guardar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!usuarioSeleccionado && usuarios.length > 0 && (
        <div className="empty-state">
          <div className="icon">🎯</div>
          <p>Selecciona un usuario para ver y registrar sus apuestas.</p>
        </div>
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
