import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Usuarios() {
  const { usuarios, agregarUsuario } = useApp();
  const [nombre, setNombre] = useState("");

  const handleAgregar = () => {
    const trim = nombre.trim();
    if (!trim) return;
    agregarUsuario(trim);
    setNombre("");
  };

  return (
    <div>
      <div className="section-header">
        <h1>Usuarios</h1>
        <p>Registra los participantes del torneo de apuestas</p>
      </div>

      <div className="card">
        <div className="card-title">Nuevo usuario</div>
        <div className="form-row">
          <input
            className="input-field"
            type="text"
            placeholder="Nombre del usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAgregar()}
          />
          <button className="btn-primary" onClick={handleAgregar}>
            Agregar
          </button>
        </div>
      </div>

      {usuarios.length === 0 ? (
        <div className="empty-state">
          <div className="icon">👤</div>
          <p>Aún no hay usuarios. Agrega el primero arriba.</p>
        </div>
      ) : (
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={u.id}>
                  <td style={{ color: "var(--texto-suave)", width: 60 }}>{i + 1}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 30, height: 30, borderRadius: "50%",
                          background: "var(--verde)", color: "#000",
                          fontWeight: 700, fontSize: 13,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {u.nombre[0].toUpperCase()}
                      </div>
                      {u.nombre}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
