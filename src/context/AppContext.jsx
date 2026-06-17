import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [usuarios, setUsuarios] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [apuestas, setApuestas] = useState([]);
  const [resultados, setResultados] = useState([]);

  const agregarUsuario = (nombre) => {
    setUsuarios((prev) => [...prev, { id: Date.now(), nombre }]);
  };

  const agregarPartido = (partido) => {
    setPartidos((prev) => [...prev, { id: Date.now(), ...partido }]);
  };

  const guardarApuesta = (usuarioId, partidoId, golesLocal, golesVisitante) => {
    setApuestas((prev) => {
      const existe = prev.findIndex(
        (a) => a.usuarioId === usuarioId && a.partidoId === partidoId
      );
      const nueva = { usuarioId, partidoId, golesLocal: Number(golesLocal), golesVisitante: Number(golesVisitante) };
      if (existe >= 0) {
        const copia = [...prev];
        copia[existe] = nueva;
        return copia;
      }
      return [...prev, nueva];
    });
  };

  const guardarResultado = (partidoId, golesLocal, golesVisitante) => {
    setResultados((prev) => {
      const existe = prev.findIndex((r) => r.partidoId === partidoId);
      const nuevo = { partidoId, golesLocal: Number(golesLocal), golesVisitante: Number(golesVisitante) };
      if (existe >= 0) {
        const copia = [...prev];
        copia[existe] = nuevo;
        return copia;
      }
      return [...prev, nuevo];
    });
  };

  const getPartidosByFecha = (fecha) =>
    partidos.filter((p) => p.fecha === fecha);

  const getApuestasByUsuario = (usuarioId) =>
    apuestas.filter((a) => a.usuarioId === usuarioId);

  const getAcertadores = (partidoId) => {
    const resultado = resultados.find((r) => r.partidoId === partidoId);
    if (!resultado) return null;
    return apuestas
      .filter(
        (a) =>
          a.partidoId === partidoId &&
          a.golesLocal === resultado.golesLocal &&
          a.golesVisitante === resultado.golesVisitante
      )
      .map((a) => usuarios.find((u) => u.id === a.usuarioId))
      .filter(Boolean);
  };

  const getPuntosPorUsuario = () => {
    return usuarios.map((u) => {
      const pts = resultados.reduce((acc, r) => {
        const apuesta = apuestas.find(
          (a) => a.usuarioId === u.id && a.partidoId === r.partidoId
        );
        if (!apuesta) return acc;
        if (apuesta.golesLocal === r.golesLocal && apuesta.golesVisitante === r.golesVisitante)
          return acc + 3;
        const ganadorReal = r.golesLocal > r.golesVisitante ? "local" : r.golesVisitante > r.golesLocal ? "visitante" : "empate";
        const ganadorApuesta = apuesta.golesLocal > apuesta.golesVisitante ? "local" : apuesta.golesVisitante > apuesta.golesLocal ? "visitante" : "empate";
        if (ganadorReal === ganadorApuesta) return acc + 1;
        return acc;
      }, 0);
      return { ...u, puntos: pts };
    }).sort((a, b) => b.puntos - a.puntos);
  };

  return (
    <AppContext.Provider
      value={{
        usuarios,
        partidos,
        apuestas,
        resultados,
        agregarUsuario,
        agregarPartido,
        guardarApuesta,
        guardarResultado,
        getPartidosByFecha,
        getApuestasByUsuario,
        getAcertadores,
        getPuntosPorUsuario,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
