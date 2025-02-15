import { defineStore } from "pinia";
import { ref } from "vue";
import type { UserDto } from "@/stores/dtos/user.dto";
import type { UserLoginDto } from "@/stores/dtos/userLogin.dto";
import type { UserRegistroDto } from "@/stores/dtos/userRegistro.dto";
import type { UsersInfo } from "@/stores/dtos/userInfoListado.dto";

export const useUsersStore = defineStore("users", () => {
  const users = ref<UserDto[]>([]);

  const usersWithRoles = ref<UsersInfo[]>([]);

  const currentUser = ref<UsersInfo | null>(null);

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
      await fetch("http://localhost:4444/api/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });
      await fetchUsuarios(); // Refresca la lista después de crear
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  }

  //Actualizar un usuario existente
  async function updateUsuario(id: number, usuarioActualizado: UserDto) {
    try {
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
      const response = await fetch("http://localhost:4444/api/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioLogin),
      });

      if (!response.ok) {
        throw new Error("Error al iniciar sesión");
      }

      const data: UsersInfo = await response.json();
      currentUser.value = data; //Almacenar usuario logueado
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
        throw new Error("Error al registrar usuario");
      }

      console.log("Usuario registrado correctamente");
    } catch (error) {
      console.error("Error en registro:", error);
    }
  }

  return {
    users,
    usersWithRoles,
    currentUser,
    fetchUsuarios,
    fetchUsuariosConRoles,
    fetchUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    login,
    register,
  };
});
