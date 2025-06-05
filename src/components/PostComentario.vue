<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCommentsStore } from '@/stores/Comentarios'
import { useUsersStore } from '@/stores/users'
import type { ComentarioDto } from '@/stores/dtos/Comentario.dto'

const props = defineProps({
  gameId: {
    type: Number,
    required: true,
  },
})

const commentsStore = useCommentsStore()
const usersStore = useUsersStore()
const mostrarFormulario = ref(false)
const enviando = ref(false)

const comentario = ref<ComentarioDto>({
  id: 0,
  fkIdUsuario: usersStore.currentUser?.id ?? 0,
  fkIdVideojuego: props.gameId,
  titulo: '',
  texto: '',
  fecha: new Date(),
  valoracion: 5,
  likes: 0,
  dislikes: 0,
})

const usuarioLogueado = computed(() => usersStore.currentUser)

const formularioValido = computed(() => {
  return comentario.value.titulo.trim() !== '' && 
         comentario.value.texto.trim() !== '' && 
         comentario.value.valoracion >= 1 && 
         comentario.value.valoracion <= 10
})

async function enviarComentario() {
  if (!usuarioLogueado.value || !formularioValido.value) return

  enviando.value = true
  comentario.value.fkIdUsuario = usuarioLogueado.value.id ?? 0

  try {
    await commentsStore.postComentario(comentario.value)
    comentario.value.titulo = ''
    comentario.value.texto = ''
    comentario.value.valoracion = 5
    mostrarFormulario.value = false
  } catch (error) {
    console.error('Error al enviar comentario', error)
  } finally {
    enviando.value = false
  }
}

function cancelarComentario() {
  comentario.value.titulo = ''
  comentario.value.texto = ''
  comentario.value.valoracion = 5
  mostrarFormulario.value = false
}
</script>

