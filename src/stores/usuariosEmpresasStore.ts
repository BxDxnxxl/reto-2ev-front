import { defineStore } from "pinia";
import { ref } from "vue";
import type { UsuarioEmpresaDto } from "@/stores/dtos/UsuarioEmpresa.dto";

export const useUsuariosEmpresasStore = defineStore("usuariosEmpresas", () => {
  const relaciones = ref<UsuarioEmpresaDto[]>([]);
  const puedePublicarDestacada = ref<boolean>(true);
  async function fetchRelaciones() {
    try {
      const res = await fetch("https://wannagamesapi.retocsv.es/api/UsuariosEmpresas");
      if (!res.ok) throw new Error("Error al cargar relaciones");
      relaciones.value = await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function addRelacion(relacion: UsuarioEmpresaDto) {
    try {
      await fetch("https://wannagamesapi.retocsv.es/api/UsuariosEmpresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(relacion),
      });
      await fetchRelaciones();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteRelacion(idUsuario: number, idEmpresa: number) {
    try {
      await fetch(
        `https://wannagamesapi.retocsv.es/api/UsuariosEmpresas?idUsuario=${idUsuario}&idEmpresa=${idEmpresa}`,
        { method: "DELETE" }
      );
      await fetchRelaciones();
    } catch (err) {
      console.error(err);
    }
  }

  async function getEmpresasDeUsuario(idUsuario: number): Promise<number[]> {
    try {
      const res = await fetch(`https://wannagamesapi.retocsv.es/api/UsuariosEmpresas/usuario/${idUsuario}`);
      if (!res.ok) throw new Error('Error al obtener empresas del usuario');
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  }  

  async function checkLimiteDestacadas(idEmpresa: number) {
    try {
      const res = await fetch(`https://wannagamesapi.retocsv.es/api/PublicacionesEmpresas/puede-publicar-destacada/${idEmpresa}`);
      if (!res.ok) throw new Error("Error al comprobar si puede publicar destacada");
      return await res.json();
    } catch (err) {
      console.error("Error en puedePublicarDestacada:", err);
      return false;
    }
  }
  

  return {
    relaciones,
    puedePublicarDestacada,
    fetchRelaciones,
    addRelacion,
    deleteRelacion,
    getEmpresasDeUsuario,
    checkLimiteDestacadas
  };
});
