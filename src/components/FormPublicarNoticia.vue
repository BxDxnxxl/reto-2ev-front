<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useUsuariosEmpresasStore } from '@/stores/usuariosEmpresasStore';
import type { PublicacionEmpresaCreateDto } from '@/stores/dtos/PublicacionEmpresaCreateDto';
import Swal from 'sweetalert2'

const emit = defineEmits(['guardar']);
const usersStore = useUsersStore();
const usuariosEmpresasStore = useUsuariosEmpresasStore();

const imagenFile = ref<File | null>(null);
const puedeDestacar = ref(true);
const isSubmitting = ref(false);

const publicacion = ref<PublicacionEmpresaCreateDto>({
  fkIdEmpresa: 0,
  fkIdUsuario: usersStore.currentUser?.id ?? 0,
  titulo: '',
  contenido: '',
  imagen: null,
  esDestacada: false,
});

onMounted(async () => {
  const userId = usersStore.currentUser?.id;
  if (!userId) return;

  const empresas = await usuariosEmpresasStore.getEmpresasDeUsuario(userId);
  if (empresas.length > 0) {
    publicacion.value.fkIdEmpresa = empresas[0];
    puedeDestacar.value = await usuariosEmpresasStore.checkLimiteDestacadas(empresas[0]);
  }
});

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    if (!validateFile(file)) {
      input.value = '';
      return;
    }
    
    imagenFile.value = file;
  }
}

function validateFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024;
  
      if (!allowedTypes.includes(file.type)) {
       Swal.fire({
        icon: 'warning',
        title: 'Formato no permitido',
        text: 'Por favor selecciona una imagen válida (JPEG, PNG o GIF).',
        confirmButtonText: 'Aceptar'
      })
      return false
    }

    if (file.size > maxSize) {
       Swal.fire({
        icon: 'warning',
        title: 'Imagen demasiado grande',
        text: 'La imagen debe ser menor a 5MB.',
        confirmButtonText: 'Aceptar'
      })
      return false
    }
  
  return true;
}

async function submitForm() {
  if (!imagenFile.value) {
    await Swal.fire({
      icon: 'info',
      title: 'Imagen requerida',
      text: 'Debe seleccionar una imagen.',
      confirmButtonText: 'Aceptar'
    })
    return;
  }

  isSubmitting.value = true;

  try {
    const formData = new FormData();
    formData.append('FkIdEmpresa', publicacion.value.fkIdEmpresa.toString());
    formData.append('FkIdUsuario', publicacion.value.fkIdUsuario.toString());
    formData.append('Titulo', publicacion.value.titulo);
    formData.append('Contenido', publicacion.value.contenido ?? '');
    formData.append('EsDestacada', publicacion.value.esDestacada.toString());
    formData.append('Imagen', imagenFile.value);

    emit('guardar', formData);
    resetForm();
  } catch (error) {
    console.error('Error al crear publicación:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al crear la publicación',
      text: 'Por favor, inténtalo de nuevo.',
      confirmButtonText: 'Aceptar'
    })
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  publicacion.value = {
    fkIdEmpresa: publicacion.value.fkIdEmpresa, 
    fkIdUsuario: usersStore.currentUser?.id ?? 0,
    titulo: '',
    contenido: '',
    imagen: null,
    esDestacada: false,
  };
  imagenFile.value = null;
  

  const fileInput = document.getElementById('imagen-input') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}
</script>

<template>
  <div class="form-container">
    <div class="form-header">
      <h2 class="form-title">Nueva Publicación</h2>
      <p class="form-subtitle">Comparte contenido relevante con tu audiencia</p>
    </div>
    
    <form class="formulario" @submit.prevent="submitForm">
      <div class="formulario__grupo">
        <label class="formulario__label">Título *</label>
        <input 
          v-model="publicacion.titulo" 
          type="text" 
          class="formulario__input" 
          placeholder="Ingresa el título de la publicación"
          required 
        />
      </div>

      <div class="formulario__grupo">
        <label class="formulario__label">Contenido *</label>
        <textarea 
          v-model="publicacion.contenido" 
          class="formulario__textarea" 
          placeholder="Escribe el contenido de la publicación"
          rows="4"
          required
        />
      </div>

      <div class="formulario__grupo">
        <label class="formulario__label">Imagen *</label>
        <div class="file-input-container">
          <input 
            @change="handleFileUpload" 
            type="file" 
            accept="image/jpeg,image/png,image/gif" 
            class="formulario__file-input" 
            id="imagen-input"
            required 
          />
          <label for="imagen-input" class="file-input-label">
            <div class="file-input-content">
              <span class="file-icon">📷</span>
              <div class="file-text-container">
                <span class="file-text">
                  {{ imagenFile ? imagenFile.name : 'Seleccionar imagen' }}
                </span>
                <span class="file-hint">JPEG, PNG o GIF (máx. 5MB)</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div class="formulario__grupo">
        <div class="switch-container">
          <label class="switch-label">
            <input 
              v-model="publicacion.esDestacada" 
              type="checkbox" 
              class="switch-input"
              :disabled="!puedeDestacar"
            />
            <span class="switch-slider"></span>
            <span class="switch-text">Publicación destacada</span>
          </label>
        </div>
        <p v-if="!puedeDestacar" class="aviso-limite">
          ⚠️ Ya se ha alcanzado el máximo de publicaciones destacadas este mes para tu empresa.
        </p>
      </div>

      <div class="formulario__acciones">
        <button type="button" class="formulario__boton formulario__boton--secundario" @click="resetForm">
          <span class="boton-icon">🔄</span>
          Limpiar
        </button>
        <button type="submit" class="formulario__boton formulario__boton--primario" :disabled="isSubmitting">
          <span class="boton-icon">📝</span>
          <span v-if="isSubmitting">Publicando...</span>
          <span v-else>Guardar Publicación</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-large;
  background: linear-gradient(135deg, lighten($background-color, 4%) 0%, lighten($background-color, 10%) 100%);
  border-radius: calc($border-radius * 2);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.1),
    0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow-y: auto;
  color: $text-color;
}

