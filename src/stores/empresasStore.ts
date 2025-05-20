import { defineStore } from "pinia";
import { ref } from "vue";
import type { EmpresaDto } from "@/stores/dtos/Empresa.dto";

export const useEmpresasStore = defineStore("empresas", () => {
  const empresas = ref<EmpresaDto[]>([]);

  async function fetchEmpresas() {
    try {
      const res = await fetch("http://localhost:4444/api/Empresas");
      if (!res.ok) throw new Error("Error al cargar empresas");
      empresas.value = await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function addEmpresa(nuevaEmpresa: EmpresaDto) {
    try {
      const res = await fetch("http://localhost:4444/api/Empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaEmpresa)
      });

      if (!res.ok) throw new Error("Error al guardar empresa");
      await fetchEmpresas();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteEmpresa(empresaId : number) {
    try {
      const response = await fetch(`http://localhost:4444/api/Empresas/${empresaId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar el comentario: ${await response.text()}`);
      }

      empresas.value = empresas.value.filter(empresas => empresas.id !== empresaId);
      await fetchEmpresas();
      console.log(`Comentario ${empresaId} eliminado correctamente`);
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
    }
  }

  return {
    empresas,
    fetchEmpresas,
    addEmpresa,
    deleteEmpresa
  };
});
