import { defineStore } from "pinia";
import { ref } from "vue";
import type { RolesDto } from "@/stores/dtos/Roles.dto";

export const useRolesStore = defineStore("roles", () => {
  const roles = ref<RolesDto[]>([]);

  // Obtener todos los roles desde la API
  async function fetchRoles() {
    try {
      const response = await fetch("https://wannagamesapi.retocsv.es/api/Rol");
      if (!response.ok) throw new Error(`Error al obtener roles: ${response.statusText}`);
      roles.value = await response.json();
    } catch (error) {
      console.error("Error en fetchRoles:", error);
    }
  }

  return {
    roles,
    fetchRoles,
    ADMIN: 2,
    DESARROLLADOR: 3,
    EXPERTO: 4,
    USUARIO_BASE: 1,
  };
});
