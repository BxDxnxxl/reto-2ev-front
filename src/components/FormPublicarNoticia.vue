<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useUsuariosEmpresasStore } from '@/stores/usuariosEmpresasStore';
import type { PublicacionEmpresaCreateDto } from '@/stores/dtos/PublicacionEmpresaCreateDto';

const emit = defineEmits(['guardar']);
const usersStore = useUsersStore();
const usuariosEmpresasStore = useUsuariosEmpresasStore();

const imagenFile = ref<File | null>(null);
const puedeDestacar = ref(true);

const publicacion = ref<PublicacionEmpresaCreateDto>({
  fkIdEmpresa: 0,
  fkIdUsuario: usersStore.currentUser?.id ?? 0,
  titulo: '',
  contenido: '',
  imagen: null,
  esDestacada: false,
});

onMounted(async () => {
  const userId = usersStore.currentUser?.id;
  if (!userId) return;

  const empresas = await usuariosEmpresasStore.getEmpresasDeUsuario(userId);
  if (empresas.length > 0) {
    publicacion.value.fkIdEmpresa = empresas[0];
    puedeDestacar.value = await usuariosEmpresasStore.checkLimiteDestacadas(empresas[0]);
  }
});

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    imagenFile.value = input.files[0];
  }
}

function submitForm() {
  const formData = new FormData();
  formData.append('FkIdEmpresa', publicacion.value.fkIdEmpresa.toString());
  formData.append('FkIdUsuario', publicacion.value.fkIdUsuario.toString());
  formData.append('Titulo', publicacion.value.titulo);
  formData.append('Contenido', publicacion.value.contenido ?? '');
  formData.append('EsDestacada', publicacion.value.esDestacada.toString());
  if (imagenFile.value) {
    formData.append('Imagen', imagenFile.value);
  }

  emit('guardar', formData);
}
</script>

<template>
  <v-card class="form-publicacion">
    <v-card-title class="form-publicacion__titulo">
      Nueva Publicación
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitForm" class="form-publicacion__formulario">
        <v-text-field v-model="publicacion.titulo" label="Título" required />
        <v-textarea v-model="publicacion.contenido" label="Contenido" rows="4" />
        <input type="file" @change="handleFileUpload" accept="image/*" required />
        <v-switch
          v-model="publicacion.esDestacada"
          :disabled="!puedeDestacar"
          label="Es destacada"
          color="primary"
        />
        <p v-if="!puedeDestacar" class="form-publicacion__aviso">
          Ya se ha alcanzado el máximo de publicaciones destacadas este mes para tu empresa.
        </p>
        <v-btn type="submit" color="primary" class="form-publicacion__btn">
          Guardar Publicación
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
@import "@/assets/styles/variables.scss";

.form-publicacion {
  padding: $spacing-large;
  max-width: 700px;
  margin: $spacing-xl auto;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  background: $background-color;
  color: $text-color;

  &__titulo {
    font-size: $font-size-xlarge;
    font-weight: 700;
    margin-bottom: $spacing-medium;
    text-align: center;
    color: $primary-color;
  }

  &__formulario {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;

    input,
    textarea,
    select {
      padding: $spacing-small;
      border-radius: $border-radius;
      border: 1px solid $color-disabled;
      background: #ffffff;
      color: #000000;
      font-size: $font-size-base;
      transition: $transition;

      &:focus {
        outline: none;
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba(242, 84, 33, 0.3);
      }
    }

    label {
      font-weight: 600;
      font-size: $font-size-small;
      color: lighten($text-color, 20%);
    }
  }

  &__btn {
    align-self: center;
    background-color: $primary-color;
    color: $text-color;
    font-weight: bold;
    padding: $spacing-small $spacing-medium;
    border-radius: $border-radius;
    border: none;
    cursor: pointer;
    transition: $transition;

    &:hover {
      background-color: darken($primary-color, 5%);
    }
  }
}
</style>
