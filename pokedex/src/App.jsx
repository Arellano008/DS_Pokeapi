import { useState, useEffect } from 'react'
import './App.css'
import { PokemonCard } from './components/PokemonCard'

const API = "https://pokeapi.co/api/v2"
const PRIMER_ID = 1
const ULTIMO_ID = 1025

 
async function cargarVecino(n) {
  if (n < PRIMER_ID || n > ULTIMO_ID) return null
  try {
    const res = await fetch(`${API}/pokemon/${n}`)
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}

function App() {
  const [id, setId] = useState(25)
  const [pokemon, setPokemon] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [anterior, setAnterior] = useState(null)
  const [siguiente, setSiguiente] = useState(null)

  // Pide el Pokémon actual cada vez que cambia el id
  useEffect(() => {
    async function cargar(){
      setCargando(true)
      setError(null)
      try{
        const res = await fetch(`${API}/pokemon/${id}`)
        if (!res.ok) throw new Error(`Pokemon no encontrado (${res.status})`)
        const data = await res.json()
        setPokemon(data)

      } catch (err) {
        setError(err.message)

      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  // Pide los dos vecinos al mismo tiempo con Promise.all
  useEffect(() => {
    // "ignorar" evita que una respuesta vieja pise a la nueva si cambias rápido
    let ignorar = false
    async function cargarVecinos() {
      const [ant, sig] = await Promise.all([
        cargarVecino(id - 1),
        cargarVecino(id + 1),
      ])
      if (!ignorar) {
        setAnterior(ant)
        setSiguiente(sig)
      }
    }
    cargarVecinos()
    // Limpieza: se ejecuta antes del siguiente efecto y descarta respuestas viejas
    return () => {
      ignorar = true
    }
  }, [id])

  // Math.max / Math.min mantienen el id dentro del rango 1–1025
  const irAnterior = () => setId(actual => Math.max(PRIMER_ID, actual - 1))
  const irSiguiente = () => setId(actual => Math.min(ULTIMO_ID, actual + 1))

  console.log("render")

  return (
    <>
      <h1>
        CHAPATA POKEDEX
      </h1>
      <section className='visor'>
        <button
          className='boton-nav'
          onClick={irAnterior}
          disabled={id === PRIMER_ID || cargando}
        >
          ◀ #{id - 1}
        </button>

        <div className='vecino'>
          {anterior && <PokemonCard pokemon={anterior}/>}
        </div>

        <div className='principal'>
          {cargando && <p>Cargando...</p>}
          {error && <p className='error'>{error}</p>}
          {pokemon && !cargando && !error && <PokemonCard pokemon={pokemon}/>}
        </div>

        <div className='vecino'>
          {siguiente && <PokemonCard pokemon={siguiente}/>}
        </div>

        <button
          className='boton-nav'
          onClick={irSiguiente}
          disabled={id === ULTIMO_ID || cargando}
        >
          #{id + 1} ▶
        </button>
      </section>
    </>
  )
}

export default App
