// src/stores/companiesStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { CompañiaDto } from "@/stores/dtos/Compañia.dto";

export const useCompaniesStore = defineStore("companies", () => {
  const companias = ref<CompañiaDto[]>([]);

  async function fetchCompanies() {
    try {
      const response = await fetch("http://localhost:4444/api/Compania");
      if (!response.ok) throw new Error("Error al cargar compañías");
      companias.value = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  return { 
    companias, 
    fetchCompanies 
};
});
