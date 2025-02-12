import { defineStore } from "pinia";
import { ref } from "vue";
import { UserDto } from "./dtos/user.dto";


export const useUsersStore = defineStore('users', () =>{
    
    const users = ref<UserDto[]>([]);
    
    async function fetchUsuarios() {
        try {
          const response = await fetch("http://localhost:4444/api/usuario");
          users.value = await response.json();
        } catch (error) {
          console.error("Error al obtener usuarios:", error);
        }
      }
    
      async function fetchUsuarioById(id: number) {
        try {
          const response = await fetch(`http://localhost:4444/api/usuario/${id}`);
          const usuario = await response.json();
    
          users.value = users.value.filter(u => u.id !== id);
          users.value.push(usuario);
        } catch (error) {
          console.error("Error al obtener el usuario:", error);
        }
      }
    
      async function createUsuario(nuevoUsuario: UserDto) {
        try {
          await fetch("http://localhost:4444/api/usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoUsuario),
          });
          await fetchUsuarios(); 
        } catch (error) {
          console.error("Error al crear usuario:", error);
        }
      }
    
      async function updateUsuario(id: number, usuarioActualizado: UserDto) {
        try {
          await fetch(`http://localhost:4444/api/usuario/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuarioActualizado),
          });
          await fetchUsuarios();
        } catch (error) {
          console.error("Error al actualizar usuario:", error);
        }
      }
    
      async function deleteUsuario(id: number) {
        try {
          await fetch(`http://localhost:4444/api/usuario/${id}`, { method: "DELETE" });
          users.value = users.value.filter(u => u.id !== id);
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
        }
      }
    
      return {
        users,
        fetchUsuarios,
        fetchUsuarioById,
        createUsuario,
        updateUsuario,
        deleteUsuario
      };
    });
    