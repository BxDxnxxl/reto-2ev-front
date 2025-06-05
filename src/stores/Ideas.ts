import { defineStore } from "pinia";
import { ref } from "vue";
import type { IdeaDto } from "@/stores/dtos/Ideas.dto";
import type { IdeaConPlazasDto } from "@/stores/dtos/IdeasConPlazos.dto";
import type { TipoIdea } from "@/stores/dtos/TipoIdea.dto";

export const useIdeasStore = defineStore("ideas", () => {
  const ideasBase = ref<IdeaDto[]>([]);
  const ideasConPlazas = ref<IdeaConPlazasDto[]>([]);
  const ideasFiltradasPorTipo = ref<IdeaConPlazasDto[]>([]);
  const tipos = ref<TipoIdea[]>([]);
  
  async function fetchIdeasBase() {
    try {
      const res = await fetch("https://wannagamesapi.retocsv.es/api/ideas");
      if (!res.ok) throw new Error("Error al cargar las ideas base");
      ideasBase.value = await res.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchIdeasConPlazas() {
    try {
      const res = await fetch("https://wannagamesapi.retocsv.es/api/ideas/conPlazas");
      if (!res.ok) throw new Error("Error al cargar ideas con plazas");
      ideasConPlazas.value = await res.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function publicarIdea(nuevaIdea: IdeaDto) {
    try {
      const response = await fetch("https://wannagamesapi.retocsv.es/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaIdea)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al publicar la idea: ${errorText}`);
      }

      await fetchIdeasConPlazas();
    } catch (error) {
      console.error("Error al publicar idea:", error);
    }
  }

  async function fetchIdeasPorTipo(idTipoIdea: number) {
    try {
      const res = await fetch(`https://wannagamesapi.retocsv.es/api/ideas/conPlazas/tipo/${idTipoIdea}`);
      if (!res.ok) throw new Error("Error al filtrar ideas por tipo");
      ideasFiltradasPorTipo.value = await res.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchTiposIdeas() {
    try {
      const res = await fetch("https://wannagamesapi.retocsv.es/api/Ideas/tipos");
      if (!res.ok) throw new Error("Error al cargar tipos de ideas");
      tipos.value = await res.json();
    } catch (error) {
      console.error("Error en fetchTiposIdeas:", error);
    }
  }

  async function deleteIdea(id: number): Promise<number[]> {
    try {
      const response = await fetch(`https://wannagamesapi.retocsv.es/api/ideas/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al borrar la idea: ${errorText}`);
      }

      const data = await response.json();
      await fetchIdeasConPlazas();
      return data.usuariosNotificados as number[];
    } catch (error) {
      console.error("Error al borrar idea:", error);
      return [];
    }
  }


  return {
    ideasBase,
    ideasConPlazas,
    ideasFiltradasPorTipo,
    tipos,
    fetchIdeasBase,
    fetchIdeasConPlazas,
    publicarIdea,
    fetchIdeasPorTipo,
    fetchTiposIdeas,
    deleteIdea
  };
});