import { defineStore } from "pinia";
import { ref } from "vue";
import type { UserDto } from "@/stores/dtos/user.dto";
import type { UserLoginDto } from "@/stores/dtos/userLogin.dto";
import type { UserRegistrorDto } from "@/stores/dtos/userRegistro.dto";
import type { UserInfoDto } from "@/stores/dtos/userInfoListado.dto";
import type { RolAsignacionDto } from "@/stores/dtos/UsuarioRol.dto";
import { useRouter } from "vue-router";
import { get, set, del } from "idb-keyval";
const router = useRouter();

export const useUsersStore = defineStore("users", () => {
  const users = ref<UserDto[]>([]);
  const usersWithRoles = ref<UserInfoDto[]>([]);
  const currentUser = ref<UserInfoDto | null>(null);
  const usuarioConRoles = ref<UserInfoDto | null>(null);
  const tokenLogin = ref<string | null>(null);

  async function loadPersistedData() {
    currentUser.value = await get("currentUser") ?? null;
    tokenLogin.value = await get("tokenLogin") ?? null;
  }
  loadPersistedData();

  //Obtener todos los usuarios
  async function fetchUsuarios() {
    try {
      const response = await fetch("http://localhost:4444/api/usuario");
      users.value = await response.json();
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  }

  //Obtener todos los usuarios con sus roles
  async function fetchUsuariosConRoles() {
    try {
      const response = await fetch("http://localhost:4444/api/usuario/usuarios-con-roles");
      usersWithRoles.value = await response.json();
    } catch (error) {
      console.error("Error al obtener usuarios con roles:", error);
    }
  }

  //Obtener un usuario por ID
  async function fetchUsuarioById(id: number) {
    try {
      const response = await fetch(`http://localhost:4444/api/usuario/${id}`);
      const usuario = await response.json();
      users.value = users.value.filter((u) => u.id !== id);
      users.value.push(usuario);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  }

  //Crear un nuevo usuario
  async function createUsuario(nuevoUsuario: UserDto) {
    try {
        const response = await fetch("http://localhost:4444/api/usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoUsuario),
        });

        console.log("Raw Response:", response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error al crear usuario:", errorText);
            return null;
        }

        const idString = await response.text();
        const userId = parseInt(idString, 10);

        if (isNaN(userId)) {
            console.error("Error: No se pudo convertir la respuesta a un ID válido.");
            return null;
        }

        console.log("Usuario creado con ID:", userId);
        await fetchUsuarios();
        return { id: userId };
    } catch (error) {
        console.error("Error en createUsuario:", error);
        return null;
    }
}


  //Actualizar un usuario existente
  async function updateUsuario(id: number, usuarioActualizado: UserDto) {
    try {
      console.log(usuarioActualizado)
      await fetch(`http://localhost:4444/api/usuario/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioActualizado),
      });
      await fetchUsuarios(); //Refresca la lista después de actualizar
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  }

  async function updateCurrentUser(usuarioActualizado: UserDto) {
      try {
        if (!currentUser.value) {
          throw new Error("No hay usuario autenticado.");
        }

        // Preparar el objeto para enviar al backend
        const usuarioParaActualizar: UserDto = {
          id: currentUser.value.id,
          username: usuarioActualizado.username || currentUser.value.username,
          email: usuarioActualizado.email || currentUser.value.email || '',
          nombre: usuarioActualizado.nombre || currentUser.value.nombre,
          apellido1: usuarioActualizado.apellido1 || currentUser.value.apellido1,
          apellido2: usuarioActualizado.apellido2 || currentUser.value.apellido2 || '',
          profilePic: usuarioActualizado.profilePic || currentUser.value.profilePic || '',
          contrasenia: usuarioActualizado.contrasenia && usuarioActualizado.contrasenia.trim() !== ""
            ? usuarioActualizado.contrasenia 
            : currentUser.value.contrasenia
        };

        const response = await fetch(`http://localhost:4444/api/usuario/${currentUser.value.id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenLogin}`
          },
          body: JSON.stringify(usuarioParaActualizar),
        });

        if (!response.ok) {
          throw new Error(`Error en la actualización: ${await response.text()}`);
        }

        const updatedUser = { 
          ...currentUser.value, 
          ...usuarioActualizado,
          contrasenia: currentUser.value.contrasenia
        };

        currentUser.value = updatedUser;
        
        await fetchUsuarios(); // Refresca la lista después de actualizar

        return updatedUser;
      } catch (error) {
        console.error('Error en la actualización del usuario:', error);
        throw error;
      }
  }

  //Eliminar un usuario
  async function deleteUsuario(id: number) {
    try {
      await fetch(`http://localhost:4444/api/usuario/${id}`, { method: "DELETE" });
      users.value = users.value.filter((u) => u.id !== id);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  }

  //Iniciar sesión y almacenar datos del usuario autenticado
  async function login(usuarioLogin: UserLoginDto) {
    try {
      const response = await fetch("http://localhost:4444/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioLogin),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al iniciar sesión: ${errorText || response.statusText}`);
      }
  
      const data: { token: string; usuario: UserInfoDto } | null = await response.json();
  
      if (data) {
        currentUser.value = data.usuario;
        tokenLogin.value = data.token;

        await set("currentUser", data.usuario);
        await set("tokenLogin", data.token);
  
        return true;
      }
    } catch (error) {
   
    }
  }

  //Registrar un nuevo usuario desde el formulario
  async function register(usuarioNuevo: UserRegistrorDto) {
    try {
      const response = await fetch("http://localhost:4444/api/usuario/CrearDesdeLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioNuevo),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en respuesta:", errorText);
        throw new Error("Error al registrar usuario");
      }
      return true;
      console.log("Usuario registrado correctamente");
    } catch (error) {
      console.error("Error en registro:", error);
    }
  }

  async function fetchUsuarioConRolesById(id: number) {
    try {
      const response = await fetch(`http://localhost:4444/api/Usuario/detalle/${id}`);

      if (!response.ok) {
        throw new Error(`Error al obtener usuario con roles: ${response.statusText}`);
      }

      usuarioConRoles.value = await response.json();
    } catch (error) {
      console.error("Error en fetchUsuarioConRolesById:", error);
    }
  }

  async function asignarRolesAUsuario(asignacion: RolAsignacionDto) {
    try {
      const response = await fetch("http://localhost:4444/api/Rol/asignarRoles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asignacion),
      });
  
      if (!response.ok) {
        throw new Error(`Error al asignar roles: ${response.statusText}`);
      }
  
    } catch (error) {
    }
  }

  async function logout() {
    currentUser.value = null;
    tokenLogin.value = null;

    await del("currentUser");
    await del("tokenLogin");
  }
  

  return {
    users,
    usersWithRoles,
    currentUser,
    usuarioConRoles,
    tokenLogin,
    fetchUsuarios,
    fetchUsuariosConRoles,
    fetchUsuarioById,
    createUsuario,
    updateUsuario,
    updateCurrentUser,
    deleteUsuario,
    login,
    register,
    fetchUsuarioConRolesById,
    asignarRolesAUsuario,
    logout
  };
});
