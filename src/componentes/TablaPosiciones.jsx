/*import { useApp } from "../context/AppContext";

export default function TablaPosiciones() {
  const { getPuntosPorUsuario, resultados, apuestas } = useApp();
  const ranking = getPuntosPorUsuario();

  const posClass = (i) => {
    if (i === 0) return "gold";
    if (i === 1) return "silver";
    if (i === 2) return "bronze";
    return "";
  };

  const medal = (i) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return i + 1;
  };

  const partidosConResultado = resultados.length;

  return (
    <div>
      <div className="section-header">
        <h1>Tabla de Posiciones</h1>
        <p>
          {partidosConResultado === 0
            ? "Aún no hay resultados registrados"
            : `Basado en ${partidosConResultado} partido${partidosConResultado > 1 ? "s" : ""} con resultado — 3 pts por marcador exacto, 1 pt por resultado correcto`}
        </p>
      </div>

      {ranking.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🏆</div>
          <p>Agrega usuarios y registra apuestas para ver la tabla.</p>
        </div>
      ) : (
        <div className="card">
          {ranking.map((u, i) => {
            // Se garantiza la comparación limpia de IDs que provee el backend
            const misApuestas = apuestas.filter((a) => String(a.usuarioId) === String(u.id));
            const exactos = resultados.filter((r) => {
              const ap = misApuestas.find((a) => String(a.partidoId) === String(r.partidoId));
              return ap && Number(ap.golesLocal) === Number(r.golesLocal) && Number(ap.golesVisitante) === Number(r.golesVisitante);
            }).length;

            return (
              <div key={u.id} className="ranking-row">
                <div className={`ranking-pos ${posClass(i)}`}>
                  {typeof medal(i) === "string" ? medal(i) : <span style={{ fontSize: 16 }}>{medal(i)}</span>}
                </div>
                <div
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: i === 0 ? "var(--dorado)" : "var(--superficie2)",
                    color: i === 0 ? "#000" : "var(--texto)",
                    fontWeight: 700, fontSize: 14,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid var(--borde)",
                  }}
                >
                  {u.nombre[0].toUpperCase()}
                </div>
                <div className="ranking-name">
                  {u.nombre}
                  {exactos > 0 && (
                    <span style={{ marginLeft: 8, fontSize: 11, color: "var(--verde)", fontWeight: 400 }}>
                      {exactos} exacto{exactos > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="ranking-pts">
                  {u.puntos}<span>pts</span>
                </div>
              </div>
            );
          })}
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
}*/