import { defineStore } from "pinia";
import { ref } from "vue";
import type { PublicacionEmpresaDto } from "@/stores/dtos/PublicacionEmpresa.dto";

export const usePublicacionesEmpresasStore = defineStore("publicacionesEmpresas", () => {
  const publicaciones = ref<PublicacionEmpresaDto[]>([]);
  const destacadasNoLeidas = ref<PublicacionEmpresaDto[]>([]);

  async function fetchPublicaciones() {
    try {
      const res = await fetch("http://localhost:4444/api/PublicacionesEmpresas");
      if (!res.ok) throw new Error("Error al cargar publicaciones");
      publicaciones.value = await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchPublicacionesDestacadasNoLeidas(idUsuario: number) {
    try {
      const res = await fetch(
        `http://localhost:4444/api/PublicacionesEmpresas/destacadas-no-leidas/${idUsuario}`
      );
      if (!res.ok) throw new Error("Error al cargar destacadas no leídas");
      destacadasNoLeidas.value = await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  return {
    publicaciones,
    destacadasNoLeidas,
    fetchPublicaciones,
    fetchPublicacionesDestacadasNoLeidas,
  };
});
