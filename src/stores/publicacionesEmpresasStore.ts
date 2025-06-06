import { defineStore } from "pinia";
import { ref } from "vue";
import type { PublicacionEmpresaDto } from "@/stores/dtos/PublicacionEmpresa.dto";
import type { PublicacionTablaEmpresaDto } from "@/stores/dtos/PublicacionTablaEmpresa.dto";
import type { NovedadesDto } from "@/stores/dtos/Novedades.dto";
import type { ActualizarAcuerdoDto } from '@/stores/dtos/ActualizarAcuerdo.dto';

export const usePublicacionesEmpresasStore = defineStore("publicacionesEmpresas", () => {
  const publicaciones = ref<PublicacionEmpresaDto[]>([]);
  const destacadasNoLeidas = ref<PublicacionEmpresaDto[]>([]);
  const noticiasEmpresaAfiliada = ref<PublicacionTablaEmpresaDto[]>([]);
  const novedades = ref<NovedadesDto[]>([]);
  

  async function fetchPublicaciones() {
    try {
      const res = await fetch("https://wannagamesapi.retocsv.es/api/PublicacionesEmpresas");
      if (!res.ok) throw new Error("Error al cargar publicaciones");
      publicaciones.value = await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchPublicacionesDestacadasNoLeidas(idUsuario: number) {
    try {
      const res = await fetch(`https://wannagamesapi.retocsv.es/api/PublicacionesEmpresas/destacadas-no-leidas/${idUsuario}`);
      if (!res.ok) throw new Error("Error al cargar destacadas no leídas");
      destacadasNoLeidas.value = await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchNoticiasEmpresaAfiliada(idUsuario: number) {
    try {
      const res = await fetch(`https://wannagamesapi.retocsv.es/api/PublicacionesEmpresas/noticias-afiliado/${idUsuario}`);
      if (!res.ok) throw new Error('Error al cargar noticias de empresa afiliada');
      noticiasEmpresaAfiliada.value = await res.json();
    } catch (error) {
      console.error('Error en fetchNoticiasEmpresaAfiliada:', error);
    }
  }

  async function addPublicacion(formData: FormData) {
    try {
      const response = await fetch('https://wannagamesapi.retocsv.es/api/PublicacionesEmpresas', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear publicación: ${errorText}`);
      }
  
      await fetchPublicaciones();
    } catch (error) {
      console.error("Error al crear publicación:", error);
      throw error;
    }
  }


  async function updatePublicacion(publicacion: PublicacionEmpresaDto) {
    try {
      await fetch(`https://wannagamesapi.retocsv.es/api/PublicacionesEmpresas/${publicacion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publicacion),
      });
      await fetchPublicaciones();
    } catch (err) {
      console.error("Error al actualizar publicación:", err);
    }
  }

  async function deletePublicacion(id: number) {
    try {
      await fetch(`https://wannagamesapi.retocsv.es/api/PublicacionesEmpresas/${id}`, {
        method: "DELETE",
      });
      await fetchPublicaciones();
    } catch (err) {
      console.error("Error al eliminar publicación:", err);
    }
  }

  async function fetchNovedades() {
    const res = await fetch("https://wannagamesapi.retocsv.es/api/PublicacionesEmpresas/novedades");
    if (!res.ok) throw new Error("Error al cargar novedades");
    novedades.value = await res.json();
  }

  async function actualizarAcuerdo(dto: ActualizarAcuerdoDto) {
    try {
      const res = await fetch(`https://wannagamesapi.retocsv.es/api/Empresas/actualizar-acuerdo/${dto.idEmpresa}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
      });
  
      if (!res.ok) throw new Error("Error al actualizar el acuerdo");
  
      const data = await res.json();
      console.log(data.mensaje);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function marcarPublicacionComoLeida(idUsuario: number, idPublicacion: number) {
  try {
    await fetch('https://wannagamesapi.retocsv.es/api/UsuariosNoticiasLeidas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idUsuario, idPublicacion })
    });

    destacadasNoLeidas.value = destacadasNoLeidas.value.filter(p => p.id !== idPublicacion);
  } catch (error) {
    console.error("Error al marcar publicación como leída:", error);
  }
}

  return {
    novedades,
    publicaciones,
    destacadasNoLeidas,
    noticiasEmpresaAfiliada,
    fetchPublicaciones,
    fetchPublicacionesDestacadasNoLeidas,
    fetchNoticiasEmpresaAfiliada,
    addPublicacion,
    updatePublicacion,
    deletePublicacion,
    fetchNovedades,
    actualizarAcuerdo,
    marcarPublicacionComoLeida
  };
});
