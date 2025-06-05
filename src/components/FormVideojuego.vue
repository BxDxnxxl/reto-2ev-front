<script setup lang="ts">
import { ref, watch } from "vue";
import { useGamesStore } from "@/stores/games";
import type { GameCreateDto } from "@/stores/dtos/GameCreateDto";
import Swal from 'sweetalert2'


const emit = defineEmits(["creado"]);
const store = useGamesStore();

const form = ref<Omit<GameCreateDto, "caratula"> & { caratula: File | null }>({
  titulo: "",
  descripcion: "",
  anioSalida: "",
  pegi: undefined,
  fkIdCompania: 0,
  caratula: null
});

const imagePreview = ref<string | null>(null);
const isSubmitting = ref(false);

function handleFile(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    
    // Validar el archivo
    if (!validateFile(file)) {
      target.value = '';
      return;
    }
    
    form.value.caratula = file;
    
    // Crear vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function validateFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
   Swal.fire({
    icon: 'error',
    title: 'Archivo no válido',
    text: 'Por favor selecciona una imagen válida (JPEG, PNG o GIF)',
    confirmButtonText: 'Entendido'
  })
  return false
}

if (file.size > maxSize) {
 Swal.fire({
    icon: 'warning',
    title: 'Imagen demasiado grande',
    text: 'La imagen debe ser menor a 5MB',
    confirmButtonText: 'Cerrar'
  })
  return false
}

  
  return true;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function handleSubmit() {
  if (!form.value.caratula) {
    await Swal.fire({
      icon: 'info',
      title: 'Imagen requerida',
      text: 'Por favor selecciona una imagen.',
      confirmButtonText: 'Entendido'
    })
    return;
  }

  isSubmitting.value = true;

  try {
    const formData = new FormData();
    formData.append("titulo", form.value.titulo);
    formData.append("descripcion", form.value.descripcion || "");
    formData.append("anioSalida", form.value.anioSalida);
    if (form.value.pegi !== undefined && form.value.pegi !== null) {
      formData.append("pegi", form.value.pegi.toString());
    }
    formData.append("fkIdCompania", form.value.fkIdCompania.toString());
    // ¡IMPORTANTE! El backend espera "Imagen", no "caratula"
    formData.append("Imagen", form.value.caratula);

    await store.createVideojuegos(formData);
    emit("creado");
    resetForm();
  } catch (error) {
    console.error('Error al crear videojuego:', error);
    await Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'Error al crear el videojuego. Por favor, inténtalo de nuevo.',
    confirmButtonText: 'Aceptar'
    })
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  form.value = {
    titulo: "",
    descripcion: "",
    anioSalida: "",
    pegi: undefined,
    fkIdCompania: 0,
    caratula: null
  };
  imagePreview.value = null;
  
  // Limpiar el input de archivo
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}

// Limpiar vista previa si se quita la imagen
watch(() => form.value.caratula, (newValue) => {
  if (!newValue) {
    imagePreview.value = null;
  }
});
</script>
<template>
  <div class="form-container">
    <div class="form-header">
      <h2 class="form-title">Crear Videojuego</h2>
      <p class="form-subtitle">Completa la información del nuevo videojuego</p>
    </div>
    
    <form class="formulario" @submit.prevent="handleSubmit">
      <!-- Fila 1: Título y Año -->
      <div class="formulario__fila">
        <div class="formulario__grupo formulario__grupo--flex-2">
          <label class="formulario__label">Título *</label>
          <input 
            v-model="form.titulo" 
            type="text" 
            class="formulario__input" 
            placeholder="Ingresa el título del videojuego"
            required 
          />
        </div>

        <div class="formulario__grupo formulario__grupo--flex-1">
          <label class="formulario__label">Año de salida *</label>
          <input 
            v-model="form.anioSalida" 
            type="date" 
            class="formulario__input" 
            required 
          />
        </div>
      </div>

      <!-- Fila 2: PEGI y ID Compañía -->
      <div class="formulario__fila">
        <div class="formulario__grupo">
          <label class="formulario__label">PEGI</label>
          <select v-model="form.pegi" class="formulario__input formulario__select">
            <option value="">Selecciona una clasificación</option>
            <option value="3">PEGI 3</option>
            <option value="7">PEGI 7</option>
            <option value="12">PEGI 12</option>
            <option value="16">PEGI 16</option>
            <option value="18">PEGI 18</option>
          </select>
        </div>

        <div class="formulario__grupo">
          <label class="formulario__label">ID Compañía *</label>
          <input 
            v-model="form.fkIdCompania" 
            type="number" 
            class="formulario__input" 
            placeholder="ID de la compañía"
            min="1"
            required 
          />
        </div>
      </div>

      <!-- Descripción -->
      <div class="formulario__grupo">
        <label class="formulario__label">Descripción</label>
        <textarea 
          v-model="form.descripcion" 
          class="formulario__textarea" 
          placeholder="Describe el videojuego (opcional)"
          rows="3"
        />
      </div>

      <!-- Carátula -->
      <div class="formulario__grupo">
        <label class="formulario__label">Carátula *</label>
        <div class="file-input-container">
          <input 
            @change="handleFile" 
            type="file" 
            accept="image/jpeg,image/png,image/gif" 
            class="formulario__file-input" 
            id="file-input"
            required 
          />
          <label for="file-input" class="file-input-label">
            <div class="file-input-content">
              <span class="file-icon">📷</span>
              <div class="file-text-container">
                <span class="file-text">
                  {{ form.caratula ? form.caratula.name : 'Seleccionar imagen' }}
                </span>
                <span class="file-hint">JPEG, PNG o GIF (máx. 5MB)</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div class="formulario__acciones">
        <button type="button" class="formulario__boton formulario__boton--secundario" @click="resetForm">
          <span class="boton-icon">🔄</span>
          Limpiar
        </button>
        <button type="submit" class="formulario__boton formulario__boton--primario" :disabled="isSubmitting">
          <span class="boton-icon">💾</span>
          <span v-if="isSubmitting">Guardando...</span>
          <span v-else>Guardar videojuego</span>
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

  &__fila {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: $spacing-medium;

    @media (max-width: $desktop) {
      grid-template-columns: 1fr;
      gap: $spacing-small;
    }
  }

  &__grupo {
    display: flex;
    flex-direction: column;
    gap: $spacing-extra-small;

    &--flex-1 { flex: 1; }
    &--flex-2 { flex: 2; }
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
  &__textarea,
  &__select {
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
    min-height: 80px;
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

// Responsive
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