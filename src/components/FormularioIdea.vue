<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useIdeasStore } from "@/stores/Ideas";
import { useUsersStore } from "@/stores/users";
import { useSocialStore } from "@/stores/RedSocial";
import type { IdeaDto } from "@/stores/dtos/Ideas.dto";
import Swal from 'sweetalert2'

const emit = defineEmits(["ideaPublicada"]);

const ideasStore = useIdeasStore();
const usersStore = useUsersStore();
const socialStore = useSocialStore();

const nuevaIdea = ref<IdeaDto>({
  id: 0,
  fkIdUsuario: usersStore.currentUser?.id ?? 0,
  titulo: "",
  descripcion: "",
  plazasDisponibles: 1,
  fkIdRedSocial: 1,
  fkIdTipoIdea: 1,
  contacto: "",
  instrucciones: "",
  fechaPublicacion: new Date(),
  fechaCaducidad: null,
});

const isSubmitting = ref(false);

const publicar = async () => {
  if (!usersStore.currentUser?.id) {
    await Swal.fire({
      icon: 'info',
      title: 'Inicia sesión',
      text: 'Para realizar esta acción debes iniciar sesión.',
      confirmButtonText: 'Aceptar'
    })
    return;
  }

  isSubmitting.value = true;

  try {
    nuevaIdea.value.fkIdUsuario = usersStore.currentUser.id;

    await ideasStore.publicarIdea(nuevaIdea.value);
    emit("ideaPublicada");

    resetForm();
  } catch (error) {
    console.error('Error al publicar idea:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al publicar',
      text: 'Error al publicar la idea. Por favor, inténtalo de nuevo.',
      confirmButtonText: 'Aceptar'
    })

  } finally {
    isSubmitting.value = false;
  }
};

function resetForm() {
  nuevaIdea.value = {
    id: 0,
    fkIdUsuario: usersStore.currentUser?.id ?? 0,
    titulo: "",
    descripcion: "",
    plazasDisponibles: 1,
    fkIdRedSocial: 1,
    fkIdTipoIdea: 1,
    contacto: "",
    instrucciones: "",
    fechaPublicacion: new Date(),
    fechaCaducidad: null,
  };
}

onMounted(async () => {
  await socialStore.fetchRedes();
  await ideasStore.fetchTiposIdeas(); 
});
</script>

<template>
  <div class="form-container">
    <div class="form-header">
      <h2 class="form-title">Publicar Nueva Idea</h2>
      <p class="form-subtitle">Comparte tu idea con la comunidad</p>
    </div>
    
    <form class="formulario" @submit.prevent="publicar">
      <div class="formulario__fila">
        <div class="formulario__grupo formulario__grupo--flex-2">
          <label class="formulario__label">Título *</label>
          <input 
            v-model="nuevaIdea.titulo" 
            type="text" 
            class="formulario__input" 
            placeholder="Ingresa el título de tu idea"
            required 
          />
        </div>

        <div class="formulario__grupo formulario__grupo--flex-1">
          <label class="formulario__label">Plazas disponibles *</label>
          <input 
            v-model.number="nuevaIdea.plazasDisponibles" 
            type="number" 
            min="1"
            class="formulario__input" 
            placeholder="Número de plazas"
            required 
          />
        </div>
      </div>
      <div class="formulario__fila">
        <div class="formulario__grupo">
          <label class="formulario__label">Red Social *</label>
          <select v-model="nuevaIdea.fkIdRedSocial" class="formulario__input formulario__select">
            <option
              v-for="red in socialStore.redes"
              :key="red.id"
              :value="red.id"
            >
              {{ red.nombre }}
            </option>
          </select>
        </div>

        <div class="formulario__grupo">
          <label class="formulario__label">Tipo de Idea *</label>
          <select v-model="nuevaIdea.fkIdTipoIdea" class="formulario__input formulario__select" required>
            <option v-for="tipo in ideasStore.tipos" :key="tipo.id" :value="tipo.id">
              {{ tipo.nombre }}
            </option>
          </select>
        </div>
      </div>

      <div class="formulario__fila">
        <div class="formulario__grupo">
          <label class="formulario__label">Contacto *</label>
          <input 
            v-model="nuevaIdea.contacto" 
            type="text" 
            class="formulario__input" 
            placeholder="ej. @usuario"
            required 
          />
        </div>

        <div class="formulario__grupo">
          <label class="formulario__label">Fecha de caducidad *</label>
          <input 
            v-model="nuevaIdea.fechaCaducidad" 
            type="datetime-local" 
            class="formulario__input"
            required 
          />
        </div>
      </div>

      <div class="formulario__grupo">
        <label class="formulario__label">Descripción *</label>
        <textarea 
          v-model="nuevaIdea.descripcion" 
          class="formulario__textarea" 
          placeholder="Describe tu idea"
          rows="3"
          required
        />
      </div>

      <div class="formulario__grupo">
        <label class="formulario__label">Instrucciones para participantes *</label>
        <textarea 
          v-model="nuevaIdea.instrucciones" 
          class="formulario__textarea" 
          placeholder="Instrucciones detalladas para los participantes"
          rows="3"
          required
        />
      </div>

      <div class="formulario__acciones">
        <button type="button" class="formulario__boton formulario__boton--secundario" @click="resetForm">
          <span class="boton-icon">🔄</span>
          Limpiar
        </button>
        <button type="submit" class="formulario__boton formulario__boton--primario" :disabled="isSubmitting">
          <span class="boton-icon">💡</span>
          <span v-if="isSubmitting">Publicando...</span>
          <span v-else>Publicar idea</span>
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

  &__select {
    appearance: none;
    padding-right: 2.5rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23272727' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1rem;

    &:invalid {
      border-color: $color-error;
    }
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