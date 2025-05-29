<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useUsersStore } from '@/stores/users';
import { usePublicacionesEmpresasStore } from '@/stores/publicacionesEmpresasStore';
import { useRolesStore } from '@/stores/roles';
import VerNoticiasEmpresaAfiliada from '@/components/VerNoticiasEmpresaAfiliada.vue';
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

const usersStore = useUsersStore();
const publicacionesStore = usePublicacionesEmpresasStore();
const rolesStore = useRolesStore();
const router = useRouter();

const isAuthorized = computed(() => {
  const rolesUsuario = usersStore.currentUser?.roles.map(r => r.id) || [];
  return rolesUsuario.includes(rolesStore.ADMIN) || rolesUsuario.includes(rolesStore.USUARIO_AFILIADO);
});

onMounted(async () => {
  if (!isAuthorized.value) {
    router.push('/'); // redirige al inicio si no está autorizado
    return;
  }

  if (usersStore.currentUser?.id) {
    await publicacionesStore.fetchNoticiasEmpresaAfiliada(usersStore.currentUser.id);
  }
});
</script>

<template>
  <Header />
  <section v-if="isAuthorized" class="vista-afiliado">
    <VerNoticiasEmpresaAfiliada />
  </section>
  <section v-else class="vista-afiliado">
    <p class="vista-afiliado__denegado">No tienes permisos para acceder a esta sección.</p>
  </section>
</template>

<style scoped lang="scss">
.vista-afiliado {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;

  &__titulo {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  &__denegado {
    text-align: center;
    margin-top: 4rem;
    font-size: 1.2rem;
    color: #b00020;
  }
}
</style>
