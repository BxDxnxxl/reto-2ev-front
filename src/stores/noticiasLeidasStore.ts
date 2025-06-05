import { defineStore } from "pinia";
import { ref } from "vue";
import type { UsuarioNoticiaLeidaDto } from "@/stores/dtos/UsuarioNoticiaLeida.dto";

export const useNoticiasLeidasStore = defineStore("noticiasLeidas", () => {
  const publicacionesLeidas = ref<number[]>([]);

  async function fetchLeidas(idUsuario: number) {
    try {
      const res = await fetch(`https://wannagamesapi.retocsv.es/api/UsuariosNoticiasLeidas/${idUsuario}`);
      if (!res.ok) throw new Error("Error al obtener publicaciones leídas");
      publicacionesLeidas.value = await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function marcarLeida(dto: UsuarioNoticiaLeidaDto) {
    try {
      await fetch("https://wannagamesapi.retocsv.es/api/UsuariosNoticiasLeidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
      await fetchLeidas(dto.idUsuario);
    } catch (err) {
      console.error(err);
    }
  }

  return {
    publicacionesLeidas,
    fetchLeidas,
    marcarLeida,
  };
});
