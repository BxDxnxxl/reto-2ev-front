// src/stores/commentsStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { ComentarioDto } from "@/stores/dtos/Comentario.dto";
import type { ComentarioDetalleDto } from "@/stores/dtos/ComentarioDetalle.dto";

export const useCommentsStore = defineStore("comments", () => {
  const comentariosByVideojuego = ref<ComentarioDetalleDto[]>([]);
  const comentarios = ref<ComentarioDto[]>([]);

  async function fetchComentarios() {
    try {
      const response = await fetch("https://wannagamesapi.retocsv.es/api/Comentario");
      if (!response.ok) throw new Error("Error al cargar todos los comentarios");
      comentarios.value = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchComentariosByVideojuegos(videojuegoId: number) {
    try {
      const response = await fetch(`https://wannagamesapi.retocsv.es/api/Comentario/videojuego/${videojuegoId}`);
      if (!response.ok) throw new Error("Error al cargar los comentarios");
      comentariosByVideojuego.value = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function postComentario(nuevoComentario: ComentarioDto) {
    try {
      const response = await fetch("https://wannagamesapi.retocsv.es/api/Comentario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoComentario)
      });

      if (!response.ok) throw new Error("Error al enviar el comentario");

      comentarios.value.push(nuevoComentario);
      await fetchComentarios();
      await fetchComentariosByVideojuegos(nuevoComentario.fkIdVideojuego);
    } catch (error) {
      console.error(error);
    }
  }

  async function likeComentario(comentarioId: number, videojuegoId: number) {
    try {
      const response = await fetch(`http://localhost:4444/api/comentario/like/${comentarioId}`, {
        method: "PUT"
      });

      if (!response.ok) throw new Error("Error al dar like");
      await fetchComentarios();
      await fetchComentariosByVideojuegos(videojuegoId);
    } catch (error) {
      console.error(error);
    }
  }

  async function dislikeComentario(comentarioId: number, videojuegoId: number) {
    try {
      const response = await fetch(`http://localhost:4444/api/comentario/dislike/${comentarioId}`, {
        method: "PUT"
      });

      if (!response.ok) throw new Error("Error al dar dislike");

      await fetchComentarios();
      await fetchComentariosByVideojuegos(videojuegoId);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteComentario(comentarioId: number, videojuegoId: number) {
    try {
      const response = await fetch(`http://localhost:4444/api/Comentario/${comentarioId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar el comentario: ${await response.text()}`);
      }

      comentariosByVideojuego.value = comentariosByVideojuego.value.filter(comentario => comentario.id !== comentarioId);
      await fetchComentarios();
      await fetchComentariosByVideojuegos(videojuegoId);
      console.log(`Comentario ${comentarioId} eliminado correctamente`);
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
    }
  }

  async function fetchComentarioById(comentarioId: number) {
    try {
        const response = await fetch(`http://localhost:4444/api/Comentario/${comentarioId}`);
        if (!response.ok) throw new Error('Error al obtener el comentario');

        const comentario = await response.json();
        return comentario;
    } catch (error) {
        console.error("Error al obtener comentario:", error);
        return null;
    }
}


  return {
    comentarios,
    comentariosByVideojuego,
    fetchComentarios,
    fetchComentariosByVideojuegos,
    postComentario,
    likeComentario,
    dislikeComentario,
    deleteComentario,
    fetchComentarioById
  };
});
