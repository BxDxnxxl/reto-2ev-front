// src/stores/genresStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { GeneroDto } from "@/stores/dtos/Genero.dto";

export const useGenresStore = defineStore("genres", () => {
  const generos = ref<GeneroDto[]>([]);

  async function fetchGenres() {
    try {
      const response = await fetch("http://localhost:4444/api/Genero");
      if (!response.ok) throw new Error("Error al cargar géneros");
      generos.value = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  return { 
    generos, 
    fetchGenres 
};
});
