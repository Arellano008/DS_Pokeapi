// Acceso a la PokeAPI. Regresa los Pokémon ya normalizados para que ningún
// componente dependa de la forma de la respuesta de la API.
export const API = 'https://pokeapi.co/api/v2'
export const LIMITE = 25

async function pedirJson(url, mensaje) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${mensaje} (${r.status})`)
  return r.json()
}

// Forma de un Pokémon en la aplicación:
//   { id, nombre, imagen, tipos: [string], altura (m), peso (kg) }
function normalizar(p) {
  return {
    id: p.id,
    nombre: p.name,
    imagen: p.sprites.other['official-artwork'].front_default,
    tipos: p.types.map((t) => t.type.name),
    altura: p.height / 10,
    peso: p.weight / 10,
  }
}

// Una página de LIMITE Pokémon 
export async function cargarPokemon(offset = 0) {
  const pagina = await pedirJson(
    `${API}/pokemon?limit=${LIMITE}&offset=${offset}`,
    'Error al cargar la lista'
  )
  const detalles = await Promise.all(
    pagina.results.map((r) => pedirJson(r.url, 'Error al cargar un Pokémon'))
  )
  return { total: pagina.count, pokemon: detalles.map(normalizar) }
}

// Un solo Pokémon por nombre o número.
export async function buscarPokemon(consulta) {
  const p = await pedirJson(`${API}/pokemon/${consulta}`, `No se encontró "${consulta}"`)
  return normalizar(p)
}
