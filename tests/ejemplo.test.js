// Pruebas de src/logic/equipo.js. Corren con `npm test`.
import { describe, it, expect } from 'vitest'
import {
  MAX_EQUIPO, MENSAJES, agregarAlEquipo, crearEquipo, equipoLleno, estaEnEquipo, quitarDelEquipo, validarEquipo,
} from '../src/logic/equipo'

const pikachu = { id: 25, nombre: 'pikachu', imagen: 'pikachu.png', tipos: ['electric'], altura: 0.4, peso: 6 }

// Arma un equipo con los Pokémon 1..n
function equipoDe(n) {
  return { miembros: Array.from({ length: n }, (_, i) => ({ id: i + 1, nombre: `p${i + 1}`, imagen: '' })) }
}

describe('logic/equipo', () => {
  it('crearEquipo regresa un equipo vacío', () => {
    expect(crearEquipo()).toEqual({ miembros: [] })
  })

  it('agregar un Pokémon nuevo copia solo id, nombre e imagen', () => {
    const equipo = agregarAlEquipo(crearEquipo(), pikachu)
    expect(equipo.miembros).toEqual([{ id: 25, nombre: 'pikachu', imagen: 'pikachu.png' }])
  })

  it('agregar no modifica el equipo que recibe', () => {
    const original = crearEquipo()
    agregarAlEquipo(original, pikachu)
    expect(original.miembros).toHaveLength(0)
  })

  it('un Pokémon que ya está no se repite', () => {
    const equipo = agregarAlEquipo(agregarAlEquipo(crearEquipo(), pikachu), pikachu)
    expect(equipo.miembros).toHaveLength(1)
  })

  it(`el equipo no pasa de ${MAX_EQUIPO}`, () => {
    const lleno = equipoDe(MAX_EQUIPO)
    expect(equipoLleno(lleno)).toBe(true)
    expect(agregarAlEquipo(lleno, pikachu).miembros).toHaveLength(MAX_EQUIPO)
  })

  it('quitar saca al Pokémon sin modificar el original', () => {
    const equipo = agregarAlEquipo(crearEquipo(), pikachu)
    expect(quitarDelEquipo(equipo, 25).miembros).toHaveLength(0)
    expect(equipo.miembros).toHaveLength(1)
  })

  it('estaEnEquipo dice si el id ya está', () => {
    const equipo = agregarAlEquipo(crearEquipo(), pikachu)
    expect(estaEnEquipo(equipo, 25)).toBe(true)
    expect(estaEnEquipo(equipo, 1)).toBe(false)
  })

  it('validarEquipo rechaza un equipo vacío', () => {
    expect(validarEquipo(crearEquipo())).toEqual({ valida: false, errores: ['EQUIPO_VACIO'] })
  })

  it(`validarEquipo rechaza más de ${MAX_EQUIPO}`, () => {
    expect(validarEquipo(equipoDe(MAX_EQUIPO + 1)).errores).toEqual(['EQUIPO_LLENO'])
  })

  it('validarEquipo acepta un equipo con miembros', () => {
    expect(validarEquipo(equipoDe(3))).toEqual({ valida: true, errores: [] })
  })

  it('cada código de error tiene su texto en MENSAJES', () => {
    expect(MENSAJES.EQUIPO_VACIO).toBeTruthy()
    expect(MENSAJES.EQUIPO_LLENO).toBeTruthy()
  })
})
