import { defineStore } from "pinia";
import { ref } from "vue";
import type { Ideas } from "@/stores/dtos/Ideas.dto";
import type { IdeaConPlazasDto } from "@/stores/dtos/IdeasConPlazos.dto";

export const useIdeasStore = defineStore("ideas", () => {
  const ideasBase = ref<Ideas[]>([]);
  const ideasConPlazas = ref<IdeaConPlazasDto[]>([]);

  async function fetchIdeasBase() {
    try {
      const res = await fetch("http://localhost:4444/api/ideas");
      if (!res.ok) throw new Error("Error al cargar las ideas base");
      ideasBase.value = await res.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchIdeasConPlazas() {
    try {
      const res = await fetch("http://localhost:4444/api/ideas/conPlazas");
      if (!res.ok) throw new Error("Error al cargar ideas con plazas");
      ideasConPlazas.value = await res.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function unirseAIdea(idIdea: number, idUsuario: number) {
    try {
      const response = await fetch(`http://localhost:4444/api/usuariosapuntados/apuntarse?idIdea=${idIdea}&idUsuario=${idUsuario}`, {
        method: "POST"
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      await fetchIdeasConPlazas();
    } catch (error) {
      console.error("Error al unirse a la idea:", error);
    }
  }

  async function publicarIdea(nuevaIdea: Ideas) {
    try {
      const response = await fetch("http://localhost:4444/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevaIdea)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al publicar la idea: ${errorText}`);
      }
  
      await fetchIdeasConPlazas(); // Recargar tras publicar
    } catch (error) {
      console.error("Error al publicar idea:", error);
    }
  }

  return {
    ideasBase,
    ideasConPlazas,
    fetchIdeasBase,
    fetchIdeasConPlazas,
    unirseAIdea,
    publicarIdea
  };
});
