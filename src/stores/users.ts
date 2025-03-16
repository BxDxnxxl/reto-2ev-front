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
      const response = await fetch("https://wannagamesapi.retocsv.es/api/usuario");
      users.value = await response.json();
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  }

  //Obtener todos los usuarios con sus roles
  async function fetchUsuariosConRoles() {
    try {
      const response = await fetch("https://wannagamesapi.retocsv.es/api/usuario/usuarios-con-roles");
      usersWithRoles.value = await response.json();
    } catch (error) {
      console.error("Error al obtener usuarios con roles:", error);
    }
  }

  //Obtener un usuario por ID
  async function fetchUsuarioById(id: number) {
    try {
      const response = await fetch(`https://wannagamesapi.retocsv.es/api/usuario/${id}`);
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
        const response = await fetch("https://wannagamesapi.retocsv.es/api/usuario", {
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
      await fetch(`https://wannagamesapi.retocsv.es/api/usuario/${id}`, {
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

        let contraseniaFinal = usuarioActualizado.contrasenia?.trim() || "";
        const usuarioId = currentUser.value.id ?? 0;

        if (!contraseniaFinal) {
            await fetchUsuarioById(usuarioId);
            const usuarioDesdeApi = users.value.find(u => u.id === usuarioId);

            if (!usuarioDesdeApi || !usuarioDesdeApi.contrasenia) {
                throw new Error("No se pudo obtener la contraseña actual del usuario.");
            }

            contraseniaFinal = usuarioDesdeApi.contrasenia;
        }

        const usuarioParaActualizar: UserDto = {
            id: currentUser.value.id,
            username: usuarioActualizado.username || currentUser.value.username,
            email: usuarioActualizado.email || currentUser.value.email || '',
            nombre: usuarioActualizado.nombre || currentUser.value.nombre,
            apellido1: usuarioActualizado.apellido1 || currentUser.value.apellido1,
            apellido2: usuarioActualizado.apellido2 || currentUser.value.apellido2 || '',
            profilePic: usuarioActualizado.profilePic || currentUser.value.profilePic || '',
            contrasenia: contraseniaFinal
        };

        const response = await fetch(`https://wannagamesapi.retocsv.es/api/usuario/${currentUser.value.id}`, {
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

        await fetchUsuarioById(usuarioId);
        const usuarioActualizadoDesdeApi = users.value.find(u => u.id === usuarioId);

        if (!usuarioActualizadoDesdeApi) {
            throw new Error("Error al obtener el usuario actualizado.");
        }

        const usuarioPlano = JSON.parse(JSON.stringify(usuarioActualizadoDesdeApi));

        currentUser.value = usuarioPlano;

        await set("currentUser", usuarioPlano);

        await fetchUsuarios();

        return currentUser.value;
    } catch (error) {
        console.error('Error en la actualización del usuario:', error);
        throw error;
    }
  }




  //Eliminar un usuario
  async function deleteUsuario(id: number) {
    try {
      await fetch(`https://wannagamesapi.retocsv.es/api/usuario/${id}`, { method: "DELETE" });
      users.value = users.value.filter((u) => u.id !== id);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  }

  //Iniciar sesión y almacenar datos del usuario autenticado
  async function login(usuarioLogin: UserLoginDto) {
    try {
      const response = await fetch("https://wannagamesapi.retocsv.es/api/auth/login", {
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
      const response = await fetch("https://wannagamesapi.retocsv.es/api/usuario/CrearDesdeLogin", {
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
      const response = await fetch(`https://wannagamesapi.retocsv.es/api/Usuario/detalle/${id}`);

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
      const response = await fetch("https://wannagamesapi.retocsv.es/api/Rol/asignarRoles", {
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
