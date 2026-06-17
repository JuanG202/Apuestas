import { useState } from "react";

function Usuarios() {
  const [nombre, setNombre] = useState("");

  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Juan Pablo" }
  ]);

  const agregarUsuario = () => {
    if (!nombre) return;

    setUsuarios([
      ...usuarios,
      {
        id: Date.now(),
        nombre
      }
    ]);

    setNombre("");
  };

  return (
    <div>
      <h1>Usuarios</h1>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <button onClick={agregarUsuario}>
        Agregar
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;