<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import DashboardMain from '@/components/DashboardMain.vue'
import ListaUsuarios from '@/components/ListaUsuarios.vue'
import ListaVideojuegos from '@/components/VerVideojuegos.vue'
import SolicitudesRecibidas from '@/components/GestionIdeasPropias.vue'
import Empresas from '@/components/VerEmpresas.vue'
import { ref, computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRouter } from 'vue-router'

const userStore = useUsersStore()
const router = useRouter()
const isLoggedIn = computed(() => !!userStore.currentUser)
console.log(isLoggedIn);

// Añadimos 'solicitudes' como opción válida
const currentView = ref<'dashboard' | 'usuarios' | 'solicitudes' | 'empresas' | 'videojuegos'>('dashboard')

const changeView = (view: 'dashboard' | 'usuarios' | 'solicitudes' | 'empresas'| 'videojuegos') => {
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

          <div v-else-if="currentView === 'usuarios'" class="dashboard__panel">
            <ListaUsuarios />
          </div>

          <div v-else-if="currentView === 'videojuegos'" class="dashboard__panel">
            <ListaVideojuegos />
          </div>

          <div v-else-if="currentView === 'solicitudes'" class="dashboard__panel">
            <SolicitudesRecibidas />
          </div>

          <div v-else-if="currentView === 'empresas'" class="dashboard__panel">
            <Empresas />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: $background-color;
  color: $text-color;

  &__login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    padding: $spacing-large;
    background-color: $card-background;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    margin: auto;
  }

  &__login-message {
    font-size: $font-size-large;
    color: $text-color;
    margin-bottom: $spacing-medium;
  }

  &__login-button {
    margin-top: $spacing-medium;
    width: fit-content;
    background-color: $btn-color;
    color: white;
    border-radius: $border-radius;
    padding: $spacing-small $spacing-large;
    font-size: $font-size-base;
    font-weight: bold;
    transition: $transition;
    cursor: pointer;

    &:hover {
      background-color: darken($btn-color, 10%);
    }
  }

  &__container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__content {
    flex-grow: 1;
    width: 100%;
    padding: $spacing-large;
    background: $card-background;
    overflow-x: auto;
    color: $text-color;
  }

  &__panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: $spacing-large;
    background-color: $card-background;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
  }

  @media (min-width: $desktop) {
    &__container {
      flex-direction: row;
    }

    &__content {
      padding: $spacing-xl;
      margin-left: 250px;
    }
  }
}
</style>
