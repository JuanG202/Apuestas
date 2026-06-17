import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Resultados() {
  const { partidos, resultados, guardarResultado, getAcertadores, apuestas } = useApp();
  const [scores, setScores] = useState({});
  const [guardados, setGuardados] = useState({});

  const getResultado = (partidoId) =>
    resultados.find((r) => r.partidoId === partidoId);

  const getVal = (partidoId, side) => {
    const key = `${partidoId}-${side}`;
    if (scores[key] !== undefined) return scores[key];
    const r = getResultado(partidoId);
    if (r) return side === "local" ? r.golesLocal : r.golesVisitante;
    return "";
  };

  const setVal = (partidoId, side, val) => {
    const key = `${partidoId}-${side}`;
    setScores((prev) => ({ ...prev, [key]: val }));
    setGuardados((prev) => ({ ...prev, [partidoId]: false }));
  };

  const handleGuardar = (p) => {
    const gl = scores[`${p.id}-local`] ?? getResultado(p.id)?.golesLocal ?? "";
    const gv = scores[`${p.id}-visitante`] ?? getResultado(p.id)?.golesVisitante ?? "";
    if (gl === "" || gv === "") return;
    guardarResultado(p.id, gl, gv);
    setGuardados((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setGuardados((prev) => ({ ...prev, [p.id]: false })), 2000);
  };

  if (partidos.length === 0) {
    return (
      <div>
        <div className="section-header">
          <h1>Resultados</h1>
          <p>Ingresa los resultados oficiales de cada partido</p>
        </div>
        <div className="empty-state">
          <div className="icon">✅</div>
          <p>Primero programa partidos en la sección Partidos.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h1>Resultados</h1>
        <p>Ingresa el resultado oficial y ve quién acertó</p>
      </div>

      {partidos.map((p) => {
        const resultado = getResultado(p.id);
        const acertadores = resultado ? getAcertadores(p.id) : null;
        const totalApuestasPartido = apuestas.filter(a => a.partidoId === p.id).length;

        return (
          <div key={p.id} className="resultado-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div className="partido-fecha-badge">
                  {new Date(p.fecha + "T00:00:00").toLocaleDateString("es-CO", {
                    weekday: "short", day: "2-digit", month: "short",
                  })}
                </div>
                <div className="partido-label">
                  {p.local} <span style={{ color: "var(--texto-suave)", fontSize: 13, fontWeight: 400 }}>vs</span> {p.visitante}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {resultado ? (
                  <div className="resultado-official">
                    {resultado.golesLocal} <span style={{ color: "var(--texto-suave)", fontSize: 18 }}>–</span> {resultado.golesVisitante}
                  </div>
                ) : null}
                <div className="score-pair">
                  <input
                    className="score-input"
                    type="number" min="0" max="99"
                    value={getVal(p.id, "local")}
                    onChange={(e) => setVal(p.id, "local", e.target.value)}
                    placeholder="0"
                  />
                  <span className="score-sep">–</span>
                  <input
                    className="score-input"
                    type="number" min="0" max="99"
                    value={getVal(p.id, "visitante")}
                    onChange={(e) => setVal(p.id, "visitante", e.target.value)}
                    placeholder="0"
                  />
                </div>
                {guardados[p.id] ? (
                  <span className="apuesta-saved">✓ Guardado</span>
                ) : (
                  <button className="btn-save" onClick={() => handleGuardar(p)}>
                    {resultado ? "Actualizar" : "Guardar"}
                  </button>
                )}
              </div>
            </div>

            {resultado && (
              <div className="acertadores">
                <div className="acertadores-title">
                  🎯 Acertaron el marcador exacto
                  {totalApuestasPartido > 0 && (
                    <span style={{ marginLeft: 8, color: "var(--texto-suave)", fontWeight: 400 }}>
                      ({acertadores.length} de {totalApuestasPartido} participantes)
                    </span>
                  )}
                </div>
                {acertadores.length === 0 ? (
                  <span className="badge-none">Nadie acertó el resultado exacto</span>
                ) : (
                  acertadores.map((u) => (
                    <span key={u.id} className="badge-win">
                      <span>{u.nombre[0].toUpperCase()}</span>
                      {u.nombre}
                    </span>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

