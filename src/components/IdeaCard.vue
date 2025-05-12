<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useIdeasStore } from "@/stores/Ideas";
import { useUsersStore } from "@/stores/users";

import FormularioIdea from "@/components/FormularioIdea.vue";

const ideasStore = useIdeasStore();
const usersStore = useUsersStore();
const mostrarFormulario = ref(false);

onMounted(async () => {
  await ideasStore.fetchIdeasConPlazas();
});

const toggleFormulario = () => {
  mostrarFormulario.value = !mostrarFormulario.value;
};

const onIdeaPublicada = async () => {
  mostrarFormulario.value = false;
  await ideasStore.fetchIdeasConPlazas();
};

const handleUnirse = async (idIdea: number) => {
  const userId = usersStore.currentUser?.id;
  if (!userId) {
    alert("Para realizar esta acción debes iniciar sesión.");
    return;
  }
  await ideasStore.unirseAIdea(idIdea, userId);
};

</script>

<template>
  <div class="ideas">
    <button class="ideas__boton" @click="toggleFormulario">
      {{ mostrarFormulario ? "Cancelar" : "➕ Añadir idea" }}
    </button>

    <FormularioIdea
      v-if="mostrarFormulario"
      @ideaPublicada="onIdeaPublicada"
    />

    <div class="ideas__lista">
      <div
        v-for="idea in ideasStore.ideasConPlazas"
        :key="idea.id"
        class="idea-card"
      >
        <div class="idea-card__contenido">
          <h3 class="idea-card__titulo">{{ idea.titulo }}</h3>
          <p class="idea-card__descripcion">{{ idea.descripcion }}</p>
          <p class="idea-card__plazas">
            {{ idea.plazasLibres }} plazas libres
          </p>
        </div>

        <button
          class="idea-card__boton"
          @click="handleUnirse(idea.id)"
        >
          ¡Me uno!
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ideas {
  padding: 1rem;
  width: 100%;

  &__boton {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 1rem;
    margin-bottom: 1rem;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }

  &__lista {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    &__lista {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    &__boton {
      font-size: 1.1rem;
      padding: 12px 18px;
    }
  }
}

.idea-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__contenido {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__titulo {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
  }

  &__descripcion {
    font-size: 1rem;
    line-height: 1.4;
    color: #333;
  }

  &__plazas {
    font-size: 0.95rem;
    font-weight: 600;
    color: #007bff;
  }

  &__boton {
    align-self: flex-start;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #0056b3;
    }
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &__contenido {
      flex: 1;
    }

    &__boton {
      align-self: center;
    }
  }
}
</style>
