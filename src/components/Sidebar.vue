<script setup>
import { defineEmits, computed } from "vue";
import { useUsersStore } from "@/stores/users";
import { useRolesStore } from "@/stores/roles";
import { useRouter } from "vue-router";

const userStore = useUsersStore();
const rolesStore = useRolesStore();
const router = useRouter();

const logout = () => {
  userStore.logout();
  router.push("/");
};

const emit = defineEmits(["change-view"]);
const getUserImage = computed(() => {
  const pic = userStore.currentUser?.profilePic;
  return pic && pic.trim() !== "" ? pic : "https://via.placeholder.com/80";
});
const isAdmin = computed(() =>
  userStore.currentUser?.roles?.some((role) => role.id === rolesStore.ADMIN) || false
);
</script>
<template>
  <div class="sidebar">
    <!-- Header del sidebar con perfil -->
    <div class="sidebar__header">
      <div class="sidebar__profile">
        <div class="sidebar__profile-container">
          <img
            :src="getUserImage"
            alt="Perfil"
            class="sidebar__profile-img"
          />
          <div class="sidebar__profile-status"></div>
        </div>
        <div class="sidebar__profile-info">
          <h3 class="sidebar__profile-name">{{ userStore.currentUser.username }}</h3>
        </div>
      </div>
    </div>

    <!-- Navegación principal -->
    <nav class="sidebar__nav">
      <div class="sidebar__nav-section">
        <h4 class="sidebar__nav-title">Principal</h4>
        
        <button 
          class="sidebar__link" 
          :class="{ 'sidebar__link--active': currentView === 'dashboard' }"
          @click="emit('change-view', 'dashboard')"
        >
          <svg class="sidebar__link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="sidebar__link-text">Mi Perfil</span>
        </button>

        <button 
          class="sidebar__link"
          :class="{ 'sidebar__link--active': currentView === 'solicitudes' }"
          @click="$emit('change-view', 'solicitudes')"
        >
          <svg class="sidebar__link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="sidebar__link-text">Solicitudes</span>
        </button>
      </div>

      <!-- Sección de administración -->
      <div v-if="isAdmin" class="sidebar__nav-section">
        <h4 class="sidebar__nav-title">Administración</h4>
        
        <button 
          class="sidebar__link"
          :class="{ 'sidebar__link--active': currentView === 'usuarios' }"
          @click="emit('change-view', 'usuarios')"
        >
          <svg class="sidebar__link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="sidebar__link-text">Usuarios</span>
        </button>

        <button 
          class="sidebar__link"
          :class="{ 'sidebar__link--active': currentView === 'videojuegos' }"
          @click="emit('change-view', 'videojuegos')"
        >
          <svg class="sidebar__link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 12H8M16 12H18M12 8V10M12 14V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="sidebar__link-text">Videojuegos</span>
        </button>

        <button 
          class="sidebar__link"
          :class="{ 'sidebar__link--active': currentView === 'empresas' }"
          @click="emit('change-view', 'empresas')"
        >
          <svg class="sidebar__link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 21H21M5 21V7L13 3L21 7V21M9 9V11M15 9V11M9 14V16M15 14V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="sidebar__link-text">Empresas</span>
        </button>
      </div>

      <!-- Sección de navegación -->
      <div class="sidebar__nav-section">
        <h4 class="sidebar__nav-title">Navegación</h4>
        
        <router-link to="/" class="sidebar__link sidebar__link--external">
          <svg class="sidebar__link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M10 13L14 17L10 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 4V7C20 7.53043 19.7893 8.03914 19.4142 8.41421C19.0391 8.78929 18.5304 9 18 9H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="sidebar__link-text">Ir al Inicio</span>
        </router-link>
      </div>
    </nav>

    <!-- Footer con logout -->
    <div class="sidebar__footer">
      <button class="sidebar__logout" @click="logout">
        <svg class="sidebar__logout-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="sidebar__logout-text">Cerrar Sesión</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.sidebar {
  width: 100%;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  color: $text-color;
  height: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: $primary-gradient;
  }

  @media (min-width: $desktop) {
    width: 280px;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
  }

  &__header {
    padding: $spacing-xl $spacing-large;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
  }

  &__profile {
    display: flex;
    align-items: center;
    gap: $spacing-medium;
  }

  &__profile-container {
    position: relative;
  }

  &__profile-img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid transparent;
    background: $primary-gradient;
    padding: 2px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 24px rgba(242, 84, 33, 0.3);
    }
  }

  &__profile-status {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 16px;
    height: 16px;
    background: $color-success;
    border-radius: 50%;
    border: 2px solid $background-color;
    animation: statusPulse 2s ease-in-out infinite;
  }

  &__profile-info {
    flex: 1;
    min-width: 0;
  }

  &__profile-name {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-color;
    margin: 0 0 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__profile-role {
    font-size: $font-size-small;
    color: rgba($text-color, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  }

  &__nav {
    flex: 1;
    padding: $spacing-large;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(242, 84, 33, 0.3);
      border-radius: 2px;
    }
  }

  &__nav-section {
    margin-bottom: $spacing-xl;
  }

  &__nav-title {
    font-size: $font-size-small;
    font-weight: 600;
    color: rgba($text-color, 0.5);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 $spacing-medium 0;
    padding-left: $spacing-small;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: $spacing-medium;
    width: 100%;
    padding: $spacing-medium;
    color: rgba($text-color, 0.8);
    text-decoration: none;
    background: none;
    border: none;
    font-size: $font-size-small;
    font-weight: 500;
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.3s ease;
    margin-bottom: $spacing-small;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(242, 84, 33, 0.1), transparent);
      transition: left 0.5s;
    }

    &:hover {
      background: rgba(242, 84, 33, 0.1);
      color: $text-color;
      transform: translateX(4px);

      &::before {
        left: 100%;
      }

      .sidebar__link-icon {
        color: $primary-color;
        transform: scale(1.1);
      }
    }

    &--active {
      background: rgba(242, 84, 33, 0.15);
      color: $text-color;
      border-left: 3px solid $primary-color;

      .sidebar__link-icon {
        color: $primary-color;
      }
    }

    &--external {
      color: rgba($text-color, 0.6);
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }

  &__link-icon {
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  &__link-text {
    flex: 1;
    text-align: left;
  }

  &__link-badge {
    background: $primary-color;
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
    animation: badgePulse 2s ease-in-out infinite;
  }

  &__footer {
    padding: $spacing-large;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
  }

  &__logout {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-small;
    width: 100%;
    padding: $spacing-medium;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #ef4444;
    cursor: pointer;
    border-radius: 12px;
    font-size: $font-size-small;
    font-weight: 500;
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
      background: rgba(239, 68, 68, 0.1);
      transition: left 0.5s;
    }

    &:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);

      &::before {
        left: 100%;
      }

      .sidebar__logout-icon {
        transform: scale(1.1);
      }
    }
  }

  &__logout-icon {
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  &__logout-text {
    font-weight: 600;
  }
}

@keyframes statusPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>