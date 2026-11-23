// Componente raíz. Es el ÚNICO componente con estado y el único que llama a
// src/data/. Pokedex, Equipo y Confirmacion solo reciben props.
import { useEffect, useState } from 'react'
import Pokedex from './components/Pokedex'
import Equipo from './components/Equipo'
import Confirmacion from './components/Confirmacion'
import { LIMITE, buscarPokemon, cargarPokemon } from './data/pokeapi'
import { cargarUltimoEquipo, guardarEquipo } from './data/equipos'
import {
  MAX_EQUIPO, MENSAJES, agregarAlEquipo, crearEquipo, equipoLleno, estaEnEquipo, quitarDelEquipo, validarEquipo,
} from './logic/equipo'

export default function App() {
  // Estados de la Pokédex
  const [pokemon, setPokemon] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorPokedex, setErrorPokedex] = useState(null)
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const [texto, setTexto] = useState('')
  const [consulta, setConsulta] = useState('')

  // Estados del equipo
  const [equipo, setEquipo] = useState(crearEquipo())
  const [errores, setErrores] = useState([])
  const [folio, setFolio] = useState(null)
  const [guardando, setGuardando] = useState(false)

  // Al abrir la app: primera página de la PokeAPI y último equipo guardado, una sola vez
  useEffect(() => {
    let activo = true
    cargarPokemon(0)
      .then((pagina) => {
        if (!activo) return
        setTotal(pagina.total)
        setPokemon(pagina.pokemon)
      })
      .catch((error) => {
        console.error(error)
        if (activo) setErrorPokedex(MENSAJES.FALLO_POKEDEX)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    cargarUltimoEquipo()
      .then((guardado) => {
        if (activo && guardado) setEquipo({ miembros: guardado.miembros })
      })
      .catch((error) => {
        console.error(error)
        if (activo) setErrores([MENSAJES.FALLO_EQUIPO])
      })
    return () => {
      activo = false
    }
  }, [])

  // Pide a la PokeAPI lo que regrese `cargar` (un arreglo de Pokémon) y lo muestra
  async function mostrar(cargar, mensajeError) {
    setCargando(true)
    setErrorPokedex(null)
    try {
      setPokemon(await cargar())
    } catch (error) {
      console.error(error)
      setErrorPokedex(mensajeError)
      setPokemon([])
    } finally {
      setCargando(false)
    }
  }

  function irAPagina(nuevoOffset) {
    setOffset(nuevoOffset)
    mostrar(async () => {
      const pagina = await cargarPokemon(nuevoOffset)
      setTotal(pagina.total)
      return pagina.pokemon
    }, MENSAJES.FALLO_POKEDEX)
  }

  function buscar(ev) {
    ev.preventDefault()
    const c = texto.trim().toLowerCase()
    if (!c) return
    setConsulta(c)
    mostrar(async () => [await buscarPokemon(c)], MENSAJES.NO_ENCONTRADO)
  }

  function limpiar() {
    setTexto('')
    setConsulta('')
    irAPagina(offset)
  }

  // Cada cambio al equipo pasa por una función de logic/ y borra avisos viejos
  function cambiar(transformar) {
    setEquipo((actual) => transformar(actual))
    setErrores([])
    setFolio(null)
  }

  // Primero se guarda en Firestore; solo después se muestra el folio
  async function guardar() {
    const { valida, errores: codigos } = validarEquipo(equipo)
    if (!valida) {
      setErrores(codigos.map((codigo) => MENSAJES[codigo]))
      return
    }

    setErrores([])
    setFolio(null)
    setGuardando(true)
    try {
      const { id } = await guardarEquipo(equipo)
      setFolio(id)
    } catch (error) {
      console.error(error)
      setErrores([MENSAJES.FALLO_GUARDAR]) // el equipo se conserva para reintentar
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <h1>CHAPATA POKEDEX</h1>

      <Equipo
        equipo={equipo}
        max={MAX_EQUIPO}
        errores={errores}
        guardando={guardando}
        onQuitar={(id) => cambiar((e) => quitarDelEquipo(e, id))}
        onGuardar={guardar}
      />
      <Confirmacion folio={folio} />

      <Pokedex
        pokemon={pokemon}
        cargando={cargando}
        error={errorPokedex}
        texto={texto}
        consulta={consulta}
        offset={offset}
        total={total}
        limite={LIMITE}
        enEquipo={(id) => estaEnEquipo(equipo, id)}
        lleno={equipoLleno(equipo)}
        onCambiarTexto={setTexto}
        onBuscar={buscar}
        onLimpiar={limpiar}
        onAnterior={() => irAPagina(Math.max(0, offset - LIMITE))}
        onSiguiente={() => irAPagina(offset + LIMITE)}
        onAgregar={(p) => cambiar((e) => agregarAlEquipo(e, p))}
      />
    </>
  )
}
