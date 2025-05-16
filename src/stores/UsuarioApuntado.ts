import { defineStore } from "pinia";
import { ref } from "vue";

export const useUsuariosApuntadosStore = defineStore("usuariosApuntados", () => {

  async function unirseAIdea(idIdea: number, idUsuario: number) {
    try {
      const response = await fetch(
        `http://localhost:4444/api/usuariosapuntados/apuntarse?idIdea=${idIdea}&idUsuario=${idUsuario}`,
        { method: "POST" }
      );

      if (!response.ok) {
        const mensaje = await response.text();
        throw new Error(mensaje);
      }
    } catch (error) {
      console.error("Error al unirse a la idea:", error);
      throw error;
    }
  }

  async function verificarSiUsuarioApuntado(fkIdIdea: number, fkIdUsuario: number): Promise<boolean> {
    try {
      const response = await fetch("http://localhost:4444/api/usuariosapuntados/existe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fkIdIdea, fkIdUsuario })
      });

      if (!response.ok) throw new Error("Error al verificar si está apuntado");

      return await response.json();
    } catch (error) {
      console.error("Error en verificarSiUsuarioApuntado:", error);
      return false;
    }
  }

  async function verificarEstadoApuntadoYAceptado(idIdea: number, idUsuario: number): Promise<{ apuntado: boolean; aceptado: boolean }> {
    try {
      const response = await fetch(`http://localhost:4444/api/usuariosapuntados/estado?idIdea=${idIdea}&idUsuario=${idUsuario}`);
      if (!response.ok) throw new Error("Error al verificar el estado del usuario en la idea");

      return await response.json();
    } catch (error) {
      console.error("Error en verificarEstadoApuntadoYAceptado:", error);
      return { apuntado: false, aceptado: false };
    }
  }

  async function aceptarUsuarioApuntado(idIdea: number, idUsuario: number) {
    try {
      const response = await fetch("http://localhost:4444/api/usuariosapuntados/aceptar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idIdea, idUsuario })
      });

      if (!response.ok) throw new Error("Error al aceptar al usuario apuntado");
    } catch (error) {
      console.error("Error al aceptar usuario:", error);
    }
  }

  async function fetchSolicitudesRecibidas(idCreador: number): Promise<any[]> {
    try {
      const response = await fetch(`http://localhost:4444/api/usuariosapuntados/solicitudes-recibidas/${idCreador}`);
      if (!response.ok) throw new Error("Error al cargar solicitudes recibidas");
      return await response.json();
    } catch (error) {
      console.error("Error al obtener solicitudes recibidas:", error);
      return [];
    }
  }

  return {
    unirseAIdea,
    verificarSiUsuarioApuntado,
    verificarEstadoApuntadoYAceptado,
    aceptarUsuarioApuntado,
    fetchSolicitudesRecibidas
  };
});
