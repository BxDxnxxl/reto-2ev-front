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

<style lang="scss" scoped>
.formulario-idea {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1.5rem;

  &__input,
  &__textarea,
  &__select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
  }

  &__textarea {
    resize: vertical;
    min-height: 80px;
  }

  &__boton {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      background-color: #218838;
    }
  }

  @media (min-width: 768px) {
    &__input,
    &__textarea,
    &__select {
      font-size: 1.1rem;
    }

    &__boton {
      font-size: 1.1rem;
    }
  }
}
</style>
