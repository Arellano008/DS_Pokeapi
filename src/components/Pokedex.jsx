// Lista de Pokémon con buscador y paginación. Es un componente presentacional:
// recibe datos y funciones por props, no tiene estado ni reglas.
//
// Props:
//   pokemon         arreglo de { id, nombre, imagen, tipos, altura, peso }
//   cargando        true mientras se piden datos a la PokeAPI
//   error           texto del error, o null
//   texto           lo escrito en el buscador
//   consulta        la búsqueda activa ('' = se ve la lista)
//   offset, total, limite   datos de la paginación
//   enEquipo        función que recibe un id y dice si ya está en el equipo
//   lleno           true si el equipo ya no acepta más
//   onCambiarTexto  recibe el texto del buscador
//   onBuscar        recibe el evento submit del formulario
//   onLimpiar, onAnterior, onSiguiente   sin argumentos
//   onAgregar       recibe el Pokémon completo
export default function Pokedex({
  pokemon, cargando, error, texto, consulta, offset, total, limite, enEquipo, lleno,
  onCambiarTexto, onBuscar, onLimpiar, onAnterior, onSiguiente, onAgregar,
}) {
  return (
    <section aria-label="Pokédex">
      <form className="buscador" onSubmit={onBuscar}>
        <label>
          Buscar Pokémon{' '}
          <input
            value={texto}
            onChange={(ev) => onCambiarTexto(ev.target.value)}
            placeholder="Nombre o número (ej. pikachu o 25)"
          />
        </label>
        <button type="submit">Buscar</button>
        {consulta && <button type="button" onClick={onLimpiar}>Ver lista</button>}
      </form>

      {!consulta && (
        <nav className="paginas" aria-label="Páginas">
          <button onClick={onAnterior} disabled={offset === 0 || cargando}>
            <span aria-hidden="true">◀</span> Anterior
          </button>
          {total > 0 && <span>{offset + 1} – {Math.min(offset + limite, total)} de {total}</span>}
          <button onClick={onSiguiente} disabled={offset + limite >= total || cargando}>
            Siguiente <span aria-hidden="true">▶</span>
          </button>
        </nav>
      )}

      {cargando && <p>Cargando Pokédex…</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!cargando && !error && (
        <div className="lista">
          {pokemon.map((p) => {
            const yaEsta = enEquipo(p.id)
            return (
              <article key={p.id} aria-label={p.nombre} className={yaEsta ? 'tarjeta en-equipo' : 'tarjeta'}>
                <img src={p.imagen} alt={p.nombre} width="200" />
                <h2>#{p.id} {p.nombre}</h2>
                <ul className="tipos">
                  {p.tipos.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <p>Altura: {p.altura}m - Peso: {p.peso}kg</p>
                <button onClick={() => onAgregar(p)} disabled={yaEsta || lleno}>
                  {yaEsta ? 'En tu equipo' : lleno ? 'Equipo lleno' : 'Agregar'}
                </button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
