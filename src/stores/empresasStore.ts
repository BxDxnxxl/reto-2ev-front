import { defineStore } from "pinia";
import { ref } from "vue";
import type { EmpresaDto } from "@/stores/dtos/Empresa.dto";
import type { EmpresasAfiliadosDTO } from "./dtos/EmpresasAfiliados.dto";
import type { EmpresaCreateDto } from "./dtos/EmpresaCreateDto";

export const useEmpresasStore = defineStore("empresas", () => {
  const empresas = ref<EmpresaDto[]>([]);
  const empresasConAfiliados = ref<EmpresasAfiliadosDTO[]>([]);

  async function fetchEmpresas() {
    try {
      const res = await fetch("http://localhost:4444/api/Empresas");
      if (!res.ok) throw new Error("Error al cargar empresas");
      empresas.value = await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function addEmpresa(formData: FormData) {
    try {
      const response = await fetch("http://localhost:4444/api/empresas", {
        method: "POST",
        body: formData
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear empresa: ${errorText}`);
      }
  
      await fetchEmpresas();
    } catch (error) {
      console.error("Error al crear empresa:", error);
      throw error;
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

  async function fetchEmpresasConAfiliados() {
    try {
      const res = await fetch('http://localhost:4444/api/Empresas/conAfiliados');
      if (!res.ok) throw new Error('Error al cargar empresas con afiliados');
      empresasConAfiliados.value = await res.json();
    } catch (err) {
      console.error('Error en fetchEmpresasConAfiliados:', err);
    }
  }

  return {
    empresas,
    empresasConAfiliados,
    fetchEmpresas,
    addEmpresa,
    deleteEmpresa,
    fetchEmpresasConAfiliados
  };
});
