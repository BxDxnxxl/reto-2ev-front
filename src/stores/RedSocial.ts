import { defineStore } from "pinia";
import { ref } from "vue";
import type { RedSocial } from "@/stores/dtos/RedSocial";

export const useSocialStore = defineStore("social", () => {
  const redes = ref<RedSocial[]>([]);

  async function fetchRedes() {
    try {
      const response = await fetch("https://wannagamesapi.retocsv.es/api/redessociales");
      if (!response.ok) throw new Error("Error al cargar redes sociales");
      redes.value = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  return {
    redes,
    fetchRedes
  };
});
