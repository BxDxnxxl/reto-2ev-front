<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useIdeasStore } from "@/stores/ideas";
import { useUsersStore } from "@/stores/users";

const router = useRouter();
const store = useIdeasStore();
const usersStore = useUsersStore();

const usuarioLogueado = computed(() => usersStore.currentUser);

onMounted(() => {
  store.fetchIdeasConUsuarios();
});

const formatearFechaEspañola = (fecha: string | number | Date) => {
  if (typeof fecha === "number") {
    return fecha.toString();
  }

  const fechaObj = new Date(fecha);
  const dia = fechaObj.getDate().toString().padStart(2, "0");
  const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
  const anio = fechaObj.getFullYear();

  return `${dia}/${mes}/${anio}`;
};

const irAVistaAñadirIdea = () => {
  router.push("/añadirIdea");
};
</script>

<template>
    <div class="d-flex justify-space-between align-center mb-2">
      <h1 class="text-h4">Ideas</h1>
      <br>
      <v-btn color="primary" @click="irAVistaAñadirIdea">
        Añadir Idea
      </v-btn>
    </div>
  <v-container>

    <div class="idea-grid">
      <v-card
        v-for="idea in store.ideasUsuarios"
        :key="idea.id"
        class="idea-card"
        elevation="2"
      >
        <v-card-title>{{ idea.titulo }}</v-card-title>
        <v-card-subtitle>{{ formatearFechaEspañola(idea.fechaCreacion) }}</v-card-subtitle>

        <v-card-text>
          <strong>Tipo:</strong> {{ idea.tipo }}
          <br />
          <strong>Descripción:</strong> {{ idea.descripcion }}
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>
.idea-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}

@media (min-width: 500px) {
  .idea-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .idea-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1000px) {
  .idea-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.idea-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.2s;
}

.idea-card:hover {
  transform: translateY(-5px);
}

.idea-card__image {
  position: relative;
  overflow: hidden;
}

.idea-card__overlay {
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 0 0 0 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.idea-card:hover .idea-card__overlay {
  opacity: 1;
}
</style>