<template>
  <div class="post-comentarios">
    <h2 class="post-comentarios__titulo">Deja un comentario</h2>

    <v-btn
      v-if="!mostrarFormulario"
      class="post-comentarios__boton-principal"
      size="large"
      @click="mostrarFormulario = true"
    >
      <v-icon left>mdi-comment-plus</v-icon>
      Añadir Comentario
    </v-btn>

    <div v-if="!usuarioLogueado && mostrarFormulario" class="post-comentarios__bloqueado">
      <div class="post-comentarios__bloqueado-icono">
        <v-icon size="32">mdi-account-lock</v-icon>
      </div>
      <h3 class="post-comentarios__bloqueado-titulo">Inicia sesión para comentar</h3>
      <p class="post-comentarios__bloqueado-texto">
        Para dejar un comentario necesitas tener una cuenta y estar logueado
      </p>
      <div class="post-comentarios__bloqueado-acciones">
        <v-btn 
          class="post-comentarios__boton-secundario"
          @click="mostrarFormulario = false"
        >
          Cerrar
        </v-btn>
      </div>
    </div>

    <v-form
      v-else-if="mostrarFormulario"
      class="post-comentarios__formulario"
      @submit.prevent="enviarComentario"
    >
      <div class="post-comentarios__formulario-header">
        <h3 class="post-comentarios__formulario-titulo">Nuevo comentario</h3>
        <p class="post-comentarios__formulario-subtitulo">
          Comparte tu opinión sobre este videojuego
        </p>
      </div>

      <div class="post-comentarios__campo">
        <v-text-field
          v-model="comentario.titulo"
          label="Título del comentario"
          placeholder="Ej: Excelente juego, muy recomendado"
          required
          maxlength="100"
          variant="outlined"
          class="post-comentarios__input"
          :rules="[v => !!v || 'El título es requerido']"
        >
          <template #prepend-inner>
            <v-icon>mdi-format-title</v-icon>
          </template>
        </v-text-field>
      </div>

      <div class="post-comentarios__campo">
        <v-textarea
          v-model="comentario.texto"
          label="Tu comentario"
          placeholder="Escribe aquí tu opinión detallada sobre el videojuego..."
          rows="4"
          required
          maxlength="500"
          variant="outlined"
          class="post-comentarios__input"
          :rules="[v => !!v || 'El comentario es requerido']"
        >
          <template #prepend-inner>
            <v-icon>mdi-text</v-icon>
          </template>
        </v-textarea>
        <div class="post-comentarios__contador">
          {{ comentario.texto.length }}/500 caracteres
        </div>
      </div>

      <div class="post-comentarios__campo">
        <div class="post-comentarios__valoracion">
          <label class="post-comentarios__valoracion-label">
            <v-icon>mdi-star</v-icon>
            Valoración
          </label>
          <div class="post-comentarios__valoracion-control">
            <v-slider
              v-model="comentario.valoracion"
              :min="1"
              :max="10"
              :step="1"
              show-ticks
              tick-size="4"
              class="post-comentarios__slider"
              color="primary"
            >
              <template #thumb-label="{ modelValue }">
                {{ modelValue }}/10
              </template>
            </v-slider>
            <div class="post-comentarios__valoracion-display">
              <span class="post-comentarios__valoracion-numero">{{ comentario.valoracion }}</span>
              <span class="post-comentarios__valoracion-max">/10</span>
            </div>
          </div>
        </div>
      </div>

      <div class="post-comentarios__acciones">
        <v-btn 
          type="submit" 
          class="post-comentarios__boton-principal"
          :disabled="!formularioValido || enviando"
          :loading="enviando"
          size="large"
        >
          <v-icon left>mdi-send</v-icon>
          {{ enviando ? 'Publicando...' : 'Publicar Comentario' }}
        </v-btn>
        
        <v-btn 
          class="post-comentarios__boton-secundario"
          @click="cancelarComentario"
          :disabled="enviando"
          size="large"
        >
          <v-icon left>mdi-close</v-icon>
          Cancelar
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.post-comentarios {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-medium;

  &__titulo {
    font-family: $font-family-title;
    font-size: $font-size-xlarge;
    font-weight: 700;
    margin-bottom: $spacing-large;
    color: $text-color;
    text-align: center;

    @media (min-width: $desktop) {
      font-size: 28px;
      text-align: left;
    }
  }

  &__boton-principal {
    background: $primary-gradient;
    color: $text-color;
    font-family: $font-family-base;
    font-weight: 600;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    transition: $transition;
    border: none;
    text-transform: none;
    letter-spacing: 0.5px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($primary-color, 0.3);
    }

    &:disabled {
      background-color: $color-disabled;
      color: rgba($text-color, 0.6);
      transform: none;
      box-shadow: $box-shadow;
    }
  }

  &__boton-secundario {
    background-color: transparent;
    color: $text-color;
    font-family: $font-family-base;
    font-weight: 500;
    border: 2px solid rgba($text-color, 0.3);
    border-radius: $border-radius;
    transition: $transition;
    text-transform: none;

    &:hover {
      background-color: rgba($text-color, 0.1);
      border-color: rgba($text-color, 0.5);
    }
  }

  &__bloqueado {
    background: linear-gradient(135deg, rgba($color-warning, 0.1), rgba($color-error, 0.1));
    border: 2px solid rgba($color-warning, 0.3);
    border-radius: $border-radius;
    padding: $spacing-xl;
    text-align: center;
    margin-top: $spacing-medium;

    &-icono {
      color: $color-warning;
      margin-bottom: $spacing-medium;
    }

    &-titulo {
      font-family: $font-family-base;
      font-size: $font-size-large;
      font-weight: 600;
      color: $text-color;
      margin-bottom: $spacing-small;
    }

    &-texto {
      font-family: $font-family-base;
      font-size: $font-size-base;
      color: rgba($text-color, 0.8);
      margin-bottom: $spacing-large;
      line-height: 1.5;
    }

    &-acciones {
      display: flex;
      justify-content: center;
    }
  }

  &__formulario {
    background-color: $card-background;
    border-radius: $border-radius;
    padding: $spacing-xl;
    box-shadow: $box-shadow;
    border: 1px solid rgba($primary-color, 0.2);
    margin-top: $spacing-medium;

    &-header {
      text-align: center;
      margin-bottom: $spacing-large;
      padding-bottom: $spacing-medium;
      border-bottom: 2px solid rgba($primary-color, 0.2);
    }

    &-titulo {
      font-family: $font-family-base;
      font-size: $font-size-large;
      font-weight: 600;
      color: $primary-color;
      margin-bottom: $spacing-extra-small;
    }

    &-subtitulo {
      font-family: $font-family-base;
      font-size: $font-size-base;
      color: rgba($text-color, 0.7);
      font-style: italic;
    }
  }

  &__campo {
    margin-bottom: $spacing-large;
    position: relative;
  }

  &__input {
    font-family: $font-family-base;
    
    :deep(.v-field) {
      background-color: rgba($background-color, 0.5);
      border-radius: $border-radius;
    }

    :deep(.v-field--focused) {
      border-color: $primary-color;
    }

    :deep(.v-label) {
      color: rgba($text-color, 0.7);
      font-family: $font-family-base;
    }

    :deep(.v-field__input) {
      color: $text-color;
      font-family: $font-family-base;
    }
  }

  &__contador {
    font-family: $font-family-base;
    font-size: $font-size-small;
    color: rgba($text-color, 0.6);
    text-align: right;
    margin-top: $spacing-extra-small;
  }

  &__valoracion {
    &-label {
      font-family: $font-family-base;
      font-size: $font-size-base;
      font-weight: 600;
      color: $text-color;
      display: flex;
      align-items: center;
      gap: $spacing-extra-small;
      margin-bottom: $spacing-medium;
    }

    &-control {
      display: flex;
      align-items: center;
      gap: $spacing-medium;
    }

    &-display {
      display: flex;
      align-items: center;
      background: rgba($primary-color, 0.1);
      padding: $spacing-small $spacing-medium;
      border-radius: $border-radius;
      min-width: 60px;
      justify-content: center;
    }

    &-numero {
      font-family: $font-family-base;
      font-size: $font-size-large;
      font-weight: 700;
      color: $primary-color;
    }

    &-max {
      font-family: $font-family-base;
      font-size: $font-size-base;
      color: rgba($text-color, 0.6);
    }
  }

  &__slider {
    flex: 1;
    
    :deep(.v-slider-track__fill) {
      background: $primary-gradient;
    }

    :deep(.v-slider-thumb) {
      background: $primary-color;
    }
  }

  &__acciones {
    display: flex;
    justify-content: center;
    gap: $spacing-medium;
    padding-top: $spacing-large;
    border-top: 1px solid rgba($primary-color, 0.2);

    @media (min-width: $desktop) {
      justify-content: flex-end;
    }
  }

  // Media queries
  @media (min-width: $desktop) {
    padding: $spacing-large;

    &__formulario {
      padding: $spacing-xxl;
    }
  }

  @media (min-width: $laptop) {
    &__titulo {
      font-size: 32px;
    }

    &__formulario {
      &-titulo {
        font-size: $font-size-xlarge;
      }
    }
  }
}

// Animaciones
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-comentarios__formulario,
.post-comentarios__bloqueado {
  animation: fadeInUp 0.3s ease forwards;
}
</style>