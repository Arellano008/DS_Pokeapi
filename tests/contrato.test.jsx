// Prueba de aceptación: verifica los roles, nombres accesibles y textos de la pantalla.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../src/firebase', () => ({ db: {} }))
vi.mock('../src/data/pokeapi', () => ({
  LIMITE: 25,
  cargarPokemon: vi.fn(async () => ({
    total: 1,
    pokemon: [{ id: 25, nombre: 'pikachu', imagen: 'p.png', tipos: ['electric'], altura: 0.4, peso: 6 }],
  })),
  buscarPokemon: vi.fn(),
}))
vi.mock('../src/data/equipos', () => ({
  guardarEquipo: vi.fn(async () => ({ id: 'F1' })),
  cargarUltimoEquipo: vi.fn(async () => null),
}))

import App from '../src/App'
import { guardarEquipo } from '../src/data/equipos'

describe('Contrato de interfaz', () => {
  beforeEach(() => vi.clearAllMocks())

  it('agregar a pikachu lo muestra en el equipo con Quitar', async () => {
    const user = userEvent.setup()
    render(<App />)
    const pokedex = await screen.findByRole('region', { name: 'Pokédex' })
    const tarjeta = await within(pokedex).findByRole('article', { name: 'pikachu' })
    await user.click(within(tarjeta).getByRole('button', { name: 'Agregar' }))

    const equipo = screen.getByRole('region', { name: 'Equipo' })
    const miembro = within(equipo).getByRole('listitem', { name: 'pikachu' })
    expect(within(miembro).getByRole('button', { name: 'Quitar' })).toBeInTheDocument()
    expect(within(tarjeta).getByRole('button', { name: 'En tu equipo' })).toBeDisabled()
    expect(screen.getByLabelText('Buscar Pokémon')).toBeInTheDocument()
  })

  it('guardar un equipo vacío muestra el error y no llama a Firestore', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Guardar equipo' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Agrega al menos un Pokémon')
    expect(guardarEquipo).not.toHaveBeenCalled()
  })

  it('guardar muestra el folio solo después de que Firestore responde', async () => {
    const user = userEvent.setup()
    render(<App />)
    const tarjeta = await screen.findByRole('article', { name: 'pikachu' })
    await user.click(within(tarjeta).getByRole('button', { name: 'Agregar' }))
    await user.click(screen.getByRole('button', { name: 'Guardar equipo' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Folio: F1')
  })

  it('si guardar falla muestra el error y conserva el equipo', async () => {
    guardarEquipo.mockRejectedValueOnce(new Error('sin red'))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    render(<App />)
    const tarjeta = await screen.findByRole('article', { name: 'pikachu' })
    await user.click(within(tarjeta).getByRole('button', { name: 'Agregar' }))
    await user.click(screen.getByRole('button', { name: 'Guardar equipo' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo guardar el equipo. Intenta de nuevo.')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'Equipo' })).getByRole('listitem', { name: 'pikachu' })).toBeInTheDocument()
  })
})
