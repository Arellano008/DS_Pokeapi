// Aviso de equipo guardado.
// Props:
//   folio   id del documento creado en Firestore, o null si no hay nada que avisar
export default function Confirmacion({ folio }) {
  if (!folio) return null
  return (
    <div role="status">
      <strong>Equipo guardado</strong>
      <p>Folio: {folio}</p>
    </div>
  )
}
