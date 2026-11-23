// Acceso a Firestore para los equipos.
//
// REGLA DE DISEÑO: este es el ÚNICO archivo de la aplicación (junto con
// src/firebase.js) que puede importar 'firebase/firestore'.
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const equipos = collection(db, 'equipos')

// Guarda el equipo como un documento nuevo en `equipos`.
// Regresa { id } con el id del documento creado (es el folio).
export async function guardarEquipo(equipo) {
  const documento = {
    // Campos explícitos: no se guarda el objeto completo de la PokeAPI.
    miembros: equipo.miembros.map(({ id, nombre, imagen }) => ({ id, nombre, imagen })),
    creadaEn: serverTimestamp(), // la hora la pone el servidor, no el navegador
  }

  // Si addDoc falla, la promesa se rechaza y App no muestra el folio.
  const ref = await addDoc(equipos, documento)
  return { id: ref.id }
}

// Regresa el último equipo guardado { id, miembros }, o null si no hay ninguno.
export async function cargarUltimoEquipo() {
  const snap = await getDocs(query(equipos, orderBy('creadaEn', 'desc'), limit(1)))
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, miembros: d.data().miembros }
}
