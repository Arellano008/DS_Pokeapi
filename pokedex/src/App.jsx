import { useState, useEffect } from 'react'
import { collection, doc, setDoc, getDocs, deleteDoc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { PokemonCard } from './components/PokemonCard'
import './App.css'

const API = "https://pokeapi.co/api/v2"
const LIMITE = 25
const MAX_EQUIPO = 6

function App() {
  // Estados de la lista
  const [lista, setLista] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Estados del equipo
  const [equipo, setEquipo] = useState([])
  const [errorEquipo, setErrorEquipo] = useState(null)

  // Estados de la paginación
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)

  // Estados de la búsqueda
  const [texto, setTexto] = useState('')
  const [consulta, setConsulta] = useState('')

  // Funcion agregar
  async function agregar(p){
    if (equipo.length >= MAX_EQUIPO) return
    if (equipo.some((e) => e.id === p.id)) return

    try {
      await setDoc(doc(db, 'equipo', String(p.id)), {
        nombre: p.name,
        img: p.sprites.other['official-artwork'].front_default,
      })
    } catch (err) {
      setErrorEquipo(err.message)
    }
  }

  // Funcion quitar
  async function quitar(p){
    try {
      await deleteDoc(doc(db, 'equipo', String(p.id)))
    } catch (err) {
      setErrorEquipo(err.message)
    }
  }

  // Funcion buscar
  function buscar(ev){
    ev.preventDefault()
    setConsulta(texto.trim().toLowerCase())
  }

  function limpiar(){
    setTexto('')
    setConsulta('')
  }

  // Lee el equipo de Firestore
  useEffect(() => {
    const dejarDeEscuchar = onSnapshot(
      collection(db, 'equipo'),
      (snapshot) => {
        setEquipo(snapshot.docs.map((d) => ({ id: Number(d.id), ...d.data() })))
      },
      (err) => setErrorEquipo(err.message)
    )
    return dejarDeEscuchar
  }, [])

  // Carga la lista de 25 o el Pokémon buscado
  useEffect(() => {
    let ignorar = false
    async function cargar(){
      setCargando(true)
      setError(null)
      try{
        if (consulta) {
          const res = await fetch(`${API}/pokemon/${consulta}`)
          if (!res.ok) throw new Error(`No se encontró "${consulta}"`)
          const data = await res.json()
          if (!ignorar) setLista([data])
        } else {
          const res = await fetch(`${API}/pokemon?limit=${LIMITE}&offset=${offset}`)
          if (!res.ok) throw new Error(`Error al cargar la lista (${res.status})`)
          const data = await res.json()
          const detalles = await Promise.all(
            data.results.map((r) => fetch(r.url).then((res) => res.json()))
          )
          if (!ignorar) {
            setTotal(data.count)
            setLista(detalles)
          }
        }
      } catch (err) {
        if (!ignorar) {
          setError(err.message)
          setLista([])
        }
      } finally {
        if (!ignorar) setCargando(false)
      }
    }
    cargar()
    return () => {
      ignorar = true
    }
  }, [offset, consulta])

  useEffect(()=> {
    getDocs(collection(db, "equipo"))
    .then((snap) =>
      setEquipo(snap.docs.map((d)=> ({id: d.id, ...d.data()})))
    )
    .catch((e) => setError(e.message))
  }, [])

  
  const estaEnEquipo = (id) => equipo.some((e) => e.id === id)
  const equipoLleno = equipo.length >= MAX_EQUIPO

  console.log("render")

  return (
    <>
      <h1>
        CHAPATA POKEDEX
      </h1>

      <h2>Mi equipo ({equipo.length} / {MAX_EQUIPO})</h2>
      {errorEquipo && <p className='error'>{errorEquipo}</p>}
      <section className='equipo'>
        {equipo.length === 0 && <p>Todavía no tienes Pokémon en tu equipo.</p>}
        {equipo.map((p) => (
          <article key={p.id} className='miembro'>
            <img src={p.img} alt={p.nombre} width="96" />
            <span>#{p.id} {p.nombre}</span>
            <button onClick={() => quitar(p)}>Quitar</button>
          </article>
        ))}
      </section>

      <form className='buscador' onSubmit={buscar}>
        <input
          value={texto}
          onChange={(ev) => setTexto(ev.target.value)}
          placeholder='Nombre o número (ej. pikachu o 25)'
        />
        <button type='submit'>Buscar</button>
        {consulta && <button type='button' onClick={limpiar}>Ver lista</button>}
      </form>

      {!consulta && (
        <nav className='paginas'>
          <button
            onClick={() => setOffset((o) => Math.max(0, o - LIMITE))}
            disabled={offset === 0 || cargando}
          >
            ◀ Anterior
          </button>
          {total > 0 && <span>{offset + 1} – {Math.min(offset + LIMITE, total)} de {total}</span>}
          <button
            onClick={() => setOffset((o) => o + LIMITE)}
            disabled={offset + LIMITE >= total || cargando}
          >
            Siguiente ▶
          </button>
        </nav>
      )}

      {cargando && <p>Cargando...</p>}
      {error && <p className='error'>{error}</p>}
      {!cargando && !error && (
        <section className='lista'>
          {lista.map((p) => (
            <PokemonCard
              key={p.id}
              pokemon={p}
              onAgregar={agregar}
              enEquipo={estaEnEquipo(p.id)}
              lleno={equipoLleno}
            />
          ))}
        </section>
      )}
    </>
  )
}

export default App
