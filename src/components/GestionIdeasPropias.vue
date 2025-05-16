<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUsersStore } from "@/stores/users";
import { useIdeasStore } from "@/stores/Ideas";

const usersStore = useUsersStore();
const ideasStore = useIdeasStore();
const solicitudes = ref<{ idea: any; usuario: any; aceptado: boolean }[]>([]);

onMounted(async () => {
  const idUsuario = usersStore.currentUser?.id;
  if (!idUsuario) return;
  solicitudes.value = await ideasStore.fetchSolicitudesRecibidas(idUsuario);
});

const aceptarUsuario = async (idIdea: number, idUsuario: number) => {
  await ideasStore.aceptarUsuarioApuntado(idIdea, idUsuario);
  const idCreador = usersStore.currentUser?.id;
  if (idCreador) {
    solicitudes.value = await ideasStore.fetchSolicitudesRecibidas(idCreador);
  }
};
</script>

<template>
  <div class="solicitudes">
    <h2 class="solicitudes__titulo">Solicitudes recibidas</h2>

    <div v-if="solicitudes.length === 0" class="solicitudes__vacio">
      No tienes solicitudes pendientes.
    </div>

    <div v-else class="solicitudes__lista">
      <div
        v-for="{ idea, usuario, aceptado } in solicitudes"
        :key="`${idea.id}-${usuario.id}`"
        class="solicitudes__card"
      >
        <div class="solicitudes__info">
          <div class="solicitudes__idea">
            <h3 class="solicitudes__idea-titulo">{{ idea.titulo }}</h3>
            <p class="solicitudes__idea-descripcion">{{ idea.descripcion }}</p>
          </div>
          <div class="solicitudes__usuario">
            <p class="solicitudes__usuario-nombre">
              {{ usuario.nombre }} {{ usuario.apellido1 }}
            </p>
            <p class="solicitudes__usuario-email">{{ usuario.email }}</p>
          </div>
        </div>

        <div class="solicitudes__acciones">
          <template v-if="aceptado">
            <span class="solicitudes__estado solicitudes__estado--aceptado">
              ✅ Aceptado
            </span>
          </template>
          <template v-else>
            <button
              class="solicitudes__boton"
              @click="aceptarUsuario(idea.id, usuario.id)"
            >
              Aceptar solicitud
            </button>
          </template>
        </div>
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
    color: #64748b; // gris medio
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
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0; // gris claro
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__idea-titulo {
    font-weight: bold;
    font-size: 1.1rem;
    margin: 0;
  }

  &__idea-descripcion {
    font-size: 0.95rem;
    color: #64748b;
  }

  &__usuario-nombre {
    font-weight: 600;
    font-size: 0.95rem;
  }

  &__usuario-email {
    font-size: 0.875rem;
    color: #64748b;
  }

  &__acciones {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  &__boton {
    background-color: #1e40af; // azul fuerte
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #1a3697; // azul más oscuro
    }
  }

  &__estado {
    font-weight: bold;
    font-size: 0.9rem;

    &--aceptado {
      color: #10b981; // verde éxito
    }
  }

  @media (min-width: 768px) {
    &__card {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    &__info {
      flex: 1;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
</style>