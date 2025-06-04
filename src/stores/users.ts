import { defineStore } from "pinia";
import { ref } from "vue";
import type { UserDto } from "@/stores/dtos/user.dto";
import type { UserLoginDto } from "@/stores/dtos/userLogin.dto";
import type { UserRegistrorDto } from "@/stores/dtos/userRegistro.dto";
import type { UserInfoDto } from "@/stores/dtos/userInfoListado.dto";
import type { RolAsignacionDto } from "@/stores/dtos/UsuarioRol.dto";
import type { UserUpdateDto } from "@/stores/dtos/UserUpdateDto";
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
      return usuario;
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  }

  async function createUsuario(formData: FormData) {
  try {
    const res = await fetch('https://wannagamesapi.retocsv.es/api/Usuario', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error(await res.text());

    await fetchUsuarios();
    return await res.json();
  } catch (error) {
    console.error('Error al crear usuario:', error);
  }
}


async function updateUsuario(id: number, userDto: UserUpdateDto) {
  try {
    const formData = new FormData();
    formData.append('Username', userDto.username.trim());
    formData.append('Email', userDto.email.trim());
    formData.append('Contrasenia', userDto.contraseña ?? '');
    formData.append('Nombre', userDto.nombre ?? '');
    formData.append('Apellido1', userDto.apellido1 ?? '');
    formData.append('Apellido2', userDto.apellido2 ?? '');

    // ✅ Siempre enviar ProfilePic
    if (userDto.profilePic && typeof userDto.profilePic !== 'string') {
      formData.append('ProfilePic', userDto.profilePic);
    } else {
      const emptyFile = new Blob([], { type: 'image/png' });
      formData.append('ProfilePic', emptyFile, 'empty.png');
    }

    const res = await fetch(`https://wannagamesapi.retocsv.es/api/usuario/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!res.ok) throw new Error(await res.text());

    await fetchUsuarios();
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
  }
}


  async function updateCurrentUser(usuarioActualizado: UserUpdateDto) {
  try {
    if (!currentUser.value) throw new Error("No hay usuario autenticado.");
    const usuarioId = currentUser.value.id ?? 0;

    let finalPassword = usuarioActualizado.contraseña?.trim();

    if (!finalPassword) {
      const usuarioFull = await fetchUsuarioById(usuarioId);
      finalPassword = usuarioFull?.contrasenia?.trim() ?? "";
    }

    const formData = new FormData();
    formData.append("Username", usuarioActualizado.username);
    formData.append("Email", usuarioActualizado.email);
    formData.append("Contrasenia", finalPassword);
    formData.append("Nombre", usuarioActualizado.nombre ?? "");
    formData.append("Apellido1", usuarioActualizado.apellido1 ?? "");
    formData.append("Apellido2", usuarioActualizado.apellido2 ?? "");

    if (usuarioActualizado.profilePic instanceof File) {
      formData.append("ProfilePic", usuarioActualizado.profilePic);
    }

    const response = await fetch(`https://wannagamesapi.retocsv.es/api/usuario/${usuarioId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${tokenLogin.value}`
      },
      body: formData,
    });

    if (!response.ok) throw new Error(`Error en la actualización: ${await response.text()}`);

    const loginDto: UserLoginDto = {
      username: usuarioActualizado.username,
      password: finalPassword
    };

    const loginSuccess = await login(loginDto);
    return loginSuccess;
  } catch (error) {
    console.error("Error en la actualización del usuario:", error);
    return false;
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
