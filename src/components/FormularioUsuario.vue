<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useRolesStore } from '@/stores/roles';
import { useRoute, useRouter } from 'vue-router';
import { useEmpresasStore } from '@/stores/empresasStore';
import { useUsuariosEmpresasStore } from '@/stores/usuariosEmpresasStore';

import type { RolAsignacionDto } from '@/stores/dtos/UsuarioRol.dto';
import type { UserDto } from '@/stores/dtos/user.dto';
import type { UserUpdateDto } from '@/stores/dtos/UserUpdateDto';

const route = useRoute();
const router = useRouter();

const usersStore = useUsersStore();
const rolesStore = useRolesStore();
const empresasStore = useEmpresasStore();
const usuariosEmpresasStore = useUsuariosEmpresasStore();

const editMode = computed(() => route.query.edit === 'true');
const userId = computed(() => route.query.id ? Number(route.query.id) : null);

const userData = ref<UserDto>({
  username: '',
  email: '',
  contrasenia: '',
  nombre: '',
  apellido1: '',
  apellido2: '',
  profilePic: null
});

const userRoles = ref<number[]>([]);
const marcarAfiliado = ref(false);
const empresaSeleccionada = ref<number | null>(null);

onMounted(async () => {
  await rolesStore.fetchRoles();
  await empresasStore.fetchEmpresas();

  if (editMode.value && userId.value) {
    await usersStore.fetchUsuarioConRolesById(userId.value);

    if (usersStore.usuarioConRoles) {
      userData.value = {
        id: usersStore.usuarioConRoles.id,
        username: usersStore.usuarioConRoles.username ?? '',
        email: usersStore.usuarioConRoles.email ?? '',
        contrasenia: '',
        nombre: usersStore.usuarioConRoles.nombre ?? '',
        apellido1: usersStore.usuarioConRoles.apellido1 ?? '',
        apellido2: usersStore.usuarioConRoles.apellido2 ?? '',
        profilePic: null
      };

      userRoles.value = usersStore.usuarioConRoles.roles.map((rol: any) => rol.id);
      marcarAfiliado.value = userRoles.value.includes(5);

      const empresasUsuario = await usuariosEmpresasStore.getEmpresasDeUsuario(userId.value);
      if (empresasUsuario.length > 0) {
        empresaSeleccionada.value = empresasUsuario[0];
      }
    }
  }
});

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) userData.value.profilePic = file;
}
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

    let savedUserId: number | undefined;

    if (editMode.value && userId.value) {
      const updateDto: UserUpdateDto = {
        username: userData.value.username.trim(),
        email: userData.value.email.trim(),
        contraseña: userData.value.contrasenia || '',
        nombre: userData.value.nombre?.trim() || '',
        apellido1: userData.value.apellido1?.trim() || '',
        apellido2: userData.value.apellido2?.trim() || '',
        profilePic: userData.value.profilePic instanceof File ? userData.value.profilePic : null
      };

      await usersStore.updateUsuario(userId.value, updateDto);
      savedUserId = userId.value;
    } else {
      // ⚠️ Usar imagen por defecto si no se ha subido ninguna
      if (!(userData.value.profilePic instanceof File)) {
        const response = await fetch('/predefinida.jpg');
        const blob = await response.blob();
        const defaultFile = new File([blob], 'predefinida.jpg', { type: blob.type });
        userData.value.profilePic = defaultFile;
      }

      const formData = new FormData();
      formData.append('Username', userData.value.username.trim());
      formData.append('Email', userData.value.email.trim());
      formData.append('Contrasenia', userData.value.contrasenia || '');
      formData.append('Nombre', userData.value.nombre?.trim() || '');
      formData.append('Apellido1', userData.value.apellido1?.trim() || '');
      formData.append('Apellido2', userData.value.apellido2?.trim() || '');
      formData.append('ProfilePic', userData.value.profilePic);

      const created = await usersStore.createUsuario(formData);
      savedUserId = created?.id;
    }

    if (savedUserId) {
      if (marcarAfiliado.value && !userRoles.value.includes(5)) {
        userRoles.value.push(5);
      }
      if (!marcarAfiliado.value) {
        userRoles.value = userRoles.value.filter(id => id !== 5);
      }

      const roleAssignment: RolAsignacionDto = {
        usuarioId: savedUserId,
        rolesIds: userRoles.value
      };
      await usersStore.asignarRolesAUsuario(roleAssignment);

      if (marcarAfiliado.value && empresaSeleccionada.value) {
        await usuariosEmpresasStore.addRelacion({
          idUsuario: savedUserId,
          idEmpresa: empresaSeleccionada.value
        });
      } else {
        const empresasUsuario = await usuariosEmpresasStore.getEmpresasDeUsuario(savedUserId);
        if (empresasUsuario.length > 0) {
          await usuariosEmpresasStore.deleteRelacion(savedUserId, empresasUsuario[0]);
        }
      }
    }

    router.push('/dashboard');
  } catch (error) {
    console.error('Error al guardar usuario:', error);
  }
}
</script>

<template>
  <v-container>
    <v-card class="pa-5">
      <v-form @submit.prevent="saveUser">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field label="Nombre" v-model="userData.nombre" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Primer Apellido" v-model="userData.apellido1" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Segundo Apellido" v-model="userData.apellido2" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Nombre de Usuario" v-model="userData.username" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Email" v-model="userData.email" type="email" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Contraseña"
              v-model="userData.contrasenia"
              type="password"
              :hint="editMode ? 'Dejar en blanco si no se quiere cambiar' : ''"
            />
          </v-col>
          <v-col cols="12" md="6">
          <v-file-input
              label="Foto de Perfil"
              accept="image/*"
              @change="onFileChange"
              prepend-icon="mdi-camera"
            />
          </v-col>

          <v-col cols="12">
            <v-checkbox
              label="Marcar como usuario afiliado"
              v-model="marcarAfiliado"
            />
          </v-col>

          <v-col v-if="marcarAfiliado" cols="12">
            <v-select
              label="Seleccionar empresa afiliada"
              v-model="empresaSeleccionada"
              :items="empresasStore.empresas"
              item-title="nombre"
              item-value="id"
              required
              hint="Selecciona la empresa a la que se afilia este usuario"
            />
          </v-col>

          <v-col cols="12">
            <v-select
              label="Roles"
              v-model="userRoles"
              :items="rolesStore.roles"
              item-title="nombre"
              item-value="id"
              multiple
              chips
              persistent-hint
            />
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
  align-items: flex-start;
  min-height: 100vh;
  padding: $spacing-xxl $spacing-large $spacing-large;
  background-color: $background-color;
}

.v-card {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: $spacing-large;
  border-radius: $border-radius;
  background: $card-background;
  box-shadow: $box-shadow;
  color: $dark-color;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-4px);
  }
}

.v-text-field,
.v-select,
.v-file-input {
  .v-input__control {
    background: white !important;
    border-radius: $border-radius !important;
    border: 1px solid $color-disabled !important;
    color: $dark-color !important;

    input,
    .v-field__input {
      color: $dark-color !important;
      font-size: $font-size-base;
    }
  }

  .v-label {
    color: $dark-color !important;
    font-weight: 500;
    font-size: $font-size-base;
  }
}

.v-btn {
  background-color: $btn-color !important;
  color: white !important;
  font-weight: bold;
  text-transform: uppercase;
  padding: $spacing-small $spacing-large;
  border-radius: $border-radius;
  transition: $transition;
  width: 100%;

  &:hover {
    background-color: darken($btn-color, 10%) !important;
  }
}
</style>