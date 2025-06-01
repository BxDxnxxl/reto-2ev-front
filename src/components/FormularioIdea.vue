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
  instrucciones: "",
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
    instrucciones: "",
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

    <textarea
      class="formulario-idea__textarea"
      placeholder="Instrucciones para los participantes"
      v-model="nuevaIdea.instrucciones"
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

<style scoped lang="scss">
@import "@/assets/styles/variables.scss";

@mixin input-base {
  width: 100%;
  padding: $spacing-medium $spacing-large;
  border: 1px solid lighten($secondary-color, 40%);
  border-radius: $border-radius;
  font-size: $font-size-base;
  font-family: inherit;
  color: $dark-color;
  background-color: $text-color;
  transition: $transition;
  outline: none;

  &:focus {
    border-color: $accent-color;
    box-shadow: 0 0 0 3px rgba($accent-color, 0.2);
  }

  &:hover:not(:focus) {
    border-color: lighten($secondary-color, 20%);
  }

  &::placeholder {
    color: lighten($secondary-color, 25%);
    font-size: $font-size-small;
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

.formulario-idea {
  background-color: $background-color;
  border-radius: $border-radius;
  border: 1px solid lighten($dark-color, 40%);
  padding: $spacing-large;
  box-shadow: $box-shadow;
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
  margin-bottom: 2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.25rem;
    background-color: $primary-color;
    border-radius: $border-radius $border-radius 0 0;
  }

  &__input {
    @include input-base;
    height: 3rem;

    &[type="number"] {
      -moz-appearance: textfield;

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
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23272727' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1rem;

    &:invalid {
      border-color: $color-error;
    }
  }

  &__label {
    display: block;
    margin-bottom: $spacing-small;
    font-size: $font-size-small;
    font-weight: 600;
    color: $text-color;
  }

  &__grupo {
    display: flex;
    flex-direction: column;
    gap: $spacing-small;
  }

  &__boton {
    @include button-base;
    background-color: $btn-color;
    color: $text-color;
    padding: $spacing-medium $spacing-large;
    border-radius: $border-radius;
    font-size: $font-size-base;
    margin-top: $spacing-medium;
    align-self: flex-end;

    &:hover {
      background-color: darken($btn-color, 8%);
    }

    &:focus {
      box-shadow: 0 0 0 3px rgba($btn-color, 0.3);
    }
  }

  &__mensaje-error {
    color: $color-error;
    font-size: $font-size-small;
    font-weight: 500;
    margin-top: $spacing-extra-small;
  }

  @media (min-width: $desktop) {
    padding: $spacing-large * 1.5;

    &__grupo-flex {
      display: flex;
      gap: $spacing-medium;

      > * {
        flex: 1;
      }
    }

    &__boton {
      font-size: $font-size-large;
      padding: $spacing-medium $spacing-large * 1.25;
    }
  }
}
</style>