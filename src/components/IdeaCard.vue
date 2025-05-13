<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useIdeasStore } from "@/stores/Ideas";
import { useUsersStore } from "@/stores/users";
import FormularioIdea from "@/components/FormularioIdea.vue";

const ideasStore = useIdeasStore();
const usersStore = useUsersStore();
const mostrarFormulario = ref(false);
const ideasApuntadasIds = ref<number[]>([]); // Solo se usa para precarga

const estadoApuntado = ref<{ [key: number]: boolean }>({}); // idea.id -> true/false

onMounted(async () => {
  await ideasStore.fetchIdeasConPlazas();
  await verificarApuntados();
});

const toggleFormulario = () => {
  mostrarFormulario.value = !mostrarFormulario.value;
};

const onIdeaPublicada = async () => {
  mostrarFormulario.value = false;
  await ideasStore.fetchIdeasConPlazas();
  await verificarApuntados();
};

const verificarApuntados = async () => {
  const userId = usersStore.currentUser?.id;
  if (!userId) return;

  for (const idea of ideasStore.ideasConPlazas) {
    const esta = await ideasStore.verificarSiUsuarioApuntado(idea.id, userId);
    estadoApuntado.value[idea.id] = esta;
  }
};

const handleUnirse = async (idIdea: number, creadorId: number) => {
  const userId = usersStore.currentUser?.id;

  if (!userId) {
    alert("Para realizar esta acción debes iniciar sesión.");
    return;
  }

  if (userId === creadorId) {
    alert("No puedes unirte a tu propia idea.");
    return;
  }

  if (estadoApuntado.value[idIdea]) {
    alert("Ya estás apuntado a esta idea.");
    return;
  }

  await ideasStore.unirseAIdea(idIdea, userId);
  await ideasStore.fetchIdeasConPlazas();
  await verificarApuntados();
};
</script>

<template>
  <div class="ideas">
    <button class="ideas__boton" @click="toggleFormulario">
      {{ mostrarFormulario ? "Cancelar" : "➕ Añadir idea" }}
    </button>

    <FormularioIdea v-if="mostrarFormulario" @ideaPublicada="onIdeaPublicada" />

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
            {{ idea.plazasLibres }} de {{ idea.plazasTotales }} plazas libres
          </p>

          <div class="idea-card__barra-plazas">
            <div
              v-for="index in idea.plazasTotales"
              :key="index"
              :class="[
                'idea-card__plaza',
                index > idea.plazasLibres ? 'idea-card__plaza--ocupada' : ''
              ]"
            ></div>
          </div>
        </div>

        <div class="idea-card__acciones">
          <template v-if="usersStore.currentUser">
            <template v-if="usersStore.currentUser.id === idea.fkIdUsuario">
              <p class="idea-card__mensaje">Eres el creador</p>
            </template>
            <template v-else-if="estadoApuntado[idea.id]">
              <p class="idea-card__mensaje">Ya estás apuntado</p>
            </template>
            <template v-else>
              <button
                class="idea-card__boton"
                @click="handleUnirse(idea.id, idea.fkIdUsuario)"
              >
                ¡Me uno!
              </button>
            </template>
          </template>
        </div>
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

    @media (min-width: 768px) {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1.5rem;
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

  &__barra-plazas {
    display: flex;
    gap: 4px;
    margin-top: 8px;
    flex-wrap: wrap;
  }

  &__plaza {
    flex: 1;
    min-width: 20px;
    height: 16px;
    background-color: #d1e8ff;
    border-radius: 4px;

    &--ocupada {
      background-color: #ccc;
      text-decoration: line-through;
    }
  }

  &__acciones {
    margin-top: 10px;
  }

  &__mensaje {
    font-size: 0.95rem;
    color: #28a745;
    font-weight: 600;
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
