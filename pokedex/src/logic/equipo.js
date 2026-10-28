// Son como las reglas de negocio del equipo por asi decirlo
//   - Reciben el equipo y regresan un equipo NUEVO, sin modificar el que recibieron.
//
// Forma de un equipo:
//   { miembros: [ { id, nombre, imagen } ] }

export const MAX_EQUIPO = 6

// Códigos de error y el texto que se muestra en pantalla. Los dos primeros los
// regresa validarEquipo; los demás los usa App cuando falla data/.
export const MENSAJES = {
  EQUIPO_VACIO: 'Agrega al menos un Pokémon',
  EQUIPO_LLENO: `Tu equipo ya tiene ${MAX_EQUIPO} Pokémon`,
  FALLO_GUARDAR: 'No se pudo guardar el equipo. Intenta de nuevo.',
  FALLO_POKEDEX: 'No se pudo cargar la Pokédex',
  FALLO_EQUIPO: 'No se pudo cargar tu último equipo',
  NO_ENCONTRADO: 'No se encontró ese Pokémon',
}

export function crearEquipo() {
  return { miembros: [] }
}

export function estaEnEquipo(equipo, id) {
  return equipo.miembros.some((m) => m.id === id)
}

export function equipoLleno(equipo) {
  return equipo.miembros.length >= MAX_EQUIPO
}

// Si el Pokémon ya está o el equipo está lleno, regresa el equipo sin cambios
export function agregarAlEquipo(equipo, pokemon) {
  if (estaEnEquipo(equipo, pokemon.id)) return equipo
  if (equipoLleno(equipo)) return equipo

  // Solo se copian los campos que el equipo necesita, no el Pokémon completo.
  const nuevo = { id: pokemon.id, nombre: pokemon.nombre, imagen: pokemon.imagen }
  return { ...equipo, miembros: [...equipo.miembros, nuevo] }
}

export function quitarDelEquipo(equipo, id) {
  return { ...equipo, miembros: equipo.miembros.filter((m) => m.id !== id) }
}

export function validarEquipo(equipo) {
  const errores = []

  if (equipo.miembros.length === 0) errores.push('EQUIPO_VACIO')
  if (equipo.miembros.length > MAX_EQUIPO) errores.push('EQUIPO_LLENO')

  return { valida: errores.length === 0, errores }
}
