// El equipo en curso: miembros, errores y el botón de guardar. Es un componente
// presentacional: recibe datos y funciones por props, no tiene estado ni reglas.
//
// Props:
//   equipo       { miembros: [ { id, nombre, imagen } ] }
//   max          tamaño máximo del equipo (MAX_EQUIPO)
//   errores      arreglo de textos
//   guardando    true mientras se espera a Firestore
//   onQuitar     recibe el id del Pokémon
//   onGuardar    sin argumentos
export default function Equipo({ equipo, max, errores, guardando = false, onQuitar, onGuardar }) {
  return (
    <section aria-label="Equipo">
      <h2>Mi equipo ({equipo.miembros.length} / {max})</h2>

      {equipo.miembros.length === 0 && <p>Todavía no tienes Pokémon en tu equipo.</p>}
      <ul className="equipo">
        {equipo.miembros.map((m) => (
          <li key={m.id} aria-label={m.nombre} className="miembro">
            <img src={m.imagen} alt={m.nombre} width="96" />
            <span>#{m.id} {m.nombre}</span>
            <button onClick={() => onQuitar(m.id)}>Quitar</button>
          </li>
        ))}
      </ul>

      {errores.map((mensaje) => (
        <p key={mensaje} className="error" role="alert">
          {mensaje}
        </p>
      ))}

      <button onClick={onGuardar} disabled={guardando}>
        Guardar equipo
      </button>
    </section>
  )
}
