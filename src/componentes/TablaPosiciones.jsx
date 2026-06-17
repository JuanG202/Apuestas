function TablaPosiciones() {
  const usuarios = [
    {
      nombre: "Juan Pablo",
      puntos: 12
    },
    {
      nombre: "Carlos",
      puntos: 8
    }
  ];

  return (
    <div>
      <h1>Tabla de Posiciones</h1>

      <table>
        <thead>
          <tr>
            <th>Posición</th>
            <th>Usuario</th>
            <th>Puntos</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{u.nombre}</td>
              <td>{u.puntos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPosiciones;