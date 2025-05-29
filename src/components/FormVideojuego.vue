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
.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.1),
    0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.8);
  overflow-y: auto;
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.form-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &__fila {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  &__grupo {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &--flex-1 {
      flex: 1;
    }

    &--flex-2 {
      flex: 2;
    }
  }

  &__label {
    font-weight: 600;
    color: #374151;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__input,
  &__textarea,
  &__select {
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background-color: #ffffff;
    color: #374151;
    font-family: inherit;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
      transform: translateY(-1px);
    }

    &:hover:not(:focus) {
      border-color: #d1d5db;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 120px;
    line-height: 1.6;
  }

  &__select {
    cursor: pointer;
    
    &:focus {
      cursor: pointer;
    }
  }

  &__file-input {
    display: none;
  }

  &__acciones {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__boton {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: none;
    min-width: 160px;
    justify-content: center;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    &--primario {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      &:active:not(:disabled) {
        transform: translateY(-1px);
      }
    }

    &--secundario {
      background-color: #f8fafc;
      color: #64748b;
      border: 2px solid #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      &:hover {
        background-color: #f1f5f9;
        border-color: #cbd5e0;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.boton-icon {
  font-size: 1.1rem;
}

// Upload section styles
.upload-section {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.file-input-container {
  flex: 1;
}

.file-input-label {
  display: block;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-input-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  }
}

.file-icon {
  font-size: 1.5rem;
  opacity: 0.7;
}

.file-text-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.file-text {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.file-hint {
  font-size: 0.8rem;
  color: #6b7280;
}

.image-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.image-preview {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-info {
  text-align: center;
  
  small {
    color: #6b7280;
    font-size: 0.8rem;
    font-weight: 500;
  }
}

// Responsive
@media (max-width: 768px) {
  .form-container {
    padding: 1.5rem;
    margin: 1rem;
  }

  .form-title {
    font-size: 1.6rem;
  }

  .formulario {
    gap: 1.5rem;

    &__acciones {
      flex-direction: column;
    }

    &__boton {
      width: 100%;
    }
  }

  .upload-section {
    grid-template-columns: 1fr;
  }

  .image-preview {
    width: 120px;
    height: 120px;
  }
}
</style>