<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import DashboardMain from '@/components/DashboardMain.vue'
import ListaUsuarios from '@/components/ListaUsuarios.vue'
import { ref, computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRouter } from 'vue-router'

const userStore = useUsersStore()
const router = useRouter()
const isLoggedIn = computed(() => !!userStore.currentUser)

// Estado para manejar qué vista se muestra
const currentView = ref<'dashboard' | 'usuarios'>('dashboard')

const changeView = (view: 'dashboard' | 'usuarios') => {
  currentView.value = view
}
</script>

<template>
  <div class="dashboard">
    <div v-if="!isLoggedIn" class="dashboard__login">
      <p class="dashboard__login-message">Necesitas estar logeado para acceder</p>
      <v-btn color="primary" class="dashboard__login-button" @click="$router.push('/login')">
        Logéate aquí
      </v-btn>
    </div>

    <template v-else>
      <div class="dashboard__container">
        <Sidebar @change-view="changeView" />

        <div class="dashboard__content">
          <div v-if="currentView === 'dashboard'" class="dashboard__panel">
            <DashboardMain />
          </div>
          <div v-else class="dashboard__panel">
            <ListaUsuarios />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;

  &__login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    padding: 1rem;
  }

  &__login-message {
    font-size: 1.2rem;
    color: #666;
  }

  &__login-button {
    margin-top: 1rem;
    width: fit-content;
  }

  &__container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__content {
    flex-grow: 1;
    width: 100%;
    padding: 1rem;
    background: white;
    overflow-x: auto;
  }

  &__panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  @media (min-width: 768px) {
    &__container {
      flex-direction: row;
    }

    &__content {
      padding: 2rem;
      margin-left: 250px;
    }
  }
}
</style>
