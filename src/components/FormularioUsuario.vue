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
import Swal from 'sweetalert2';

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
      await Swal.fire({
        title: 'Campos incompletos',
        text: `Por favor complete los siguientes campos: ${missingFields.join(', ')}`,
        icon: 'warning',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.value.email.trim())) {
      await Swal.fire({
        title: 'Email inválido',
        text: 'Por favor, introduce un email válido',
        icon: 'warning',
        confirmButtonColor: '#10b981'
      });
      return;
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

    await Swal.fire({
      title: editMode.value ? 'Usuario actualizado' : 'Usuario creado',
      text: editMode.value ? 'Los cambios han sido guardados correctamente' : 'El usuario ha sido creado correctamente',
      icon: 'success',
      confirmButtonColor: '#10b981'
    });

    router.push('/dashboard');
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    await Swal.fire({
      title: 'Error',
      text: 'Hubo un problema al guardar el usuario. Por favor, inténtelo de nuevo.',
      icon: 'error',
      confirmButtonColor: '#ef4444'
    });
  }
}

function cancelar() {
  router.push('/dashboard');
}
</script>

<template>
  <div class="usuario-form">
    <div class="usuario-form__contenedor">
      <!-- Título y descripción -->
      <div class="usuario-form__header">
        <h2 class="usuario-form__titulo">
          {{ editMode ? '✏️ Editar Usuario' : '👤 Añadir Usuario' }}
        </h2>
        <p class="usuario-form__descripcion">
          {{ editMode ? 'Modifica los datos del usuario seleccionado' : 'Complete los datos para crear un nuevo usuario' }}
        </p>
      </div>

      <!-- Formulario -->
      <div class="usuario-form__card">
        <v-form @submit.prevent="saveUser" class="usuario-form__form">
          <div class="usuario-form__grid">
            <!-- Datos básicos -->
            <div class="usuario-form__section">
              <h3 class="usuario-form__section-title">Datos Personales</h3>
              
              <div class="usuario-form__row">
                <div class="usuario-form__field">
                  <v-text-field 
                    label="Nombre" 
                    v-model="userData.nombre" 
                    required 
                    variant="outlined"
                    density="comfortable"
                  />
                </div>
                <div class="usuario-form__field">
                  <v-text-field 
                    label="Primer Apellido" 
                    v-model="userData.apellido1" 
                    required 
                    variant="outlined"
                    density="comfortable"
                  />
                </div>
              </div>

              <div class="usuario-form__row">
                <div class="usuario-form__field">
                  <v-text-field 
                    label="Segundo Apellido" 
                    v-model="userData.apellido2" 
                    variant="outlined"
                    density="comfortable"
                  />
                </div>
                <div class="usuario-form__field">
                  <v-file-input
                    label="Foto de Perfil"
                    accept="image/*"
                    @change="onFileChange"
                    prepend-icon="mdi-camera"
                    variant="outlined"
                    density="comfortable"
                  />
                </div>
              </div>
            </div>

            <!-- Datos de acceso -->
            <div class="usuario-form__section">
              <h3 class="usuario-form__section-title">Datos de Acceso</h3>
              
              <div class="usuario-form__row">
                <div class="usuario-form__field">
                  <v-text-field 
                    label="Nombre de Usuario" 
                    v-model="userData.username" 
                    required 
                    variant="outlined"
                    density="comfortable"
                  />
                </div>
                <div class="usuario-form__field">
                  <v-text-field 
                    label="Email" 
                    v-model="userData.email" 
                    type="email" 
                    required 
                    variant="outlined"
                    density="comfortable"
                  />
                </div>
              </div>

              <div class="usuario-form__row">
                <div class="usuario-form__field usuario-form__field--full">
                  <v-text-field
                    label="Contraseña"
                    v-model="userData.contrasenia"
                    type="password"
                    :hint="editMode ? 'Dejar en blanco si no se quiere cambiar' : ''"
                    variant="outlined"
                    density="comfortable"
                  />
                </div>
              </div>
            </div>

            <!-- Configuración -->
            <div class="usuario-form__section">
              <h3 class="usuario-form__section-title">Configuración</h3>
              
              <div class="usuario-form__checkbox-container">
                <v-checkbox
                  label="Marcar como usuario afiliado"
                  v-model="marcarAfiliado"
                  color="primary"
                />
              </div>

              <div v-if="marcarAfiliado" class="usuario-form__field">
                <v-select
                  label="Seleccionar empresa afiliada"
                  v-model="empresaSeleccionada"
                  :items="empresasStore.empresas"
                  item-title="nombre"
                  item-value="id"
                  required
                  hint="Selecciona la empresa a la que se afilia este usuario"
                  variant="outlined"
                  density="comfortable"
                />
              </div>

              <div class="usuario-form__field">
                <v-select
                  label="Roles"
                  v-model="userRoles"
                  :items="rolesStore.roles"
                  item-title="nombre"
                  item-value="id"
                  multiple
                  chips
                  persistent-hint
                  variant="outlined"
                  density="comfortable"
                />
              </div>
            </div>
          </div>

          <div class="usuario-form__actions">
            <v-btn 
              color="error" 
              variant="outlined" 
              @click="cancelar"
              class="usuario-form__btn-cancelar"
            >
              Cancelar
            </v-btn>
            <v-btn 
              type="submit" 
              color="primary" 
              class="usuario-form__btn-guardar"
            >
              {{ editMode ? 'Guardar Cambios' : 'Añadir Usuario' }}
            </v-btn>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.usuario-form {
  padding: 0;
  background-color: $background-color;
  color: $text-color;
  min-height: 100vh;

  // Tablet y desktop
  @media (min-width: 768px) {
    padding: 0;
  }

  &__contenedor {
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
    padding: 0;

    // Desktop
    @media (min-width: 1024px) {
      max-width: 1400px;
      gap: $spacing-large;
    }
  }

  &__header {
    text-align: center;
    padding: $spacing-large $spacing-medium;
    background: $card-background;
    border-radius: 0;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    gap: $spacing-small;
    align-items: center;
    border: none;
    margin: 0;
    width: 100%;

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-xl;
      gap: $spacing-medium;
    }
  }

  &__titulo {
    font-size: $font-size-large;
    font-weight: 700;
    color: $text-color;
    margin: 0;
    background: $primary-gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    // Desktop
    @media (min-width: 768px) {
      font-size: $font-size-xlarge;
    }
  }

  &__descripcion {
    color: rgba($text-color, 0.8);
    font-size: $font-size-small;
    margin: 0;
    font-weight: 500;

    // Desktop
    @media (min-width: 768px) {
      font-size: $font-size-base;
    }
  }

  &__card {
    background: $card-background;
    border-radius: 0;
    box-shadow: none;
    border: 1px solid rgba($primary-color, 0.2);
    margin: 0 $spacing-small;
    overflow: hidden;

    // Desktop
    @media (min-width: 768px) {
      margin: 0 $spacing-medium;
      border-radius: $border-radius;
      box-shadow: $box-shadow;
    }
  }

  &__form {
    padding: $spacing-medium;

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-large;
    }
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: $spacing-large;

    // Desktop
    @media (min-width: 1024px) {
      gap: $spacing-xl;
    }
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
  }

  &__section-title {
    font-size: $font-size-base;
    font-weight: 700;
    color: $primary-color;
    margin: 0;
    padding-bottom: $spacing-small;
    border-bottom: 2px solid $primary-color;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    // Desktop
    @media (min-width: 768px) {
      font-size: $font-size-large;
    }
  }

  &__row {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;

    // Desktop
    @media (min-width: 768px) {
      flex-direction: row;
      gap: $spacing-large;
    }
  }

  &__field {
    flex: 1;

    &--full {
      flex: 1;

      // Desktop
      @media (min-width: 768px) {
        max-width: 50%;
      }
    }
  }

  &__checkbox-container {
    padding: $spacing-small 0;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
    padding-top: $spacing-large;
    border-top: 1px solid rgba($primary-color, 0.2);
    margin-top: $spacing-large;

    // Desktop
    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: center;
      gap: $spacing-large;
    }
  }

  &__btn-cancelar {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-radius: $border-radius;
    padding: $spacing-small $spacing-large;
    font-size: $font-size-small;
    transition: $transition;
    min-width: 120px;

    // Desktop
    @media (min-width: 768px) {
      font-size: $font-size-base;
      min-width: 150px;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0px 4px 8px rgba($color-error, 0.3);
    }
  }

  &__btn-guardar {
    font-weight: 600;
    background: $primary-gradient;
    color: $text-color;
    border-radius: $border-radius;
    padding: $spacing-small $spacing-large;
    font-size: $font-size-small;
    border: none;
    cursor: pointer;
    transition: $transition;
    box-shadow: $box-shadow;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 120px;

    // Desktop
    @media (min-width: 768px) {
      font-size: $font-size-base;
      min-width: 150px;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0px 4px 8px rgba($primary-color, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// Estilos para los campos de Vuetify
:deep(.v-text-field),
:deep(.v-select),
:deep(.v-file-input) {
  .v-field {
    background: white !important;
    border-radius: $border-radius !important;
    border: 1px solid $color-disabled !important;
    color: $dark-color !important;
    transition: $transition !important;

    &--focused {
      border-color: $primary-color !important;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.2) !important;
    }

    &:hover {
      border-color: rgba($primary-color, 0.5) !important;
    }
  }

  .v-field__input {
    color: $dark-color !important;
    font-size: $font-size-base !important;
  }

  .v-label {
    color: $dark-color !important;
    font-weight: 500 !important;
    font-size: $font-size-base !important;
  }

  .v-field__append-inner {
    .v-icon {
      color: rgba($primary-color, 0.7) !important;
    }
  }
}

:deep(.v-checkbox) {
  .v-selection-control__wrapper {
    .v-selection-control__input {
      .v-icon {
        color: $primary-color !important;
      }
    }
  }

  .v-label {
    color: $text-color !important;
    font-weight: 500 !important;
    font-size: $font-size-base !important;
  }
}

:deep(.v-chip) {
  background: rgba($primary-color, 0.15) !important;
  color: $primary-color !important;
  border: 1px solid rgba($primary-color, 0.3) !important;
  font-weight: 600 !important;
  
  .v-chip__close {
    color: $primary-color !important;
  }
}
</style>