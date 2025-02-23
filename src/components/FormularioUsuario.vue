<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useUsersStore } from "@/stores/users";
import { useRolesStore } from "@/stores/roles";
import { useRoute, useRouter } from "vue-router";
import type { UsuarioRol } from "@/stores/dtos/UsuarioRol.dto";
import type { UserDto } from "@/stores/dtos/user.dto";
import type { RolesDto } from "@/stores/dtos/Roles.dto";

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();
const rolesStore = useRolesStore();

const editMode = computed(() => route.query.edit === "true");
const userId = computed(() => (route.query.id ? Number(route.query.id) : null));

const userData = ref({
  nombre: "",
  apellido1: "",
  apellido2: "",
  username: "",
  email: "",
  contrasenia: "",
  profilePic: "",
  roles: [] as number[],
});

onMounted(async () => {
  await rolesStore.fetchRoles();

  if (editMode.value && userId.value) {
    await usersStore.fetchUsuarioConRolesById(userId.value);
    if (usersStore.usuarioConRoles) {
      userData.value = {
        nombre: usersStore.usuarioConRoles.nombre || "",
        apellido1: usersStore.usuarioConRoles.apellido1 || "",
        apellido2: usersStore.usuarioConRoles.apellido2 || "",
        username: usersStore.usuarioConRoles.username || "",
        email: usersStore.usuarioConRoles.email || "",
        contrasenia: "",
        profilePic: usersStore.usuarioConRoles.profilePic || "",
        roles: (usersStore.usuarioConRoles.roles as RolesDto[]).map((rol) => rol.id),
      };
    }
  }
});

async function saveUser() {
  let usuarioFinalId: number | null = null;

  const usuarioSinRoles: UserDto = {
    username: userData.value.username,
    email: userData.value.email,
    contrasenia: userData.value.contrasenia,
    nombre: userData.value.nombre || "",
    apellido1: userData.value.apellido1 || "",
    apellido2: userData.value.apellido2 || "",
    profilePic: userData.value.profilePic || "",
  };

  if (editMode.value && userId.value) {
    await usersStore.updateUsuario(userId.value, usuarioSinRoles);
    usuarioFinalId = userId.value;
  } else {
    const nuevoUsuario = await usersStore.createUsuario(usuarioSinRoles);
    if (nuevoUsuario && nuevoUsuario.id) {
      usuarioFinalId = nuevoUsuario.id;
    }
  }

  if (usuarioFinalId) {
    const asignacion: UsuarioRol = {
      usuarioId: usuarioFinalId,
      rolesIds: userData.value.roles,
    };
    await usersStore.asignarRolesAUsuario(asignacion);
  }

  router.push("/usuarios");
}
</script>

<template>
  <v-container>
    <v-card class="pa-5">
      <v-form @submit.prevent="saveUser">
        <v-card-title>{{ editMode ? "Editar Usuario" : "Añadir Usuario" }}</v-card-title>

        <v-text-field label="Nombre" v-model="userData.nombre" required></v-text-field>
        <v-text-field label="Primer Apellido" v-model="userData.apellido1" required></v-text-field>
        <v-text-field label="Segundo Apellido" v-model="userData.apellido2"></v-text-field>
        <v-text-field label="Nombre de Usuario" v-model="userData.username" required></v-text-field>
        <v-text-field label="Email" v-model="userData.email" type="email" required></v-text-field>

        <v-text-field
          label="Contraseña"
          v-model="userData.contrasenia"
          type="password"
          required
        ></v-text-field>

        <v-text-field label="Foto de Perfil (URL)" v-model="userData.profilePic"></v-text-field>

        <v-select
          label="Roles"
          v-model="userData.roles"
          :items="rolesStore.roles"
          item-title="nombre"
          item-value="id"
          multiple
          chips
          persistent-hint
        ></v-select>

        <v-btn type="submit" color="primary" class="mt-3">
          {{ editMode ? "Guardar Cambios" : "Añadir Usuario" }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-card {
  max-width: 500px;
  margin: auto;
}
</style>
