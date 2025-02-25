import { defineStore } from "pinia";
import { ref } from "vue";
import type { UserDto } from "@/stores/dtos/user.dto";
import type { UserLoginDto } from "@/stores/dtos/userLogin.dto";
import type { UserRegistroDto } from "@/stores/dtos/userRegistro.dto";
import type { UsersInfo } from "@/stores/dtos/userInfoListado.dto";
import type { UsuarioRol } from "@/stores/dtos/UsuarioRol.dto";
import { useRouter } from "vue-router";
const router = useRouter();

export const useUsersStore = defineStore("users", () => {
  const users = ref<UserDto[]>([]);

  const usersWithRoles = ref<UsersInfo[]>([]);
  const currentUser = ref<UsersInfo | null>(null);
  const usuarioConRoles = ref<UsersInfo | null>(null);
  const tokenLogin = ref<string | null>(null)

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
      await fetchUsuarios(); // Refresca la lista después de actualizar
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
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

      const data: { token: string; usuario: UsersInfo } | null = await response.json();

      if (data) {
        currentUser.value = data.usuario;
        tokenLogin.value = data.token;
        console.log(currentUser)
        console.log(tokenLogin)
        return true;
      } else {
        console.warn("Inicio de sesión exitoso, pero no se recibió información del usuario.");
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  }

  

  //Registrar un nuevo usuario desde el formulario
  async function register(usuarioNuevo: UserRegistroDto) {
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

  async function asignarRolesAUsuario(asignacion: UsuarioRol) {
    try {
      const response = await fetch("http://localhost:4444/api/Rol/asignarRoles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asignacion),
      });
  
      if (!response.ok) {
        throw new Error(`Error al asignar roles: ${response.statusText}`);
      }
  
      console.log(`Roles asignados correctamente al usuario ${asignacion.usuarioId}`);
    } catch (error) {
      console.error("Error en asignarRolesAUsuario:", error);
    }
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
    deleteUsuario,
    login,
    register,
    fetchUsuarioConRolesById,
    asignarRolesAUsuario
  };
});
