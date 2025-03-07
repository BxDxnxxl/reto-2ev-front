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
      const response = await fetch("http://localhost:4444/api/Comentario");
      if (!response.ok) throw new Error("Error al cargar todos los comentarios");
      comentarios.value = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchComentariosByVideojuegos(videojuegoId: number) {
    try {
      const response = await fetch(`http://localhost:4444/api/Comentario/videojuego/${videojuegoId}`);
      if (!response.ok) throw new Error("Error al cargar los comentarios");
      comentariosByVideojuego.value = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function postComentario(nuevoComentario: ComentarioDto) {
    try {
      const response = await fetch("http://localhost:4444/api/Comentario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoComentario)
      });

      if (!response.ok) throw new Error("Error al enviar el comentario");

      comentarios.value.push(nuevoComentario);
      await fetchComentarios();
    } catch (error) {
      console.error(error);
    }
  }

  return {
    comentarios,
    comentariosByVideojuego,
    fetchComentarios,
    fetchComentariosByVideojuegos,
    postComentario
  };
});
