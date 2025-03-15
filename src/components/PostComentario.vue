<script setup lang="ts">
import { ref, computed } from "vue";
import { useCommentsStore } from "@/stores/Comentarios";
import { useUsersStore } from "@/stores/users";
import type { ComentarioDto } from "@/stores/dtos/Comentario.dto";

const props = defineProps({
  gameId: {
    type: Number,
    required: true
  }
});

const commentsStore = useCommentsStore();
const usersStore = useUsersStore();

const comentario = ref<ComentarioDto>({
  id: 0,
  fkIdUsuario: usersStore.currentUser?.id ?? 0,
  fkIdVideojuego: props.gameId,
  titulo: "",
  texto: "",
  fecha: new Date(),
  valoracion: 5,
  likes: 0,
  dislikes: 0
});

const usuarioLogueado = computed(() => usersStore.currentUser);

async function enviarComentario() {
  if (!usuarioLogueado.value) return;

  comentario.value.fkIdUsuario = usuarioLogueado.value.id ?? 0;

  try {
    await commentsStore.postComentario(comentario.value);
    comentario.value.titulo = "";
    comentario.value.texto = "";
    comentario.value.valoracion = 5;
  } catch (error) {
    console.error("Error al enviar comentario", error);
  }
}
</script>

<template>
  <div class="comentarios">
    <h2 class="comentarios__titulo">Deja un comentario</h2>

    <div v-if="!usuarioLogueado" class="comentarios__bloqueado">
      <p>Para comentar debes estar logueado</p>
    </div>

    <v-form v-else class="comentarios__formulario" @submit.prevent="enviarComentario">
      <v-text-field
        v-model="comentario.titulo"
        label="Título"
        required
        maxlength="100"
        class="comentarios__input"
      ></v-text-field>

      <v-textarea
        v-model="comentario.texto"
        label="Comentario"
        rows="3"
        required
        maxlength="500"
        class="comentarios__input"
      ></v-textarea>

      <v-text-field
        v-model.number="comentario.valoracion"
        label="Valoración (1-10)"
        type="number"
        min="1"
        max="10"
        step="1"
        required
        class="comentarios__input"
      ></v-text-field>

      <v-btn color="primary" type="submit" class="comentarios__boton">Publicar</v-btn>
    </v-form>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.comentarios {
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 16px;

  &__titulo {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  &__bloqueado {
    background: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    font-weight: bold;
  }

  &__formulario {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background: #fff;
  }

  &__input {
    width: 100%;
  }

  &__boton {
    width: fit-content;
    align-self: center;
    padding: 8px 24px;
    font-size: 1rem;
  }
}
</style>
