<template>
  <div class="form-container">
    <h2 class="form-title">Crear Videojuego</h2>
    
    <form class="formulario" @submit.prevent="handleSubmit">
      <div class="formulario__grupo">
        <label class="formulario__label">Título *</label>
        <input 
          v-model="form.titulo" 
          type="text" 
          class="formulario__input" 
          placeholder="Ingresa el título del videojuego"
          required 
        />
      </div>

      <div class="formulario__grupo">
        <label class="formulario__label">Descripción</label>
        <textarea 
          v-model="form.descripcion" 
          class="formulario__textarea" 
          placeholder="Describe el videojuego (opcional)"
          rows="4"
        />
      </div>

      <div class="formulario__grupo">
        <label class="formulario__label">Año de salida *</label>
        <input 
          v-model="form.anioSalida" 
          type="date" 
          class="formulario__input" 
          required 
        />
      </div>

      <div class="formulario__grupo">
        <label class="formulario__label">PEGI</label>
        <select v-model="form.pegi" class="formulario__input">
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
          placeholder="ID de la compañía desarrolladora"
          min="1"
          required 
        />
      </div>

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
            <span class="file-icon">📷</span>
            <span class="file-text">
              {{ form.caratula ? form.caratula.name : 'Seleccionar imagen' }}
            </span>
          </label>
          <div class="file-info" v-if="form.caratula">
            <small>Tamaño: {{ formatFileSize(form.caratula.size) }}</small>
          </div>
        </div>
      </div>

      <!-- Vista previa de la imagen -->
      <div class="formulario__grupo" v-if="imagePreview">
        <label class="formulario__label">Vista previa</label>
        <div class="image-preview">
          <img :src="imagePreview" alt="Vista previa" class="preview-image" />
        </div>
      </div>

      <div class="formulario__acciones">
        <button type="button" class="formulario__boton formulario__boton--secundario" @click="resetForm">
          Limpiar
        </button>
        <button type="submit" class="formulario__boton formulario__boton--primario" :disabled="isSubmitting">
          <span v-if="isSubmitting">Guardando...</span>
          <span v-else>Guardar videojuego</span>
        </button>
      </div>
    </form>
  </div>
</template>

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

<style scoped lang="scss">
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
  border-bottom: 3px solid #4299e1;
  padding-bottom: 0.5rem;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__grupo {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__label {
    font-weight: 600;
    color: #2d3748;
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }

  &__input,
  &__textarea {
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;
    background-color: #ffffff;
    color: #2d3748;

    &::placeholder {
      color: #a0aec0;
    }

    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }

    &:hover:not(:focus) {
      border-color: #cbd5e0;
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
  }

  // Estilos para el input de archivo personalizado
  &__file-input {
    display: none;
  }

  &__acciones {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  &__boton {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: none;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--primario {
      background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
      color: white;

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    &--secundario {
      background-color: #f7fafc;
      color: #4a5568;
      border: 2px solid #e2e8f0;

      &:hover {
        background-color: #edf2f7;
        border-color: #cbd5e0;
      }
    }
  }
}

// Estilos para el input de archivo personalizado
.file-input-container {
  position: relative;
}

.file-input-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f8fafc;
  color: #4a5568;

  &:hover {
    border-color: #4299e1;
    background-color: #ebf8ff;
    color: #2b6cb0;
  }
}

.file-icon {
  font-size: 1.25rem;
}

.file-text {
  font-weight: 500;
}

.file-info {
  margin-top: 0.5rem;
  color: #718096;
}

// Estilos para la vista previa
.image-preview {
  display: flex;
  justify-content: center;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

// Responsive
@media (max-width: 768px) {
  .form-container {
    padding: 1rem;
    margin: 1rem;
  }

  .formulario__acciones {
    flex-direction: column;
  }

  .formulario__boton {
    width: 100%;
  }
}
</style>