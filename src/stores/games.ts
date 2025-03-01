import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GameDto } from '@/stores/dtos/game.dto'
import type { VideojuegoDetalleDto } from '@/stores/dtos/videojuegoDetalle.dto';

export const useGamesStore = defineStore('games', () => {
  const games = ref<GameDto[]>([])
  const top5Videojuegos = ref<GameDto[]>([])
  const detalleVideojuego = ref<VideojuegoDetalleDto | null>(null)

  async function fetchVideojuegos() {
    try {
      const response = await fetch('http://localhost:4444/api/videojuegos')
      games.value = await response.json()
    } catch (error) {
      console.error('Error al obtener videojuego:', error)
    }
  }

  async function fetchVideojuegoById(id: number) {
    try {
      const response = await fetch(`http://localhost:4444/api/videojuegos/${id}`)
      const game = await response.json()

      games.value = games.value.filter((g) => g.id !== id)
      games.value.push(game)
    } catch (error) {
      console.error('Error al obtener el videojuego:', error)
    }
  }

  async function createVideojuegos(nuevoVideojuego: GameDto) {
    try {
      await fetch('http://localhost:4444/api/videojuegos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoVideojuego),
      })
      await fetchVideojuegos()
    } catch (error) {
      console.error('Error al crear videojuego:', error)
    }
  }

  async function updateVideojuego(id: number, videojuegoActualizado: GameDto) {
    try {
      await fetch(`http://localhost:4444/api/videojuegos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videojuegoActualizado),
      })
      await fetchVideojuegos()
    } catch (error) {
      console.error('Error al actualizar videojuego:', error)
    }
  }

  async function deleteVideojuego(id: number) {
    try {
      await fetch(`http://localhost:4444/api/videojuegos/${id}`, { method: 'DELETE' })
      games.value = games.value.filter((g) => g.id !== id)
    } catch (error) {
      console.error('Error al eliminar videojuego:', error)
    }
  }

  async function fetchTop5Videojuegos() {
    try {
      const response = await fetch('http://localhost:4444/api/Videojuegos/top5')
      if (!response.ok) {
        throw new Error('Error al obtener el top 5 de videojuegos')
      }
      top5Videojuegos.value = await response.json()
    } catch (error) {
      console.error('Error en fetchTop5Videojuegos:', error)
    }
  }

  async function verDetalleVideojuego(id: number) {
    try {
        const response = await fetch(`http://localhost:4444/api/Videojuegos/${id}/detalle`);
        if (!response.ok) {
            throw new Error('Error al obtener el detalle del videojuego');
        }
        detalleVideojuego.value = await response.json();
    } catch (error) {
        console.error('Error en fetchGameDetail:', error);
        detalleVideojuego.value = null;
    }
}

  return {
    games,
    top5Videojuegos,
    detalleVideojuego,
    fetchVideojuegos,
    fetchVideojuegoById,
    createVideojuegos,
    updateVideojuego,
    deleteVideojuego,
    fetchTop5Videojuegos,
    verDetalleVideojuego
  }
})
