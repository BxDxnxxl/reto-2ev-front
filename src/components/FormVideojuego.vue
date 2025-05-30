<script setup lang="ts">
import { ref, watch } from "vue";
import { useGamesStore } from "@/stores/games";
import type { GameCreateDto } from "@/stores/dtos/GameCreateDto";

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
    alert('Por favor selecciona una imagen válida (JPEG, PNG o GIF)');
    return false;
  }
  
  if (file.size > maxSize) {
    alert('La imagen debe ser menor a 5MB');
    return false;
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
    alert('Por favor selecciona una imagen');
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
    alert('Error al crear el videojuego. Por favor, inténtalo de nuevo.');
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
          rows="4"
        />
      </div>

      <!-- Carátula -->
      <div class="formulario__grupo">
        <label class="formulario__label">Carátula *</label>
        <div class="upload-section">
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

          <!-- Vista previa -->
          <div class="image-preview-container" v-if="imagePreview">
            <div class="image-preview">
              <img :src="imagePreview" alt="Vista previa" class="preview-image" />
            </div>
            <div class="file-info" v-if="form.caratula">
              <small>{{ formatFileSize(form.caratula.size) }}</small>
            </div>
          </div>
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
  padding: $spacing-xxl;
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
  margin-bottom: $spacing-xxl;
  padding-bottom: $spacing-large;
  border-bottom: 2px solid lighten($dark-color, 15%);
}

.form-title {
  font-size: $font-size-xlarge;
  font-weight: 800;
  background: $primary-gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: $spacing-small;
}

.form-subtitle {
  color: lighten($text-color, 20%);
  font-size: $font-size-base;
  font-weight: 500;
  margin: 0;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: $spacing-xxl;

  &__fila {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: $spacing-large;

    @media (max-width: $desktop) {
      grid-template-columns: 1fr;
      gap: $spacing-medium;
    }
  }

  &__grupo {
    display: flex;
    flex-direction: column;
    gap: $spacing-small;

    &--flex-1 { flex: 1; }
    &--flex-2 { flex: 2; }
  }

  &__label {
    font-weight: 600;
    color: $text-color;
    font-size: $font-size-base;
    margin-bottom: $spacing-small;
    display: flex;
    align-items: center;
    gap: $spacing-extra-small;
  }

  &__input,
  &__textarea,
  &__select {
    padding: $spacing-medium;
    border: 2px solid $color-disabled;
    border-radius: $border-radius;
    font-size: $font-size-base;
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
    min-height: 120px;
    line-height: 1.6;
  }

  &__acciones {
    display: flex;
    gap: $spacing-medium;
    justify-content: flex-end;
    margin-top: $spacing-large;
    padding-top: $spacing-large;
    border-top: 1px solid lighten($dark-color, 15%);

    @media (max-width: $desktop) {
      flex-direction: column;
    }
  }

  &__boton {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-small;
    padding: $spacing-medium $spacing-xlarge;
    border-radius: $border-radius;
    font-size: $font-size-base;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;
    min-width: 160px;
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

.upload-section {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: $spacing-large;
  align-items: start;

  @media (max-width: $desktop) {
    grid-template-columns: 1fr;
  }
}

.file-input-content {
  display: flex;
  align-items: center;
  gap: $spacing-medium;
  padding: $spacing-large;
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

.image-preview {
  width: 140px;
  height: 140px;
  border-radius: $border-radius;
  overflow: hidden;
  border: 3px solid $color-disabled;
  box-shadow: $box-shadow;
  transition: $transition;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.file-text {
  font-weight: 600;
  color: $dark-color;
}

.file-hint {
  font-size: $font-size-small;
  color: lighten($dark-color, 30%);
}

.file-info small {
  color: lighten($dark-color, 30%);
  font-size: $font-size-small;
  font-weight: 500;
}

// Responsive
@media (max-width: $desktop) {
  .form-container {
    padding: $spacing-large;
    margin: $spacing-medium;
  }

  .form-title {
    font-size: $font-size-large;
  }

  .formulario {
    gap: $spacing-large;

    &__boton {
      width: 100%;
    }
  }

  .image-preview {
    width: 120px;
    height: 120px;
  }
}
</style>
