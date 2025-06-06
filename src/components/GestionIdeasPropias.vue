<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUsersStore } from "@/stores/users";
import { useUsuariosApuntadosStore } from "@/stores/UsuarioApuntado";
import type { SolicitudRecibidaDto } from "@/stores/dtos/SolicitudRecibida.dto";

const usersStore = useUsersStore();
const usuariosApuntadosStore = useUsuariosApuntadosStore();
const solicitudes = ref<SolicitudRecibidaDto[]>([]);

onMounted(async () => {
  const idUsuario = usersStore.currentUser?.id;
  if (!idUsuario) return;

  solicitudes.value = await usuariosApuntadosStore.fetchSolicitudesRecibidas(idUsuario);
});

const aceptar = async (idIdea: number, idUsuarioAaceptar: number) => {
  await usuariosApuntadosStore.aceptarUsuarioApuntado(
    idIdea,
    idUsuarioAaceptar
  );
  const idCreador = usersStore.currentUser?.id;
  if (idCreador) {
    solicitudes.value = await usuariosApuntadosStore.fetchSolicitudesRecibidas(idCreador);
  }
};

const rechazar = async (idIdea: number, idUsuarioArechazar: number) => {
  await usuariosApuntadosStore.rechazarUsuarioApuntado(
    idIdea,
    idUsuarioArechazar
  );
  const idCreador = usersStore.currentUser?.id;
  if (idCreador) {
    solicitudes.value = await usuariosApuntadosStore.fetchSolicitudesRecibidas(idCreador);
  }
};
</script>

