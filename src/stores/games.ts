import { defineStore } from "pinia";
import { ref } from "vue";
import type { GameDto } from "@/stores/dtos/game.dto";


export const useGamesStore = defineStore('games', () =>{
    
    const games = ref<GameDto[]>([]);
    
    async function fetchVideojuegos() {
        try {
          const response = await fetch("http://localhost:4444/api/videojuego");
          games.value = await response.json();
        } catch (error) {
          console.error("Error al obtener videojuego:", error);
        }
      }
    
      async function fetchVideojuegoById(id: number) {
        try {
          const response = await fetch(`http://localhost:4444/api/videojuego/${id}`);
          const usuario = await response.json();
    
          games.value = games.value.filter(g => g.id !== id);
          games.value.push(usuario);
        } catch (error) {
          console.error("Error al obtener el videojuego:", error);
        }
      }
    
      async function createVideojuegos(nuevoVideojuego: GameDto) {
        try {
          await fetch("http://localhost:4444/api/videojuego", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoVideojuego),
          });
          await fetchVideojuegos(); 
        } catch (error) {
          console.error("Error al crear videojuego:", error);
        }
      }
    
      async function updateVideojuego(id: number, videojuegoActualizado: GameDto) {
        try {
          await fetch(`http://localhost:4444/api/videojuego/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(videojuegoActualizado),
          });
          await fetchVideojuegos();
        } catch (error) {
          console.error("Error al actualizar videojuego:", error);
        }
      }
    
      async function deleteVideojuego(id: number) {
        try {
          await fetch(`http://localhost:4444/api/videojuego/${id}`, { method: "DELETE" });
          games.value = games.value.filter(g => g.id !== id);
        } catch (error) {
          console.error("Error al eliminar videojuego:", error);
        }
      }
    
      return {
        games,
        fetchVideojuegos,
        fetchVideojuegoById,
        createVideojuegos,
        updateVideojuego,
        deleteVideojuego
      };
    });
    