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
</script>

<template>
  <div class="solicitudes">
    <h2 class="solicitudes__titulo">Solicitudes pendientes de tus ideas</h2>

    <div v-if="solicitudes.length === 0" class="solicitudes__vacio">
      No tienes solicitudes pendientes.
    </div>

    <div v-else class="solicitudes__lista">
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
        <button class="solicitudes__boton" @click="aceptar(s.idIdea, s.idUsuarioSolicitante)">
          Aceptar
        </button>
      </div>
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

  &__lista {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
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

    @media (min-width: 600px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-medium;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: $spacing-extra-small;
    color: $text-color;
    margin-bottom: $spacing-small;

    @media (min-width: 600px) {
      margin-bottom: 0;
    }
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
    align-self: stretch; 

    &:hover {
      background-color: darken($btn-color, 10%);
    }

    @media (min-width: 600px) {
      align-self: auto;
      padding: $spacing-small $spacing-large;
      width: auto;
    }
  }
}
</style>
