<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useRoute, useRouter } from 'vue-router'
import FormularioUsuario from '@/components/FormularioUsuario.vue'
import { useUsersStore } from '@/stores/users'
import { computed, onMounted } from 'vue'

const route = useRoute();
const router = useRouter();
const userStore = useUsersStore();

const isLoggedIn = computed(() => !!userStore.currentUser);

const isAdmin = computed(() => 
  userStore.currentUser?.roles?.some(role => role.id === 2) || false
);

onMounted(() => {
  if (!isLoggedIn.value || !isAdmin.value) {
    router.push('/'); 
  }
});

const editMode = route.query.edit === 'true' ? true : false;
const userId = route.query.id ? Number(route.query.id) : null;
</script>

<template>
  <Header />

  <div class="gestion-usuario">
    <div v-if="!isAdmin" class="error-message">
      <p>No tienes permisos para acceder a esta página.</p>
    </div>

    <template v-else>
      <h2>{{ editMode ? 'Editar Usuario' : 'Añadir Usuario' }}</h2>
      <FormularioUsuario :editMode="editMode" :userId="userId" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.gestion-usuario {
  padding: 20px;
  
  h2 {
    margin-bottom: 20px;
  }
}

.error-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  width: 100%;
  font-size: 1.2rem;
  color: #dc3545;
  text-align: center;
  padding: 1rem;
}
</style>
