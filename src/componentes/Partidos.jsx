import { useState } from "react";

function Partidos() {
  const [fecha, setFecha] = useState("");
  const [local, setLocal] = useState("");
  const [visitante, setVisitante] = useState("");

  const [partidos, setPartidos] = useState([]);

  const guardarPartido = () => {
    setPartidos([
      ...partidos,
      {
        id: Date.now(),
        fecha,
        local,
        visitante
      }
    ]);

    setFecha("");
    setLocal("");
    setVisitante("");
  };

  return (
    <div>
      <h1>Partidos</h1>

      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <input
        type="text"
        placeholder="Equipo Local"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      />

      <input
        type="text"
        placeholder="Equipo Visitante"
        value={visitante}
        onChange={(e) => setVisitante(e.target.value)}
      />

      <button onClick={guardarPartido}>
        Guardar
      </button>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Local</th>
            <th>Visitante</th>
          </tr>
        </thead>

        <tbody>
          {partidos.map((p) => (
            <tr key={p.id}>
              <td>{p.fecha}</td>
              <td>{p.local}</td>
              <td>{p.visitante}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Partidos;