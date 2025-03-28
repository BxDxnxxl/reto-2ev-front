<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCommentsStore } from '@/stores/Comentarios';
import { useUsersStore } from '@/stores/users';
import { useRolesStore } from '@/stores/roles';
import type { ComentarioDto } from '@/stores/dtos/Comentario.dto';

const props = defineProps({
  gameId: {
    type: Number,
    default: null,
  },
})

const commentsStore = useCommentsStore()
const usersStore = useUsersStore()
const rolesStore = useRolesStore()

const puedenEliminar = ref<{ [key: number]: boolean }>({});

const verificarPermisoEliminar = async (comentarioId: number): Promise<boolean> => {
  const comentario = await commentsStore.fetchComentarioById(comentarioId);
  if (!comentario) return false;

  return (
    comentario.fkIdUsuario === usersStore.currentUser?.id ||
    (usersStore.currentUser?.roles?.some(role => role.id === rolesStore.ADMIN) ?? false)
  );
};

onMounted(async () => {
  if (props.gameId) {
    await commentsStore.fetchComentariosByVideojuegos(props.gameId);
    
    for (const comentario of commentsStore.comentariosByVideojuego) {
      puedenEliminar.value[comentario.id] = await verificarPermisoEliminar(comentario.id);
    }
  }
});

const eliminarComentario = async (comentarioId: number) => {
  await commentsStore.deleteComentario(comentarioId, props.gameId);
};

const formatearFechaEspañola = (fecha: string | number | Date) => {
  // Si es un año, lo devolvemos como string
  if (typeof fecha === 'number') {
    return fecha.toString()
  }

  // Si es fecha completa, la formateamos como DD/MM/AAAA
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

        <div class="comentarios__valoracion">Valoración: {{ comentario.valoracion }}</div>

        <div class="comentarios__acciones">
          <div class="comentarios__like">
            <v-btn icon variant="text" size="small" @click="commentsStore.likeComentario(comentario.id, props.gameId)">
              <v-icon>mdi-thumb-up</v-icon>
            </v-btn>
            <span class="comentarios__contador">{{ comentario.likes }}</span>
          </div>

          <div class="comentarios__dislike">
            <v-btn icon variant="text" size="small" @click="commentsStore.dislikeComentario(comentario.id, props.gameId)">
              <v-icon>mdi-thumb-down</v-icon>
            </v-btn>
            <span class="comentarios__contador">{{ comentario.dislikes }}</span>
          </div>

          <v-btn 
            v-if="puedenEliminar[comentario.id]" 
            icon 
            color="error" 
            variant="text" 
            size="small" 
            @click="eliminarComentario(comentario.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>

      <div v-if="!commentsStore.comentariosByVideojuego.length" class="comentarios__vacio">
        <p>No hay comentarios disponibles para este videojuego</p>
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
  padding-bottom: 32px;

  &__titulo {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  &__lista {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  &__item {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &__cabecera {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__nombre {
    font-weight: bold;
    font-size: 1rem;
    margin: 0;
  }

  &__fecha {
    font-size: 0.85rem;
    color: #666;
    margin-top: 4px;

    @media (min-width: 768px) {
      margin-top: 0;
    }
  }

  &__titulo-texto {
    font-size: 1.1rem;
    margin: 8px 0;
    font-weight: 600;
  }

  &__texto {
    margin-bottom: 12px;
    line-height: 1.5;
  }

  &__valoracion {
    margin-bottom: 12px;
  }

  &__acciones {
    display: flex;
    gap: 16px;
  }

  &__like,
  &__dislike {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__contador {
    font-size: 0.9rem;
  }

  &__vacio {
    text-align: center;
    padding: 24px;
    color: #666;
  }

  @media (min-width: 768px) {
    &__lista {
      max-width: 1200px;
    }

    &__item {
      padding: 24px;
    }

    &__acciones {
      justify-content: flex-end;
    }
  }

  @media (min-width: 1200px) {
    &__lista {
      max-width: 1200px;
    }
  }

  @media (min-width: 1440px) {
    &__lista {
      max-width: 1400px;
    }

    &__item {
      padding: 28px;
    }

    &__titulo {
      font-size: 1.75rem;
    }

    &__texto {
      font-size: 1.1rem;
    }

    &__titulo-texto {
      font-size: 1.25rem;
    }

    &__contador {
      font-size: 1rem;
    }
  }
}
</style>