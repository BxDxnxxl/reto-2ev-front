<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useIdeasStore } from "@/stores/Ideas";
import { useUsersStore } from "@/stores/users";
import { useSocialStore } from "@/stores/RedSocial";
import type { Ideas } from "@/stores/dtos/Ideas.dto";

const emit = defineEmits(["ideaPublicada"]);

const ideasStore = useIdeasStore();
const usersStore = useUsersStore();
const socialStore = useSocialStore();

const nuevaIdea = ref<Ideas>({
  id: 0,
  fkIdUsuario: usersStore.currentUser?.id ?? 0,
  titulo: "",
  descripcion: "",
  plazasDisponibles: 1,
  fkIdRedSocial: 1,
  contacto: "",
  fechaPublicacion: new Date()
});

const publicar = async () => {
  if (!usersStore.currentUser?.id) {
    alert("Para realizar esta acción debes iniciar sesión.");
    return;
  }

  nuevaIdea.value.fkIdUsuario = usersStore.currentUser.id;

  await ideasStore.publicarIdea(nuevaIdea.value);
  emit("ideaPublicada");

  nuevaIdea.value = {
    id: 0,
    fkIdUsuario: usersStore.currentUser.id,
    titulo: "",
    descripcion: "",
    plazasDisponibles: 1,
    fkIdRedSocial: 1,
    contacto: "",
    fechaPublicacion: new Date()
  };
};

onMounted(async () => {
  await socialStore.fetchRedes();
});
</script>

<template>
  <form class="formulario-idea" @submit.prevent="publicar">
    <input
      class="formulario-idea__input"
      type="text"
      placeholder="Título"
      v-model="nuevaIdea.titulo"
      required
    />

    <textarea
      class="formulario-idea__textarea"
      placeholder="Descripción"
      v-model="nuevaIdea.descripcion"
      required
    />

    <input
      class="formulario-idea__input"
      type="number"
      min="1"
      placeholder="Plazas disponibles"
      v-model.number="nuevaIdea.plazasDisponibles"
      required
    />

    <select class="formulario-idea__select" v-model="nuevaIdea.fkIdRedSocial">
      <option
        v-for="red in socialStore.redes"
        :key="red.id"
        :value="red.id"
      >
        {{ red.nombre }}
      </option>
    </select>

    <input
      class="formulario-idea__input"
      type="text"
      placeholder="Contacto (ej. @usuario)"
      v-model="nuevaIdea.contacto"
      required
    />

    <button class="formulario-idea__boton" type="submit">
      Publicar idea
    </button>
  </form>
</template>

```scss
<style lang="scss" scoped>
// Variables para reutilización - mantengo consistencia con el estilo anterior
$color-primary: #1e40af; // Azul más oscuro y serio
$color-primary-light: #3b82f6; // Variante más clara
$color-light: #f8fafc; // Fondo claro
$color-dark: #1e293b; // Texto oscuro
$color-gray: #64748b; // Gris medio para textos secundarios
$color-gray-light: #e2e8f0; // Gris claro para bordes y elementos secundarios
$color-success: #10b981; // Verde para botones de acción positiva
$color-error: #ef4444; // Rojo para errores y validaciones
$border-radius: 8px;
$box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
$transition: all 0.2s ease-in-out;

// Mixins para reutilización
@mixin input-base {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid $color-gray-light;
  border-radius: $border-radius;
  font-size: 0.95rem;
  font-family: inherit;
  color: $color-dark;
  background-color: $color-light;
  transition: $transition;
  outline: none;
  
  &:focus {
    border-color: $color-primary-light;
    box-shadow: 0 0 0 3px rgba($color-primary-light, 0.2);
  }
  
  &:hover:not(:focus) {
    border-color: darken($color-gray-light, 10%);
  }
  
  &::placeholder {
    color: lighten($color-gray, 15%);
    font-size: 0.9rem;
  }
}

@mixin button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: $transition;
  
  &:focus {
    outline: none;
  }
  
  &:active {
    transform: scale(0.98);
  }
}

// Estilos del formulario
.formulario-idea {
  background-color: white;
  border-radius: $border-radius;
  border: 1px solid $color-gray-light;
  padding: 1.5rem;
  box-shadow: $box-shadow;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
  position: relative;
  
  // Encabezado visual para el formulario
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.25rem;
    background-color: $color-primary;
    border-radius: $border-radius $border-radius 0 0;
  }
  
  &__input {
    @include input-base;
    height: 3rem;
    
    // Estilos específicos para input tipo number
    &[type="number"] {
      -moz-appearance: textfield; // Firefox
      
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }
  
  &__textarea {
    @include input-base;
    resize: vertical;
    min-height: 100px;
    line-height: 1.5;
  }
  
  &__select {
    @include input-base;
    appearance: none;
    padding-right: 2.5rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1rem;
    
    &:invalid {
      border-color: $color-error;
    }
  }
  
  &__label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: $color-dark;
  }
  
  &__grupo {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  &__boton {
    @include button-base;
    background-color: $color-success;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: $border-radius;
    font-size: 1rem;
    margin-top: 1rem;
    align-self: flex-end;
    
    &:hover {
      background-color: darken($color-success, 8%);
    }
    
    &:focus {
      box-shadow: 0 0 0 3px rgba($color-success, 0.3);
    }
  }
  
  &__mensaje-error {
    color: $color-error;
    font-size: 0.85rem;
    font-weight: 500;
    margin-top: 0.25rem;
  }
  
  // Adaptación responsive
  @media (min-width: 768px) {
    padding: 2rem;
    
    &__grupo-flex {
      display: flex;
      gap: 1rem;
      
      > * {
        flex: 1;
      }
    }
    
    &__boton {
      font-size: 1.05rem;
      padding: 0.75rem 2rem;
    }
  }
}
</style>