<template>
  <div class="solicitudes">
    <h2 class="solicitudes__titulo">Solicitudes pendientes de tus ideas</h2>

    <div v-if="solicitudes.length === 0" class="solicitudes__vacio">
      No tienes solicitudes pendientes.
    </div>

    <div v-else class="solicitudes__lista-mobile">
      <div
        v-for="s in solicitudes"
        :key="`${s.idIdea}-${s.idUsuarioSolicitante}`"
        class="solicitudes__card"
      >
        <div class="solicitudes__info">
          <p class="solicitudes__usuario-nombre">{{ s.nombre }} {{ s.apellido1 }}</p>
          <p class="solicitudes__usuario-email">{{ s.email }}</p>
          <p class="solicitudes__fecha">Solicitado el {{ new Date(s.fechaSolicitud).toLocaleDateString() }}</p>
        </div>
        <div class="solicitudes__botones">
          <button class="solicitudes__boton solicitudes__boton--aceptar" @click="aceptar(s.idIdea, s.idUsuarioSolicitante)">
            Aceptar
          </button>
          <button class="solicitudes__boton solicitudes__boton--rechazar" @click="rechazar(s.idIdea, s.idUsuarioSolicitante)">
            Rechazar
          </button>
        </div>
      </div>
    </div>

    <!-- Vista desktop (tabla) -->
    <div v-if="solicitudes.length > 0" class="solicitudes__tabla-container">
      <table class="solicitudes__tabla">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Fecha Solicitud</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="s in solicitudes"
            :key="`${s.idIdea}-${s.idUsuarioSolicitante}`"
            class="solicitudes__fila"
          >
            <td class="solicitudes__celda-usuario">
              <span class="solicitudes__usuario-nombre">{{ s.nombre }} {{ s.apellido1 }}</span>
            </td>
            <td class="solicitudes__celda-email">{{ s.email }}</td>
            <td class="solicitudes__celda-fecha">{{ new Date(s.fechaSolicitud).toLocaleDateString() }}</td>
            <td class="solicitudes__celda-accion">
              <div class="solicitudes__botones-tabla">
                <button class="solicitudes__boton-tabla solicitudes__boton-tabla--aceptar" @click="aceptar(s.idIdea, s.idUsuarioSolicitante)">
                  Aceptar
                </button>
                <button class="solicitudes__boton-tabla solicitudes__boton-tabla--rechazar" @click="rechazar(s.idIdea, s.idUsuarioSolicitante)">
                  Rechazar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.solicitudes {
  padding: $spacing-small;

  &__titulo {
    font-size: $font-size-large;
    font-weight: 700;
    margin-bottom: $spacing-medium;
    color: $primary-color;
    background: $primary-gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__vacio {
    text-align: center;
    color: rgba($text-color, 0.6);
    font-size: $font-size-base;
    padding: $spacing-large;
  }

  &__lista-mobile {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;

    @media (min-width: 768px) {
      display: none;
    }
  }

  &__card {
    background-color: $card-background;
    border-radius: $border-radius;
    padding: $spacing-small;
    border: 1px solid $primary-color;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: $box-shadow;
    transition: $transition;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($primary-color, 0.15);
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: $spacing-extra-small;
    color: $text-color;
    margin-bottom: $spacing-small;
  }

  &__usuario-nombre {
    font-weight: 600;
    font-size: $font-size-base;
    color: $primary-color;
  }

  &__usuario-email {
    font-size: $font-size-small;
    color: rgba($text-color, 0.7);
  }

  &__fecha {
    font-size: $font-size-small;
    color: rgba($text-color, 0.5);
  }

  &__botones {
    display: flex;
    gap: $spacing-small;
    align-self: stretch;
    flex-direction: column;

    @media (min-width: 480px) {
      flex-direction: row;
    }
  }

  &__boton {
    background-color: $btn-color;
    color: white;
    border: none;
    border-radius: $border-radius;
    padding: $spacing-small $spacing-medium;
    font-size: $font-size-small;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex: 1;

    &--aceptar {
      background-color: $btn-color;

      &:hover {
        background-color: darken($btn-color, 10%);
      }
    }

    &--rechazar {
      background-color: #dc3545;

      &:hover {
        background-color: darken(#dc3545, 10%);
      }
    }
  }

  &__tabla-container {
    display: none;
    overflow-x: auto;

    @media (min-width: 768px) {
      display: block;
    }
  }

  &__tabla {
    width: 100%;
    border-collapse: collapse;
    background-color: $card-background;
    border-radius: $border-radius;
    overflow: hidden;
    box-shadow: $box-shadow;

    thead {
      background-color: $primary-color;
      
      th {
        padding: $spacing-medium;
        text-align: left;
        font-weight: 600;
        color: white;
        font-size: $font-size-small;
        text-transform: uppercase;
        letter-spacing: 0.5px;

        &:first-child {
          border-top-left-radius: $border-radius;
        }

        &:last-child {
          border-top-right-radius: $border-radius;
        }
      }
    }

    tbody {
      tr {
        transition: $transition;

        &:hover {
          background-color: rgba($primary-color, 0.05);
        }

        &:not(:last-child) {
          border-bottom: 1px solid rgba($primary-color, 0.1);
        }
      }

      td {
        padding: $spacing-medium;
        color: $text-color;
        vertical-align: middle;
      }
    }
  }

  &__celda-usuario {
    .solicitudes__usuario-nombre {
      font-weight: 600;
      color: $primary-color;
    }
  }

  &__celda-email {
    color: rgba($text-color, 0.7);
    font-size: $font-size-small;
  }

  &__celda-fecha {
    color: rgba($text-color, 0.5);
    font-size: $font-size-small;
  }

  &__celda-accion {
    text-align: center;
  }

  &__botones-tabla {
    display: flex;
    gap: $spacing-small;
    justify-content: center;
  }

  &__boton-tabla {
    border: none;
    border-radius: $border-radius;
    padding: $spacing-small $spacing-medium;
    font-size: $font-size-small;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: white;

    &--aceptar {
      background-color: $btn-color;

      &:hover {
        background-color: darken($btn-color, 10%);
        transform: translateY(-1px);
      }
    }

    &--rechazar {
      background-color: #dc3545;

      &:hover {
        background-color: darken(#dc3545, 10%);
        transform: translateY(-1px);
      }
    }
  }
}
</style>