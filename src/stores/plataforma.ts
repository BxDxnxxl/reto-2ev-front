// src/stores/platformsStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { PlataformaDto } from "@/stores/dtos/Plataforma.dto";

export const usePlatformsStore = defineStore("platforms", () => {
  const plataforams = ref<PlataformaDto[]>([]);

  async function fetchPlatforms() {
    try {
      const response = await fetch("http://localhost:4444/api/Plataforma");
      if (!response.ok) throw new Error("Error al cargar plataformas");
      plataforams.value = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  return { plataforams, 
    fetchPlatforms
 };
});
