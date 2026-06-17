function Apuestas() {
  return (
    <div>
      <h1>Registro de Apuestas</h1>

      <select>
        <option>Juan Pablo</option>
        <option>Carlos</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Partido</th>
            <th>Local</th>
            <th>Visitante</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Francia vs Senegal</td>
            <td>
              <input type="number" />
            </td>
            <td>
              <input type="number" />
            </td>
          </tr>
        </tbody>
      </table>

      <button>Guardar Apuesta</button>
    </div>
  );
}

export default Apuestas;