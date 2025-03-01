<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRolesStore } from '@/stores/roles'
import { useRoute, useRouter } from 'vue-router'
import type { UsuarioRol } from '@/stores/dtos/UsuarioRol.dto'
import type { UserDto } from '@/stores/dtos/user.dto'
import type { RolesDto } from '@/stores/dtos/Roles.dto'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const rolesStore = useRolesStore()

const editMode = computed(() => route.query.edit === 'true')
const userId = computed(() => (route.query.id ? Number(route.query.id) : null))

const userData = ref({
  nombre: '',
  apellido1: '',
  apellido2: '',
  username: '',
  email: '',
  contrasenia: '',
  profilePic: '',
  roles: [] as number[],
})

onMounted(async () => {
  await rolesStore.fetchRoles()

  if (editMode.value && userId.value) {
    await usersStore.fetchUsuarioConRolesById(userId.value)

    if (usersStore.usuarioConRoles) {
      userData.value = {
        nombre: usersStore.usuarioConRoles.nombre || '',
        apellido1: usersStore.usuarioConRoles.apellido1 || '',
        apellido2: usersStore.usuarioConRoles.apellido2 || '',
        username: usersStore.usuarioConRoles.username || '',
        email: usersStore.usuarioConRoles.email || '',
        contrasenia: usersStore.usuarioConRoles.contrasenia || '',
        profilePic: usersStore.usuarioConRoles.profilePic || '',
        roles: (usersStore.usuarioConRoles.roles as RolesDto[]).map((rol) => rol.id),
      }
    }
  }
})

async function saveUser() {
  let usuarioFinalId: number | null = null

  const usuarioSinRoles: UserDto = {
    id: userId.value || undefined,
    username: userData.value.username,
    email: userData.value.email,
    contrasenia: userData.value.contrasenia,
    nombre: userData.value.nombre || '',
    apellido1: userData.value.apellido1 || '',
    apellido2: userData.value.apellido2 || '',
    profilePic: userData.value.profilePic || '',
  }

  if (editMode.value && userId.value) {
    await usersStore.updateUsuario(userId.value, usuarioSinRoles)
    usuarioFinalId = userId.value
  } else {
    console.log('Creando usuario:', usuarioSinRoles)
    const nuevoUsuario = await usersStore.createUsuario(usuarioSinRoles)

    if (nuevoUsuario && nuevoUsuario.id) {
      usuarioFinalId = nuevoUsuario.id
    }
  }

  if (usuarioFinalId && userData.value.roles.length > 0) {
    const asignacion: UsuarioRol = {
      usuarioId: usuarioFinalId,
      rolesIds: userData.value.roles,
    }
    await usersStore.asignarRolesAUsuario(asignacion)
  }

  router.push('/usuarios')
}
</script>

<template>
  <v-container>
    <v-card class="pa-5">
      <v-form @submit.prevent="saveUser">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field label="Nombre" v-model="userData.nombre" required></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Primer Apellido"
              v-model="userData.apellido1"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Segundo Apellido" v-model="userData.apellido2"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Nombre de Usuario"
              v-model="userData.username"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Email"
              v-model="userData.email"
              type="email"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Contraseña"
              v-model="userData.contrasenia"
              type="text"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Foto de Perfil (URL)" v-model="userData.profilePic"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
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
          </v-col>
        </v-row>
        <v-btn type="submit" color="primary" class="mt-3">
          {{ editMode ? 'Guardar Cambios' : 'Añadir Usuario' }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<style lang="scss">
@import '@/assets/styles/variables.scss';

.v-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.v-card {
  width: 100%;
  max-width: 900px;
  padding: 20px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
}

.v-card-title {
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: $primary-color;
}

.v-text-field,
.v-select {
  background: white !important;
  border-radius: 8px !important;
  box-shadow: none !important;

  .v-input__control {
    border-radius: 8px !important;
    border: 1px solid #ccc !important;
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      border-color: $primary-color;
    }
  }
}

.v-btn {
  background-color: $primary-color !important;
  color: white !important;
  font-weight: bold;
  text-transform: uppercase;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.3s ease-in-out;
  width: 100%;

  &:hover {
    background-color: darken($primary-color, 10%) !important;
  }
}

.v-chip {
  background: $primary-color !important;
  color: white !important;
  font-weight: bold;
}

@media (min-width: 768px) {
  .v-container {
    min-height: 100vh;
    padding: 0;
  }

  .v-card {
    max-width: 900px;
    padding: 30px;
  }

  .v-card-title {
    font-size: 1.6rem;
  }

  .v-btn {
    font-size: 1rem;
  }
}
</style>




