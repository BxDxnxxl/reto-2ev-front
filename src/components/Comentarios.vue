<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCommentsStore } from '@/stores/Comentarios'
import { useUsersStore } from '@/stores/users'
import { useRolesStore } from '@/stores/roles'
import type { ComentarioDto } from '@/stores/dtos/Comentario.dto'

const props = defineProps({
  gameId: {
    type: Number,
    default: null,
  },
})

const commentsStore = useCommentsStore()
const usersStore = useUsersStore()
const rolesStore = useRolesStore()

const puedenEliminar = ref<{ [key: number]: boolean }>({})
const reaccionesUsuario = ref<{ [comentarioId: number]: 'like' | 'dislike' | null }>({})

const verificarPermisoEliminar = async (comentarioId: number): Promise<boolean> => {
  const comentario = await commentsStore.fetchComentarioById(comentarioId)
  if (!comentario) return false

  return (
    comentario.fkIdUsuario === usersStore.currentUser?.id ||
    (usersStore.currentUser?.roles?.some(role => role.id === rolesStore.ADMIN) ?? false)
  )
}

onMounted(async () => {
  if (props.gameId) {
    await commentsStore.fetchComentariosByVideojuegos(props.gameId)

    for (const comentario of commentsStore.comentariosByVideojuego) {
      puedenEliminar.value[comentario.id] = await verificarPermisoEliminar(comentario.id)
      reaccionesUsuario.value[comentario.id] = null
    }
  }
})

const eliminarComentario = async (comentarioId: number) => {
  await commentsStore.deleteComentario(comentarioId, props.gameId)
}

const toggleLike = (comentario: ComentarioDto) => {
  const reaccionActual = reaccionesUsuario.value[comentario.id]

  if (reaccionActual === 'like') {
    comentario.likes--
    reaccionesUsuario.value[comentario.id] = null
  } else {
    if (reaccionActual === 'dislike') comentario.dislikes--
    comentario.likes++
    reaccionesUsuario.value[comentario.id] = 'like'
  }
}

const toggleDislike = (comentario: ComentarioDto) => {
  const reaccionActual = reaccionesUsuario.value[comentario.id]

  if (reaccionActual === 'dislike') {
    comentario.dislikes--
    reaccionesUsuario.value[comentario.id] = null
  } else {
    if (reaccionActual === 'like') comentario.likes--
    comentario.dislikes++
    reaccionesUsuario.value[comentario.id] = 'dislike'
  }
}

const formatearFecha = (fecha: string | number | Date) => {
  if (typeof fecha === 'number') return fecha.toString()
  return new Date(fecha).toLocaleDateString('es-ES')
}
</script>

<template>
  <div class="comentarios">
    <h2 class="comentarios__titulo">Comentarios</h2>

    <div class="comentarios__lista">
      <div
        v-for="comentario in commentsStore.comentariosByVideojuego"
        :key="comentario.id"
        class="comentario"
      >
        <div class="comentario__header">
          <span class="comentario__autor">{{ comentario.usuarioNombre }}</span>
          <span class="comentario__fecha">{{ formatearFecha(comentario.fecha) }}</span>
        </div>

        <h4 class="comentario__titulo">{{ comentario.titulo }}</h4>
        <p class="comentario__texto">{{ comentario.texto }}</p>

        <div class="comentario__footer">
          <div class="comentario__valoracion">
            {{ comentario.valoracion }}/10
          </div>

          <div class="comentario__acciones">
            <button 
              class="btn-icon"
              :class="{ active: reaccionesUsuario[comentario.id] === 'like' }"
              @click="toggleLike(comentario)"
            >
              <v-icon size="small">mdi-thumb-up</v-icon>
              {{ comentario.likes }}
            </button>

            <button 
              class="btn-icon"
              :class="{ active: reaccionesUsuario[comentario.id] === 'dislike' }"
              @click="toggleDislike(comentario)"
            >
              <v-icon size="small">mdi-thumb-down</v-icon>
              {{ comentario.dislikes }}
            </button>

            <button 
              v-if="puedenEliminar[comentario.id]" 
              class="btn-icon btn-delete"
              @click="eliminarComentario(comentario.id)"
            >
              <v-icon size="small">mdi-delete</v-icon>
            </button>
          </div>
        </div>
      </div>

      <div v-if="!commentsStore.comentariosByVideojuego.length" class="comentarios__vacio">
        <v-icon size="48" class="comentarios__vacio-icon">mdi-comment-outline</v-icon>
        <p>No hay comentarios disponibles</p>
        <small>¡Sé el primero en comentar!</small>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.comentarios {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-medium;

  &__titulo {
    font-size: $font-size-xlarge;
    font-weight: 600;
    margin-bottom: $spacing-large;
    color: $text-color;
  }

  &__lista {
    display: flex;
    flex-direction: column;
    gap: $spacing-large;
  }

  &__vacio {
    text-align: center;
    padding: $spacing-xxl;
    color: rgba($text-color, 0.6);
    
    &-icon {
      margin-bottom: $spacing-medium;
      opacity: 0.5;
    }
    
    p {
      margin-bottom: $spacing-small;
      font-size: $font-size-base;
    }
    
    small {
      font-size: $font-size-small;
      opacity: 0.7;
    }
  }
}

.comentario {
  background: $card-background;
  border-radius: $border-radius;
  padding: $spacing-large;
  border: 1px solid rgba($primary-color, 0.1);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-medium;
  }

  &__autor {
    font-weight: 600;
    color: $primary-color;
  }

  &__fecha {
    font-size: $font-size-small;
    color: rgba($text-color, 0.6);
  }

  &__titulo {
    font-size: $font-size-large;
    font-weight: 600;
    margin-bottom: $spacing-small;
    color: $text-color;
  }

  &__texto {
    color: rgba($text-color, 0.9);
    line-height: 1.5;
    margin-bottom: $spacing-medium;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__valoracion {
    background: rgba($primary-color, 0.1);
    color: $primary-color;
    padding: $spacing-extra-small $spacing-small;
    border-radius: $border-radius;
    font-weight: 600;
    font-size: $font-size-small;
  }

  &__acciones {
    display: flex;
    gap: $spacing-small;
  }
}

.btn-icon {
  background: none;
  border: none;
  color: rgba($text-color, 0.6);
  cursor: pointer;
  padding: $spacing-extra-small $spacing-small;
  border-radius: $border-radius;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: $font-size-small;
  transition: $transition;

  &:hover {
    background: rgba($text-color, 0.1);
    color: $text-color;
  }

  &.active {
    color: $primary-color;
  }

  &.btn-delete {
    color: $color-error;
    
    &:hover {
      background: rgba($color-error, 0.1);
    }
  }
}
</style>