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

const formatearFechaEspañola = (fecha: string | number | Date) => {
  if (typeof fecha === 'number') return fecha.toString()
  const fechaObj = new Date(fecha)
  const dia = fechaObj.getDate().toString().padStart(2, '0')
  const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0')
  const anio = fechaObj.getFullYear()
  return `${dia}/${mes}/${anio}`
}
</script>

<template>
  <div class="comentarios">
    <h2 class="comentarios__titulo">Comentarios</h2>

    <div class="comentarios__lista">
      <div
        v-for="comentario in commentsStore.comentariosByVideojuego"
        :key="comentario.id"
        class="comentarios__item"
      >
        <div class="comentarios__cabecera">
          <h3 class="comentarios__nombre">{{ comentario.usuarioNombre }}</h3>
          <span class="comentarios__fecha">{{ formatearFechaEspañola(comentario.fecha) }}</span>
        </div>

        <h4 class="comentarios__titulo-texto">{{ comentario.titulo }}</h4>
        <p class="comentarios__texto">{{ comentario.texto }}</p>

        <div class="comentarios__valoracion">
          <span class="comentarios__valoracion-label">Valoración:</span>
          <div class="comentarios__valoracion-estrellas">
            <span class="comentarios__valoracion-numero">{{ comentario.valoracion }}</span>
            <span class="comentarios__valoracion-max">/10</span>
          </div>
        </div>

        <div class="comentarios__acciones">
          <div class="comentarios__like">
            <v-btn 
              icon 
              variant="text" 
              size="small" 
              class="comentarios__boton-accion comentarios__boton-accion--like"
              :class="{ activo: reaccionesUsuario[comentario.id] === 'like' }"
              @click="toggleLike(comentario)"
            >
              <v-icon>mdi-thumb-up</v-icon>
            </v-btn>
            <span class="comentarios__contador">{{ comentario.likes }}</span>
          </div>

          <div class="comentarios__dislike">
            <v-btn 
              icon 
              variant="text" 
              size="small" 
              class="comentarios__boton-accion comentarios__boton-accion--dislike"
              :class="{ activo: reaccionesUsuario[comentario.id] === 'dislike' }"
              @click="toggleDislike(comentario)"
            >
              <v-icon>mdi-thumb-down</v-icon>
            </v-btn>
            <span class="comentarios__contador">{{ comentario.dislikes }}</span>
          </div>

          <v-btn 
            v-if="puedenEliminar[comentario.id]" 
            icon 
            variant="text" 
            size="small" 
            class="comentarios__boton-accion comentarios__boton-accion--delete"
            @click="eliminarComentario(comentario.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>

      <div v-if="!commentsStore.comentariosByVideojuego.length" class="comentarios__vacio">
        <div class="comentarios__vacio-icono">
          <v-icon size="48">mdi-comment-outline</v-icon>
        </div>
        <p class="comentarios__vacio-texto">No hay comentarios disponibles para este videojuego</p>
        <p class="comentarios__vacio-subtexto">¡Sé el primero en comentar!</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.comentarios {
  width: 100%;
  max-width: 100%;
  margin-top: 0;
  padding-bottom: $spacing-xxl;

  &__titulo {
    font-family: $font-family-title;
    font-size: $font-size-xlarge;
    margin-bottom: $spacing-medium;
    font-weight: 700;
    color: $text-color;
    text-align: center;
    
    @media (min-width: $desktop) {
      font-size: 28px;
      text-align: left;
    }
  }

  &__lista {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 0 $spacing-medium;
  }

  &__item {
    background-color: $card-background;
    border-radius: $border-radius;
    padding: $spacing-medium;
    box-shadow: $box-shadow;
    border: 1px solid rgba($primary-color, 0.1);
    transition: $transition;
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($primary-color, 0.15);
      border-color: rgba($primary-color, 0.3);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: $primary-gradient;
      opacity: 0;
      transition: $transition;
    }

    &:hover::before {
      opacity: 1;
    }
  }

  &__cabecera {
    display: flex;
    flex-direction: column;
    margin-bottom: $spacing-small;
    gap: $spacing-extra-small;

    @media (min-width: $desktop) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: $spacing-medium;
    }
  }

  &__nombre {
    font-family: $font-family-base;
    font-weight: 700;
    font-size: $font-size-base;
    margin: 0;
    color: $primary-color;
    display: flex;
    align-items: center;

    &::before {
      content: '👤';
      margin-right: $spacing-extra-small;
      font-size: $font-size-small;
    }
  }

  &__fecha {
    font-family: $font-family-base;
    font-size: $font-size-small;
    color: rgba($text-color, 0.7);
    font-weight: 500;
    
    &::before {
      content: '📅';
      margin-right: $spacing-extra-small;
    }
  }

  &__titulo-texto {
    font-family: $font-family-base;
    font-size: $font-size-large;
    margin: $spacing-small 0;
    font-weight: 600;
    color: $text-color;
    line-height: 1.4;
  }

  &__texto {
    font-family: $font-family-base;
    font-size: $font-size-base;
    margin-bottom: $spacing-medium;
    line-height: 1.6;
    color: rgba($text-color, 0.9);
  }

  &__valoracion {
    display: flex;
    align-items: center;
    gap: $spacing-small;
    margin-bottom: $spacing-medium;
    padding: $spacing-extra-small $spacing-small;
    background: rgba($primary-color, 0.1);
    border-radius: $border-radius / 2;
    width: fit-content;

    &-label {
      font-family: $font-family-base;
      font-size: $font-size-small;
      color: $text-color;
      font-weight: 600;
    }

    &-estrellas {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    &-numero {
      font-family: $font-family-base;
      font-size: $font-size-base;
      font-weight: 700;
      color: $primary-color;
    }

    &-max {
      font-family: $font-family-base;
      font-size: $font-size-small;
      color: rgba($text-color, 0.6);
    }
  }

  &__acciones {
    display: flex;
    gap: $spacing-medium;
    align-items: center;
    justify-content: flex-start;

    @media (min-width: $desktop) {
      justify-content: flex-end;
    }
  }

  &__like,
  &__dislike {
    display: flex;
    align-items: center;
    gap: $spacing-extra-small;
  }

  &__boton-accion {
    transition: $transition;
    border-radius: 50%;

    &--like {
      color: $color-success;

      &:hover {
        background-color: rgba($color-success, 0.1);
        color: lighten($color-success, 10%);
      }
    }

    &--dislike {
      color: $color-warning;

      &:hover {
        background-color: rgba($color-warning, 0.1);
        color: darken($color-warning, 10%);
      }
    }

    &--delete {
      color: $color-error;

      &:hover {
        background-color: rgba($color-error, 0.1);
        color: lighten($color-error, 10%);
      }
    }
  }

  &__contador {
    font-family: $font-family-base;
    font-size: $font-size-small;
    font-weight: 600;
    color: $text-color;
    min-width: 20px;
    text-align: center;
  }

  &__vacio {
    text-align: center;
    padding: $spacing-xxl;
    background-color: $card-background;
    border-radius: $border-radius;
    border: 2px dashed rgba($primary-color, 0.3);

    &-icono {
      color: rgba($text-color, 0.4);
      margin-bottom: $spacing-medium;
    }

    &-texto {
      font-family: $font-family-base;
      font-size: $font-size-large;
      color: rgba($text-color, 0.7);
      margin-bottom: $spacing-small;
      font-weight: 600;
    }

    &-subtexto {
      font-family: $font-family-base;
      font-size: $font-size-base;
      color: rgba($text-color, 0.5);
      font-style: italic;
    }
  }

  // Media queries usando variables
  @media (min-width: $desktop) {
    &__lista {
      padding: 0 $spacing-large;
    }

    &__item {
      padding: $spacing-large;
    }
  }

  @media (min-width: $laptop) {
    &__lista {
      padding: 0 $spacing-xl;
    }

    &__item {
      padding: $spacing-xl;
    }

    &__titulo {
      font-size: 32px;
    }

    &__texto {
      font-size: $font-size-large;
    }

    &__titulo-texto {
      font-size: $font-size-xlarge;
    }
  }

  @media (min-width: $xl) {
    &__lista {
      max-width: 1400px;
    }

    &__titulo {
      font-size: 36px;
    }

    &__contador {
      font-size: $font-size-base;
    }
  }
}

// Animaciones
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.comentarios__item {
  animation: slideInLeft 0.3s ease forwards;
}

.comentarios__boton-accion--like.activo {
  color: green;
}

.comentarios__boton-accion--dislike.activo {
  color: red;
}
</style>