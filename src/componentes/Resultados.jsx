function Resultados() {
  return (
    <div>
      <h1>Resultados Oficiales</h1>

      <table>
        <thead>
          <tr>
            <th>Partido</th>
            <th>Resultado</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Francia vs Senegal</td>
            <td>
              <input type="text" placeholder="3-0" />
            </td>
          </tr>
        </tbody>
      </table>

      <button>Guardar Resultado</button>
    </div>
  );
}

export default Resultados;