import { defineStore } from "pinia";
import { ref } from "vue";
import type { UsuarioEmpresaDto } from "@/stores/dtos/UsuarioEmpresa.dto";

export const useUsuariosEmpresasStore = defineStore("usuariosEmpresas", () => {
  const relaciones = ref<UsuarioEmpresaDto[]>([]);

  async function fetchRelaciones() {
    try {
      const res = await fetch("http://localhost:4444/api/UsuariosEmpresas");
      if (!res.ok) throw new Error("Error al cargar relaciones");
      relaciones.value = await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function addRelacion(relacion: UsuarioEmpresaDto) {
    try {
      await fetch("http://localhost:4444/api/UsuariosEmpresas", {
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
        `http://localhost:4444/api/UsuariosEmpresas?idUsuario=${idUsuario}&idEmpresa=${idEmpresa}`,
        { method: "DELETE" }
      );
      await fetchRelaciones();
    } catch (err) {
      console.error(err);
    }
  }

  return {
    relaciones,
    fetchRelaciones,
    addRelacion,
    deleteRelacion,
  };
});
