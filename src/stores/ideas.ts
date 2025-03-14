import { defineStore } from "pinia";
import { ref } from "vue";
import type { IdeasdDto } from "@/stores/dtos/Ideas.dto";
import type { IdeasUsuariosDto  } from "@/stores/dtos/IdeasUsuarios.dto";

export const useIdeasStore = defineStore("ideas", () => {
  const ideas = ref<IdeasdDto[]>([]);
  const ideasUsuarios = ref<IdeasUsuariosDto[]>([]);

  async function fetchIdeas() {
    try {
      const response = await fetch("http://localhost:4444/api/Idea");
      if (!response.ok) throw new Error("errrooooooor");
      ideas.value = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchIdeasConUsuarios() {
    try {
      const response = await fetch("http://localhost:4444/api/Idea/con-usuarios");
      if (!response.ok) throw new Error("errrrooooor");
      ideasUsuarios.value = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function addIdea(newIdea: IdeasdDto) {
    try {
      const response = await fetch("http://localhost:4444/api/Idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIdea),
      });

      if (!response.ok) throw new Error("errrooooooor");

      await fetchIdeas(); 
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteIdea(id: number) {
    try {
      const response = await fetch(`http://localhost:4444/api/Idea/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("errrrrooooor");

      ideas.value = ideas.value.filter(idea => idea.id !== id);
    } catch (error) {
      console.error(error);
    }
  }

  return { 
    ideas, 
    ideasUsuarios, 
    fetchIdeas, 
    fetchIdeasConUsuarios, 
    addIdea, 
    deleteIdea 
  };
});
