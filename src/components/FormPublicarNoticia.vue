<script setup lang="ts">
import { ref, watch } from 'vue';
import { usePublicacionesEmpresasStore } from '@/stores/publicacionesEmpresasStore';
import type { PublicacionEmpresaDto } from '@/stores/dtos/PublicacionEmpresa.dto';
import { useUsersStore } from '@/stores/users';

const emit = defineEmits(['guardar']);
const props = defineProps<{ publicacion?: PublicacionEmpresaDto }>();
const usersStore = useUsersStore();
const publicacionesStore = usePublicacionesEmpresasStore();
const publicacion = ref<PublicacionEmpresaDto>({
  id: props.publicacion?.id ?? 0,
  idEmpresa: props.publicacion?.idEmpresa ?? 0,
  idUsuario: usersStore.currentUser?.id ?? 0,
  titulo: props.publicacion?.titulo ?? '',
  contenido: props.publicacion?.contenido ?? '',
  imagen: props.publicacion?.imagen ?? '',
  esDestacada: props.publicacion?.esDestacada ?? false,
  fechaPublicacion: props.publicacion?.fechaPublicacion ? (props.publicacion?.fechaPublicacion) : new Date(),
});

// campo auxiliar para v-text-field de fecha
const fechaInput = ref(formatFechaInput(publicacion.value.fechaPublicacion));

watch(fechaInput, (val) => {
  publicacion.value.fechaPublicacion = new Date(val);
});

function formatFechaInput(fecha: Date): string {
  return new Date(fecha).toISOString().slice(0, 16); // formato para datetime-local
}

function submitForm() {
  console.log(publicacion);
  
  emit('guardar', publicacion.value);
}
</script>

<template>
  <v-card class="form-publicacion">
    <v-card-title class="form-publicacion__titulo">
      {{ publicacion.id ? 'Editar Publicación' : 'Nueva Publicación' }}
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitForm" class="form-publicacion__formulario">
        <v-text-field v-model="publicacion.titulo" label="Título" required />
        <v-textarea v-model="publicacion.contenido" label="Contenido" rows="4" />
        <v-text-field v-model="publicacion.imagen" label="URL de la Imagen" />
        
        <v-text-field
          v-model="fechaInput"
          label="Fecha de Publicación"
          type="datetime-local"
          required
        />

        <v-switch v-model="publicacion.esDestacada" label="Es destacada" color="primary" />

        <v-btn type="submit" color="primary" class="form-publicacion__btn">
          Guardar Publicación
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.form-publicacion {
  padding: 1.5rem;
  max-width: 700px;
  margin: 2rem auto;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  background: white;

  &__titulo {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
  }

  &__formulario {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__btn {
    align-self: center;
    font-weight: bold;
  }
}
</style>
