<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['guardarEmpresa']);

const empresa = ref({
  Nombre: '',
  Descripcion: '',
  Sede: '',
  Web: '',
  Logo: null as File | null,
  Acuerdo: 0,
  LimiteDestacadasMensual: 0
});

const isSubmitting = ref(false);

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];
    
    // Validar el archivo
    if (!validateFile(file)) {
      input.value = '';
      return;
    }
    
    empresa.value.Logo = file;
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

async function submitForm() {
  if (!empresa.value.Logo) {
    alert("Debe seleccionar un logo.");
    return;
  }

  isSubmitting.value = true;

  try {
    const formData = new FormData();
    formData.append("Nombre", empresa.value.Nombre);
    formData.append("Descripcion", empresa.value.Descripcion || "");
    formData.append("Sede", empresa.value.Sede || "");
    formData.append("Web", empresa.value.Web || "");
    formData.append("Acuerdo", empresa.value.Acuerdo.toString());
    formData.append("LimiteDestacadasMensual", empresa.value.LimiteDestacadasMensual.toString());
    formData.append("Logo", empresa.value.Logo);

    emit("guardarEmpresa", formData);
    resetForm();
  } catch (error) {
    console.error('Error al crear empresa:', error);
    alert('Error al crear la empresa. Por favor, inténtalo de nuevo.');
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  empresa.value = {
    Nombre: '',
    Descripcion: '',
    Sede: '',
    Web: '',
    Logo: null,
    Acuerdo: 0,
    LimiteDestacadasMensual: 0
  };
  
  // Limpiar el input de archivo
  const fileInput = document.getElementById('logo-input') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}
</script>

<template>
  <div class="form-container">
    <div class="form-header">
      <h2 class="form-title">Nueva Empresa</h2>
      <p class="form-subtitle">Completa la información de la nueva empresa</p>
    </div>
    
    <form class="formulario" @submit.prevent="submitForm">
      <!-- Fila 1: Nombre y Sede -->
      <div class="formulario__fila">
        <div class="formulario__grupo formulario__grupo--flex-2">
          <label class="formulario__label">Nombre *</label>
          <input 
            v-model="empresa.Nombre" 
            type="text" 
            class="formulario__input" 
            placeholder="Ingresa el nombre de la empresa"
            required 
          />
        </div>

        <div class="formulario__grupo formulario__grupo--flex-1">
          <label class="formulario__label">Sede</label>
          <input 
            v-model="empresa.Sede" 
            type="text" 
            class="formulario__input" 
            placeholder="Ciudad o ubicación"
          />
        </div>
      </div>

      <!-- Fila 2: Web y Acuerdo -->
      <div class="formulario__fila">
        <div class="formulario__grupo">
          <label class="formulario__label">Web</label>
          <input 
            v-model="empresa.Web" 
            type="url" 
            class="formulario__input" 
            placeholder="https://ejemplo.com"
          />
        </div>

        <div class="formulario__grupo">
          <label class="formulario__label">Tipo de acuerdo *</label>
          <select v-model="empresa.Acuerdo" class="formulario__input formulario__select" required>
            <option value="0">Tipo 0</option>
            <option value="1">Tipo 1</option>
            <option value="2">Tipo 2</option>
            <option value="3">Tipo 3</option>
          </select>
        </div>
      </div>

      <!-- Límite Destacadas -->
      <div class="formulario__grupo">
        <label class="formulario__label">Límite destacadas mensual</label>
        <input 
          v-model="empresa.LimiteDestacadasMensual" 
          type="number" 
          class="formulario__input" 
          placeholder="Número de destacadas permitidas"
          min="0"
        />
      </div>

      <!-- Descripción -->
      <div class="formulario__grupo">
        <label class="formulario__label">Descripción</label>
        <textarea 
          v-model="empresa.Descripcion" 
          class="formulario__textarea" 
          placeholder="Describe la empresa (opcional)"
          rows="3"
        />
      </div>

      <!-- Logo -->
      <div class="formulario__grupo">
        <label class="formulario__label">Logo *</label>
        <div class="file-input-container">
          <input 
            @change="handleFileUpload" 
            type="file" 
            accept="image/jpeg,image/png,image/gif" 
            class="formulario__file-input" 
            id="logo-input"
            required 
          />
          <label for="logo-input" class="file-input-label">
            <div class="file-input-content">
              <span class="file-icon">🖼️</span>
              <div class="file-text-container">
                <span class="file-text">
                  {{ empresa.Logo ? empresa.Logo.name : 'Seleccionar logo' }}
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
          <span v-else>Guardar empresa</span>
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