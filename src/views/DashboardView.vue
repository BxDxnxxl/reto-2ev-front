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
    <!-- Fondo animado con gradiente -->
    <div class="dashboard__background"></div>
    
    <div v-if="!isLoggedIn" class="dashboard__login">
      <div class="dashboard__login-card">
        <div class="dashboard__login-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V8.5L21 9ZM3 9L9 8.5V6.5L3 7V9ZM10.5 12H13.5L12 10.5L10.5 12ZM12 13C10.9 13 10 12.1 10 11C10 9.9 10.9 9 12 9C13.1 9 14 9.9 14 11C14 12.1 13.1 13 12 13Z" fill="currentColor"/>
          </svg>
        </div>
        <h2 class="dashboard__login-title">Acceso Requerido</h2>
        <p class="dashboard__login-message">Necesitas estar logeado para acceder al dashboard</p>
        <v-btn color="primary" class="dashboard__login-button" @click="$router.push('/login')">
          Logéate aquí
        </v-btn>
      </div>
    </div>

    <template v-else>
      <div class="dashboard__container">
        <Sidebar @change-view="changeView" />
        
        <div class="dashboard__content">
          <div class="dashboard__content-header">
            <div class="dashboard__breadcrumb">
              <span class="dashboard__breadcrumb-item">Dashboard</span>
              <span class="dashboard__breadcrumb-separator">></span>
              <span class="dashboard__breadcrumb-current">{{ currentView }}</span>
            </div>
          </div>

          <div class="dashboard__panel-container">
            <div v-if="currentView === 'dashboard'" class="dashboard__panel dashboard__panel--animate">
              <DashboardMain />
            </div>

            <div v-else-if="currentView === 'usuarios'" class="dashboard__panel dashboard__panel--animate">
              <ListaUsuarios />
            </div>

            <div v-else-if="currentView === 'videojuegos'" class="dashboard__panel dashboard__panel--animate">
              <ListaVideojuegos />
            </div>

            <div v-else-if="currentView === 'solicitudes'" class="dashboard__panel dashboard__panel--animate">
              <SolicitudesRecibidas />
            </div>

            <div v-else-if="currentView === 'empresas'" class="dashboard__panel dashboard__panel--animate">
              <Empresas />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.dashboard {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;

  &__background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(242, 84, 33, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      $background-color;
    z-index: -1;
    animation: backgroundPulse 8s ease-in-out infinite alternate;
  }

  &__login {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: $spacing-large;
    position: relative;
    z-index: 1;
  }

  &__login-card {
    background: rgba(30, 30, 30, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(242, 84, 33, 0.2);
    border-radius: 24px;
    padding: $spacing-xxl;
    text-align: center;
    max-width: 400px;
    width: 100%;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    animation: loginCardFloat 6s ease-in-out infinite alternate;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 
        0 30px 60px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(242, 84, 33, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
  }

  &__login-icon {
    width: 80px;
    height: 80px;
    background: $primary-gradient;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto $spacing-large;
    color: white;
    box-shadow: 0 10px 30px rgba(242, 84, 33, 0.3);
    animation: iconPulse 2s ease-in-out infinite;
  }

  &__login-title {
    font-size: $font-size-xlarge;
    font-weight: 700;
    color: $text-color;
    margin-bottom: $spacing-medium;
    background: $primary-gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__login-message {
    font-size: $font-size-base;
    color: rgba($text-color, 0.8);
    margin-bottom: $spacing-xl;
    line-height: 1.6;
  }

  &__login-button {
    background: $primary-gradient !important;
    border-radius: 50px;
    padding: $spacing-medium $spacing-xl;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.5px;
    box-shadow: 0 8px 24px rgba(242, 84, 33, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(242, 84, 33, 0.4);

      &::before {
        left: 100%;
      }
    }
  }

  &__container {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    position: relative;
    z-index: 1;
    
    @media (min-width: $desktop) {
      flex-direction: row;
    }
  }

  &__content {
    flex-grow: 1;
    width: 100%;
    padding: $spacing-large;
    transition: all 0.3s ease;
    
    @media (min-width: $desktop) {
      padding: $spacing-xl;
      margin-left: 280px;
    }
  }

  &__content-header {
    margin-bottom: $spacing-large;
  }

  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: $spacing-small;
    font-size: $font-size-small;
    color: rgba($text-color, 0.6);
  }

  &__breadcrumb-item {
    color: rgba($text-color, 0.6);
  }

  &__breadcrumb-separator {
    color: rgba($text-color, 0.4);
  }

  &__breadcrumb-current {
    color: $primary-color;
    font-weight: 600;
  }

  &__panel-container {
    position: relative;
  }

  &__panel {
    background: rgba(30, 30, 30, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: $spacing-xl;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: $primary-gradient;
    }

    &--animate {
      animation: panelSlideIn 0.5s ease-out;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 25px 50px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
  }
}

@keyframes backgroundPulse {
  0% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

@keyframes loginCardFloat {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-10px);
  }
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes panelSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>