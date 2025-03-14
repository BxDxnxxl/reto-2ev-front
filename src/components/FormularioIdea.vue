<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useIdeasStore } from "@/stores/ideas";

const router = useRouter();
const route = useRoute();
const ideasStore = useIdeasStore();

const categorias = ["mejora", "desarrollo", "correccion", "Otro"];
const loading = ref(false);
const formValid = ref(true);

const idea = ref({
  id: 0,
  fkIdUsuario: 2,
  titulo: "",
  descripcion: "",
  tipo: "",
  fechaCreacion: new Date(),
});

async function guardarIdea() {
  formValid.value = !!idea.value.titulo && !!idea.value.descripcion && !!idea.value.tipo;
  
  if (!formValid.value) {
    return;
  }

  try {
    loading.value = true;
    await ideasStore.addIdea(idea.value);
    loading.value = false;
    router.push("/ideas");
  } catch (error) {
    loading.value = false;
    console.error("Error al guardar la idea:", error);
  }
}
</script>

<template>
  <v-container class="form-container">
    <v-card class="form-card mx-auto">
      <v-card-title class="d-flex align-center py-4">
        <h1 class="text-h5 font-weight-bold flex-grow-1">Nueva Idea</h1>
        <v-btn 
          color="secondary" 
          variant="text" 
          size="small" 
          icon="mdi-arrow-left"
          @click="router.push('/ideas')"
          class="ml-2"
        >
          <v-tooltip activator="parent" location="bottom">Volver</v-tooltip>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-form 
        @submit.prevent="guardarIdea"
        v-model="formValid"
        class="px-4 py-6"
      >
        <v-card-text class="px-0">
          <v-text-field
            v-model="idea.titulo"
            label="Título de la idea"
            variant="outlined"
            density="comfortable"
            required
            :rules="[v => !!v || 'El título es obligatorio']"
            class="mb-4"
          ></v-text-field>

          <v-select
            v-model="idea.tipo"
            :items="categorias"
            label="Tipo de idea"
            variant="outlined"
            density="comfortable"
            required
            :rules="[v => !!v || 'Seleccione un tipo']"
            class="mb-4"
          ></v-select>

          <v-textarea
            v-model="idea.descripcion"
            label="Descripción"
            variant="outlined"
            rows="4"
            required
            auto-grow
            :rules="[v => !!v || 'La descripción es obligatoria']"
            counter
            class="mb-4"
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="px-0 pt-4">
          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
            :disabled="!formValid"
            variant="elevated"
          >
            Guardar Idea
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<style scoped>
.form-container {
  max-width: 100%;
  padding: 16px;
}

.form-card {
  max-width: 850px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

@media (max-width: 600px) {
  .form-container {
    padding: 8px;
  }
  
  .form-card {
    border-radius: 4px;
  }
  
  .v-card-title {
    padding: 12px 16px !important;
  }
  
  .v-form {
    padding: 16px !important;
  }
}

@media (min-width: 960px) {
  .form-card {
    padding: 8px 24px;
  }
}
</style>