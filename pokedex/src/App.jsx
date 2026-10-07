import { useState, useEffect } from 'react'
import './App.css'
import { PokemonCard } from './components/PokemonCard'

const API = "https://pokeapi.co/api/v2"

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [cargando, setCargando] =useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function cargar(){
      setCargando(true)
      setError(null)
      try{
        const res = await fetch(`${API}/pokemon/pikachu`)
        if (!res.ok) throw new Error(`Pokemon no encontrado (${res.status}`)
        const data = await res.json()
        setPokemon(data)
        
      } catch (err) {
        setError(err.message)
        
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  console.log("render")

  return (
    <>
      <h1>
        CHAPATA POKEDEX
      </h1>
      {cargando && <p>Cargando...</p>}
      {error && <p className='error'>{error}</p>}
      {pokemon && !cargando && !error && <PokemonCard pokemon={pokemon}/>}
    
    </>
  )
}

export default App
