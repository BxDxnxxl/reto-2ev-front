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
.solicitudes {
  padding: 1rem;

  &__titulo {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  &__vacio {
    text-align: center;
    color: #64748b;
    font-size: 1rem;
    padding: 2rem;
  }

  &__lista {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__card {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  &__usuario-nombre {
    font-weight: bold;
  }

  &__usuario-email {
    font-size: 0.9rem;
    color: #64748b;
  }

  &__fecha {
    font-size: 0.85rem;
    color: #94a3b8;
  }

  &__boton {
    background-color: #1e40af;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    cursor: pointer;

    &:hover {
      background-color: #1e3a8a;
    }
  }
}
</style>
