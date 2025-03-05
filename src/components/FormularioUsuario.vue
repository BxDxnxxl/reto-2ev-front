<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRolesStore } from '@/stores/roles'
import { useRoute, useRouter } from 'vue-router'
import type { RolAsignacionDto } from '@/stores/dtos/UsuarioRol.dto'
import type { UserDto } from '@/stores/dtos/user.dto'
import type { RolesDto } from '@/stores/dtos/Roles.dto'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const rolesStore = useRolesStore()

// Computed for edit mode and user ID
const editMode = computed(() => route.query.edit === 'true')
const userId = computed(() => {
  const id = route.query.id ? Number(route.query.id) : null
  return id
})

// Initial user data structure
const userData = ref<UserDto>({
  username: '',
  email: '',
  contrasenia: '',
  nombre: '',
  apellido1: '',
  apellido2: '',
  profilePic: '',
})

// Additional state for roles
const userRoles = ref<number[]>([])

// Fetch roles and user data on component mount
onMounted(async () => {
  await rolesStore.fetchRoles()

  if (editMode.value && userId.value) {
    await usersStore.fetchUsuarioConRolesById(userId.value)

    if (usersStore.usuarioConRoles) {
      // Populate user data
      userData.value = {
        id: usersStore.usuarioConRoles.id,
        username: usersStore.usuarioConRoles.username || '',
        email: usersStore.usuarioConRoles.email || '',
        contrasenia: '',
        nombre: usersStore.usuarioConRoles.nombre || '',
        apellido1: usersStore.usuarioConRoles.apellido1 || '',
        apellido2: usersStore.usuarioConRoles.apellido2 || '',
        profilePic: usersStore.usuarioConRoles.profilePic || '',
      }

      // Populate roles
      userRoles.value = usersStore.usuarioConRoles.roles.map(rol => rol.id)
    }
  }
})

async function saveUser() {
  try {
    const requiredFields = [
      { field: userData.value.username, message: 'Nombre de usuario' },
      { field: userData.value.email, message: 'Email' },
      { field: userData.value.nombre, message: 'Nombre' },
      { field: userData.value.apellido1, message: 'Primer apellido' }
    ];

    const missingFields = requiredFields
      .filter(req => !req.field || req.field.trim() === '')
      .map(req => req.message);

    if (missingFields.length > 0) {
      throw new Error(`Por favor complete los siguientes campos: ${missingFields.join(', ')}`);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.value.email.trim())) {
      throw new Error('Por favor, introduce un email válido');
    }

    // Si está en edición y la contraseña está vacía, se mantiene la actual
    const userToSave: UserDto = {
      ...userData.value,
      username: userData.value.username.trim(),
      email: userData.value.email.trim(),
      contrasenia: editMode.value && !userData.value.contrasenia ? usersStore.usuarioConRoles?.contrasenia : userData.value.contrasenia
    };

    let savedUserId: number | undefined;

    if (editMode.value && userId.value) {
      await usersStore.updateUsuario(userId.value, userToSave);
      savedUserId = userId.value;
    } else {
      const createdUser = await usersStore.createUsuario(userToSave);
      savedUserId = createdUser?.id;
    }

    if (savedUserId && userRoles.value.length > 0) {
      const roleAssignment: RolAsignacionDto = {
        usuarioId: savedUserId,
        rolesIds: userRoles.value
      };
      await usersStore.asignarRolesAUsuario(roleAssignment);
    }

    router.push('/usuarios');
  } catch (error) {
    console.error("Error al guardar usuario:", error);
  }
}
</script>

<template>
  <v-container>
    <v-card class="pa-5">
      <v-form @submit.prevent="saveUser">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field 
              label="Nombre" 
              v-model="userData.nombre" 
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Primer Apellido"
              v-model="userData.apellido1"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field 
              label="Segundo Apellido" 
              v-model="userData.apellido2"
            ></v-text-field>
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
              type="password"
              :hint="editMode ? 'Dejar en blanco si no se quiere cambiar' : ''"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field 
              label="Foto de Perfil (URL)" 
              v-model="userData.profilePic"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              label="Roles"
              v-model="userRoles"
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

.v-text-field,
.v-select {
  background: white !important;
  border-radius: 8px !important;
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
</style>