.form-header {
  text-align: center;
  margin-bottom: $spacing-large;
  padding-bottom: $spacing-medium;
  border-bottom: 2px solid lighten($dark-color, 15%);
}

.form-title {
  font-size: $font-size-large;
  font-weight: 700;
  background: $primary-gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: $spacing-small;
}

.form-subtitle {
  color: lighten($text-color, 20%);
  font-size: $font-size-small;
  font-weight: 500;
  margin: 0;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: $spacing-medium;

  &__grupo {
    display: flex;
    flex-direction: column;
    gap: $spacing-extra-small;
  }

  &__label {
    font-weight: 600;
    color: $text-color;
    font-size: $font-size-small;
    margin-bottom: $spacing-extra-small;
    display: flex;
    align-items: center;
    gap: $spacing-extra-small;
  }

  &__input,
  &__textarea {
    padding: $spacing-small $spacing-medium;
    border: 2px solid $color-disabled;
    border-radius: $border-radius;
    font-size: $font-size-small;
    background-color: white;
    color: $dark-color;
    transition: $transition;
    font-family: inherit;

    &::placeholder {
      color: lighten($dark-color, 35%);
    }

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba($primary-color, 0.2);
      transform: translateY(-1px);
    }

    &:hover:not(:focus) {
      border-color: lighten($color-disabled, 15%);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 100px;
    line-height: 1.4;
  }

  &__acciones {
    display: flex;
    gap: $spacing-small;
    justify-content: flex-end;
    margin-top: $spacing-medium;
    padding-top: $spacing-medium;
    border-top: 1px solid lighten($dark-color, 15%);

    @media (max-width: $desktop) {
      flex-direction: column;
    }
  }

  &__boton {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-extra-small;
    padding: $spacing-small $spacing-large;
    border-radius: $border-radius;
    font-size: $font-size-small;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;
    min-width: 140px;
    border: none;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--primario {
      background: $primary-gradient;
      color: white;
      box-shadow: 0 4px 15px rgba($primary-color, 0.3);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba($primary-color, 0.4);
      }

      &:active:not(:disabled) {
        transform: translateY(-1px);
      }
    }

    &--secundario {
      background-color: lighten($background-color, 8%);
      color: lighten($text-color, 20%);
      border: 2px solid $color-disabled;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      &:hover {
        background-color: lighten($background-color, 12%);
        transform: translateY(-1px);
      }
    }
  }
}

.file-input-container {
  width: 100%;
}

.formulario__file-input {
  display: none;
}

.file-input-label {
  cursor: pointer;
  display: block;
}

.file-input-content {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  padding: $spacing-small $spacing-medium;
  border: 2px dashed $color-disabled;
  border-radius: $border-radius;
  background: linear-gradient(135deg, lighten($background-color, 8%), lighten($background-color, 15%));
  transition: $transition;

  &:hover {
    border-color: $primary-color;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba($primary-color, 0.2);
  }
}

.file-icon {
  font-size: $font-size-base;
}

.file-text-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-text {
  font-weight: 600;
  color: $dark-color;
  font-size: $font-size-small;
}

.file-hint {
  font-size: 12px;
  color: lighten($dark-color, 30%);
}

.switch-container {
  display: flex;
  align-items: center;
  gap: $spacing-small;
}

.switch-label {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  cursor: pointer;
  font-weight: 500;
  color: $text-color;
}

.switch-input {
  display: none;
}

.switch-slider {
  position: relative;
  width: 50px;
  height: 24px;
  background-color: $color-disabled;
  border-radius: 24px;
  transition: $transition;
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: $transition;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

.switch-input:checked + .switch-slider {
  background: $primary-gradient;
  
  &::before {
    transform: translateX(26px);
  }
}

.switch-input:disabled + .switch-slider {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-text {
  font-size: $font-size-small;
  user-select: none;
}

.aviso-limite {
  margin-top: $spacing-extra-small;
  padding: $spacing-small;
  background-color: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: $border-radius;
  color: darken(#ffc107, 20%);
  font-size: $font-size-small;
  font-weight: 500;
}

@media (max-width: $desktop) {
  .form-container {
    padding: $spacing-medium;
    margin: $spacing-small;
  }

  .form-title {
    font-size: $font-size-base;
  }

  .formulario {
    gap: $spacing-small;

    &__boton {
      width: 100%;
    }
  }
}
</style>