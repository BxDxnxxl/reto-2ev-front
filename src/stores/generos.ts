// src/stores/genresStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { GeneroDto } from "@/stores/dtos/Genero.dto";

export const useGenresStore = defineStore("genres", () => {
  const generos = ref<GeneroDto[]>([]);
  const top5Generos = ref<GeneroDto[]>([]);

  async function fetchGenres() {
    try {
      const response = await fetch("https://wannagamesapi.retocsv.es/api/Genero");
      if (!response.ok) throw new Error("Error al cargar géneros");
      generos.value = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchTop5Genres() {
    try {
      const response = await fetch("https://wannagamesapi.retocsv.es/api/Genero/top5");
      if (!response.ok) throw new Error("Error al cargar los géneros más populares");
      top5Generos.value = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  return { 
    generos,
    top5Generos, 
    fetchGenres,
    fetchTop5Genres 
};
});
