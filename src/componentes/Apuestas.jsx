import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Apuestas() {
  const { usuarios, partidos, apuestas, guardarApuesta } = useApp();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [scores, setScores] = useState({});
  const [guardados, setGuardados] = useState({});
  
  // Estado para el rol de administrador
  const [isAdmin, setIsAdmin] = useState(false);

  const fechasDisponibles = [...new Set(partidos.map((p) => p.fecha))].sort();

  const partidosMostrar = fechaFiltro
    ? partidos.filter((p) => p.fecha === fechaFiltro)
    : partidos;

  const getTodasLasApuestas = (partidoId) =>
    apuestas.filter(
      (a) => a.usuarioId === usuarioSeleccionado?.id && a.partidoId === partidoId
    );

  const getScore = (partidoId, side) => {
    const key = `${partidoId}-${side}`;
    if (scores[key] !== undefined) return scores[key];
    return ""; 
  };

  const setScore = (partidoId, side, val) => {
    const key = `${partidoId}-${side}`;
    setScores((prev) => ({ ...prev, [key]: val }));
    setGuardados((prev) => ({ ...prev, [partidoId]: false }));
  };

  const handleGuardar = async (partido) => {
    if (!usuarioSeleccionado) return;
    
    const gl = scores[`${partido.id}-local`] ?? "";
    const gv = scores[`${partido.id}-visitante`] ?? "";
    
    if (gl === "" || gv === "") return;
    
    try {
      await guardarApuesta(usuarioSeleccionado.id, partido.id, gl, gv);
      
      setScores((prev) => ({
        ...prev,
        [`${partido.id}-local`]: "",
        [`${partido.id}-visitante`]: ""
      }));

      setGuardados((prev) => ({ ...prev, [partido.id]: true }));
      setTimeout(() => setGuardados((prev) => ({ ...prev, [partido.id]: false })), 2000);
    } catch (error) {
      console.error("Error al guardar la apuesta:", error);
      alert("No se pudo guardar la apuesta. Intenta de nuevo.");
    }
  };

  const handleEliminarApuesta = async (apuestaId) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta apuesta del usuario?")) return;
    
    try {
      const response = await fetch(`https://apuestas-back.vercel.app/api/apuestas/${apuestaId}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        alert("Apuesta eliminada con éxito.");
        window.location.reload(); 
      } else {
        alert("No se pudo eliminar la apuesta del servidor.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const toggleAdminMode = () => {
    if (!isAdmin) {
      const pass = prompt("Introduce la contraseña de administrador:");
      if (pass === "admin123") {
        setIsAdmin(true);
      } else {
        alert("Contraseña incorrecta");
      }
    } else {
      setIsAdmin(false);
    }
  };

  return (
    <div>
      {/* Encabezado adaptado con diseño nativo flex */}
      <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div>
          <h1>Apuestas</h1>
          <p>Selecciona un usuario y registra sus predicciones de resultado</p>
        </div>
        
        {/* BOTÓN MODO ADMIN: Copia exacta de clases y variables nativas */}
        <button 
          onClick={toggleAdminMode} 
          className="btn-save"
          style={{
            whiteSpace: "nowrap",
            background: isAdmin ? "rgba(230, 57, 70, 0.1)" : "transparent",
            color: isAdmin ? "#e63946" : "var(--texto-suave)",
            border: isAdmin ? "1px solid #e63946" : "1px solid var(--borde)",
            padding: "6px 12px",
            fontSize: 12
          }}
        >
          {isAdmin ? "🔒 Salir Admin" : "🔑 Modo Admin"}
        </button>
      </div>

      {/* Alerta de aviso integrada estéticamente en una tarjeta limpia */}
      {isAdmin && (
        <div className="card" style={{ borderLeft: "4px solid #e63946", padding: "12px 16px", marginBottom: 16 }}>
          <p style={{ color: "var(--texto-principal)", fontSize: 13, margin: 0, fontWeight: "500" }}>
            ⚠️ <span style={{ color: "#e63946", fontWeight: "bold" }}>Modo Administrador Activo:</span> Puedes visualizar y remover marcadores de cualquier usuario registrado.
          </p>
        </div>
      )}

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
                    <th>Partido e Historial de Apuestas</th>
                    <th style={{ textAlign: "center" }}>Nueva Predicción</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {partidosMostrar.map((p) => {
                    const misApuestasPartidas = getTodasLasApuestas(p.id);

                    return (
                      <tr key={p.id}>
                        <td style={{ color: "var(--texto-suave)", fontSize: 12, whiteSpace: "nowrap" }}>
                          {new Date(p.fecha + "T00:00:00").toLocaleDateString("es-CO", {
                            day: "2-digit", month: "short",
                          })}
                        </td>
                        <td>
                          <div>
                            <span className="partido-nombre">{p.local}</span>
                            <span className="vs-text" style={{ margin: "0 8px" }}>vs</span>
                            <span className="partido-nombre">{p.visitante}</span>
                          </div>
                          
                          {misApuestasPartidas.length > 0 && (
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                              {misApuestasPartidas.map((ap, index) => (
                                <span 
                                  key={ap.id || ap._id || index} 
                                  style={{
                                    fontSize: "11px",
                                    padding: "4px 10px",
                                    background: "var(--bg-body, rgba(0,0,0,0.03))",
                                    borderRadius: "100px",
                                    color: "var(--texto-principal)",
                                    border: "1px solid var(--borde, rgba(0,0,0,0.08))",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px"
                                  }}
                                >
                                  Marcador #{index + 1}: <b>{ap.golesLocal} - {ap.golesVisitante}</b>
                                  
                                  {/* BOTÓN X ELIMINAR: Estilizado sutilmente en armonía */}
                                  {isAdmin && (
                                    <button
                                      onClick={() => handleEliminarApuesta(ap.id || ap._id)}
                                      style={{
                                        border: "none",
                                        background: "transparent",
                                        color: "#e63946",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        padding: "0 2px",
                                        fontSize: "13px",
                                        display: "flex",
                                        alignItems: "center",
                                        transform: "translateY(-0.5px)"
                                      }}
                                      title="Eliminar esta apuesta"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </span>
                              ))}
                            </div>
                          )}
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
                              placeholder="0"
                            />
                            <span className="score-sep">–</span>
                            <input
                              className="score-input"
                              type="number"
                              min="0"
                              max="99"
                              value={getScore(p.id, "visitante")}
                              onChange={(e) => setScore(p.id, "visitante", e.target.value)}
                              placeholder="0"
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
                    );
                  })}
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