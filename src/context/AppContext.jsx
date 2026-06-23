import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

// Detecta si estás en entorno local o en producción (Vercel)
const API_URL = window.location.hostname === "localhost" 
  ? "https://apuestas-back.vercel.app/api" 
  : "https://apuestas-back.vercel.app/api";

export function AppProvider({ children }) {
  const [usuarios, setUsuarios] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [apuestas, setApuestas] = useState([]);
  const [resultados, setResultados] = useState([]);

  // CARGAR DATOS DESDE EL BACKEND AL INICIAR LA APP
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [resUsr, resPar, resApu, resRes] = await Promise.all([
          fetch(`${API_URL}/usuarios`),
          fetch(`${API_URL}/partidos`),
          fetch(`${API_URL}/apuestas`),
          fetch(`${API_URL}/resultados`)
        ]);

        if (resUsr.ok) setUsuarios(await resUsr.json());
        if (resPar.ok) setPartidos(await resPar.json());
        if (resApu.ok) setApuestas(await resApu.json());
        if (resRes.ok) setResultados(await resRes.json());
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      }
    };

    cargarDatosIniciales();
  }, []);

  // Guarda en MongoDB en vez de usar un ID local temporal
  const agregarUsuario = async (nombre) => {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    if (!response.ok) throw new Error("Error al guardar el usuario");
    const nuevoUsuario = await response.json();
    setUsuarios((prev) => [...prev, nuevoUsuario]);
  };

  // Guarda en MongoDB en vez de usar un ID local temporal
  const agregarPartido = async (partido) => {
    const response = await fetch(`${API_URL}/partidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partido),
    });
    if (!response.ok) throw new Error("Error al guardar el partido");
    const nuevoPartido = await response.json();
    setPartidos((prev) => [...prev, nuevoPartido]);
  };

  // CORREGIDO: Ahora agrega CADA apuesta nueva directamente al estado sin sustituirla
  const guardarApuesta = async (usuarioId, partidoId, golesLocal, golesVisitante) => {
    const response = await fetch(`${API_URL}/apuestas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId, partidoId, golesLocal, golesVisitante }),
    });
    if (!response.ok) throw new Error("Error al guardar la apuesta");
    const apuestaGuardada = await response.json();

    // ✨ SOLUCIÓN AQUÍ: Ya no buscamos si existe previamente para pisarla.
    // Retornamos directamente un arreglo que clona las anteriores y añade la nueva apuesta.
    setApuestas((prev) => [...prev, apuestaGuardada]);
  };

  // Usa la ruta Upsert de Mongoose para resultados oficiales
  const guardarResultado = async (partidoId, golesLocal, golesVisitante) => {
    const response = await fetch(`${API_URL}/resultados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partidoId, golesLocal, golesVisitante }),
    });
    if (!response.ok) throw new Error("Error al guardar el resultado");
    const resultadoGuardado = await response.json();

    setResultados((prev) => {
      const existe = prev.findIndex((r) => String(r.partidoId) === String(partidoId));
      if (existe >= 0) {
        const copia = [...prev];
        copia[existe] = resultadoGuardado;
        return copia;
      }
      return [...prev, resultadoGuardado];
    });
  };

  const getPartidosByFecha = (fecha) =>
    partidos.filter((p) => p.fecha === fecha);

  const getApuestasByUsuario = (usuarioId) =>
    apuestas.filter((a) => String(a.usuarioId) === String(usuarioId));

  // Garantizamos la equivalencia exacta de tipos (Mongoose IDs como Strings)
  const getAcertadores = (partidoId) => {
    const resultado = resultados.find((r) => String(r.partidoId) === String(partidoId));
    if (!resultado) return [];
    return apuestas
      .filter(
        (a) =>
          String(a.partidoId) === String(partidoId) &&
          Number(a.golesLocal) === Number(resultado.golesLocal) &&
          Number(a.golesVisitante) === Number(resultado.golesVisitante)
      )
      .map((a) => usuarios.find((u) => String(u.id) === String(a.usuarioId)))
      .filter(Boolean);
  };

  // Cálculo exacto de puntuaciones procesando la data de MongoDB
  const getPuntosPorUsuario = () => {
    return usuarios.map((u) => {
      const pts = resultados.reduce((acc, r) => {
        // Nota: Como ahora permites múltiples apuestas por partido, .find() tomará 
        // la primera para el cálculo del puntaje global.
        const apuesta = apuestas.find(
          (a) => String(a.usuarioId) === String(u.id) && String(a.partidoId) === String(r.partidoId)
        );
        if (!apuesta) return acc;
        
        const al = Number(apuesta.golesLocal);
        const av = Number(apuesta.golesVisitante);
        const rl = Number(r.golesLocal);
        const rv = Number(r.golesVisitante);

        if (al === rl && av === rv) return acc + 3;
        
        const ganadorReal = rl > rv ? "local" : rv > rl ? "visitante" : "empate";
        const ganadorApuesta = al > av ? "local" : av > al ? "visitante" : "empate";
        
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