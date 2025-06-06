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
    resetForm()
  } catch (error) {
    console.error('Error al enviar comentario', error)
  } finally {
    enviando.value = false
  }
}

function resetForm() {
  comentario.value.titulo = ''
  comentario.value.texto = ''
  comentario.value.valoracion = 5
  mostrarFormulario.value = false
}
</script>

<template>
  <div class="post-comentario">
    <h2 class="post-comentario__titulo">Deja un comentario</h2>

    <v-btn
      v-if="!mostrarFormulario"
      class="btn-primary"
      @click="mostrarFormulario = true"
    >
      <v-icon left>mdi-comment-plus</v-icon>
      Añadir Comentario
    </v-btn>

    <div v-if="!usuarioLogueado && mostrarFormulario" class="post-comentario__login">
      <v-icon size="32" class="post-comentario__login-icon">mdi-account-lock</v-icon>
      <h3>Inicia sesión para comentar</h3>
      <p>Para dejar un comentario necesitas tener una cuenta y estar logueado</p>
      <v-btn class="btn-secondary" @click="mostrarFormulario = false">
        Cerrar
      </v-btn>
    </div>

    <form
      v-else-if="mostrarFormulario"
      class="post-comentario__form"
      @submit.prevent="enviarComentario"
    >
      <div class="form-group">
        <v-text-field
          v-model="comentario.titulo"
          label="Título del comentario"
          variant="outlined"
          required
          maxlength="100"
        />
      </div>

      <div class="form-group">
        <v-textarea
          v-model="comentario.texto"
          label="Tu comentario"
          variant="outlined"
          rows="4"
          required
          maxlength="500"
        />
        <small class="char-counter">{{ comentario.texto.length }}/500</small>
      </div>

      <div class="form-group">
        <label class="form-label">
          <v-icon>mdi-star</v-icon>
          Valoración: {{ comentario.valoracion }}/10
        </label>
        <v-slider
          v-model="comentario.valoracion"
          :min="1"
          :max="10"
          :step="1"
          show-ticks
          color="primary"
        />
      </div>

      <div class="form-actions">
        <v-btn 
          type="submit" 
          class="btn-primary"
          :disabled="!formularioValido || enviando"
          :loading="enviando"
        >
          <v-icon left>mdi-send</v-icon>
          {{ enviando ? 'Publicando...' : 'Publicar' }}
        </v-btn>
        
        <v-btn 
          class="btn-secondary"
          @click="resetForm"
          :disabled="enviando"
        >
          Cancelar
        </v-btn>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.post-comentario {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-medium;

  &__titulo {
    font-size: $font-size-xlarge;
    font-weight: 600;
    margin-bottom: $spacing-large;
    color: $text-color;
  }

  &__login {
    background: $card-background;
    border: 1px solid rgba($color-warning, 0.3);
    border-radius: $border-radius;
    padding: $spacing-xl;
    text-align: center;
    margin-top: $spacing-medium;

    &-icon {
      color: $color-warning;
      margin-bottom: $spacing-medium;
    }

    h3 {
      margin-bottom: $spacing-small;
      color: $text-color;
    }

    p {
      color: rgba($text-color, 0.8);
      margin-bottom: $spacing-large;
    }
  }

  &__form {
    background: $card-background;
    border-radius: $border-radius;
    padding: $spacing-xl;
    margin-top: $spacing-medium;
    border: 1px solid rgba($primary-color, 0.2);
  }
}

.form-group {
  margin-bottom: $spacing-large;

  .char-counter {
    color: rgba($text-color, 0.6);
    font-size: $font-size-small;
    text-align: right;
    display: block;
    margin-top: $spacing-extra-small;
  }
}

.form-label {
  display: flex;
  align-items: center;
  gap: $spacing-extra-small;
  margin-bottom: $spacing-medium;
  color: $text-color;
  font-weight: 600;
}

.form-actions {
  display: flex;
  gap: $spacing-medium;
  justify-content: flex-end;
  padding-top: $spacing-medium;
  border-top: 1px solid rgba($primary-color, 0.2);
}

.btn-primary {
  background: $primary-gradient;
  color: $text-color;
  font-weight: 600;

  &:disabled {
    background: $color-disabled;
    color: rgba($text-color, 0.6);
  }
}

.btn-secondary {
  background: transparent;
  color: $text-color;
  border: 1px solid rgba($text-color, 0.3);

  &:hover {
    background: rgba($text-color, 0.1);
  }
}
</style>