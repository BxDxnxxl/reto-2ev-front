<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useRolesStore } from '@/stores/roles';
import PerfilAnimado from './PerfilAnimado.vue';
import LogoCanvasAnimation from './LogoCanvasAnimation.vue';

const userStore = useUsersStore();
const rolesStore = useRolesStore();
const menuOpen = ref(false);

const isLoggedIn = computed(() => !!userStore.currentUser);
const username = computed(() => userStore.currentUser?.username || 'Iniciar Sesión');

// Roles permitidos para mostrar el enlace
const puedeVerNoticiasAfiliado = computed(() => {
  const rolesUsuario = userStore.currentUser?.roles.map(r => r.id) || [];
  return rolesUsuario.includes(rolesStore.ADMIN) || rolesUsuario.includes(rolesStore.USUARIO_AFILIADO);
});

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function getImageSrc(pic: string | File | null | undefined): string {
  if (!pic) return 'https://via.placeholder.com/40';
  if (typeof pic === 'string') return pic;
  if (pic instanceof File) return URL.createObjectURL(pic);
  return 'https://via.placeholder.com/40';
}
</script>

<template>
  <header class="header">
    <link
      href="https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="https://unpkg.com/boxicons@latest/css/boxicons.min.css" />

    <a href="/" class="header__logo">
      <LogoCanvasAnimation :canvasSize="120" />
    </a>

    <ul class="header__navbar" :class="{ 'header__navbar--open': menuOpen }">
      <li><router-link to="/" class="header__nav-item">Inicio</router-link></li>
      <li><router-link to="/catalog" class="header__nav-item">Catálogo</router-link></li>
      <li><router-link to="/ideas" class="header__nav-item">WannaShare</router-link></li>
      <li><router-link to="/novedades" class="header__nav-item">Novedades</router-link></li>
      <li v-if="puedeVerNoticiasAfiliado">
        <router-link to="/noticiasafiliado" class="header__nav-item">Noticias Afiliado</router-link>
      </li>
    </ul>

    <section class="header__main">
      <router-link :to="isLoggedIn ? '/dashboard' : '/login'" class="header__user-img">
        <img
          v-if="isLoggedIn && userStore.currentUser?.profilePic"
          :src="getImageSrc(userStore.currentUser.profilePic)"
          alt="Foto de perfil"
          class="header__user-img__foto"
        />
        <PerfilAnimado v-else width="40" height="40" />
      </router-link>

      <router-link :to="isLoggedIn ? '/dashboard' : '/login'" class="header__user">
        {{ isLoggedIn ? username : 'Cuenta' }}
      </router-link>

      <div class="header__menu-icon" @click="toggleMenu">
        <i class="ri-menu-line"></i>
      </div>
    </section>
  </header>
</template>

 <style scoped lang="scss">
:root {
  --bg-color: #272727;
  --main-color: linear-gradient(90deg, #f25421, #ff8c00, #ffd700);
  --text-color: #ffffff;
}

.header {
  position: sticky;
  width: 100%;
  top: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-color);
  padding: 1rem 5%;
  font-size: 1.3rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;

  &__logo {
    display: flex;
    align-items: center;
  }

  &__navbar {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

    &--open {
      right: 0;
      display: flex;
    }
  }

  &__nav-item {
    color: var(--text-color);
    font-size: 1.2rem;
    font-weight: 500;
    padding: 5px 15px;
    margin: 0 15px;
    transition: all 0.4s ease;
    position: relative;

    &:hover {
      color: #ffd700;
      font-weight: bold;

      &::after {
        width: 100%;
      }
    }

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      background: var(--main-color);
      left: 50%;
      bottom: -5px;
      transition: 0.4s ease;
      transform: translateX(-50%);
    }
  }

  &__main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    @media (min-width: 769px) {
      width: auto;
    }
  }

  &__user {
    margin: 0 20px;
    font-size: 1.2rem;
    color: var(--text-color);
    font-weight: 500;
    transition: all 0.4s ease;
    display: flex;
    align-items: center;

    &:hover {
      color: #ffd700;
      font-weight: bold;
    }
  }

  &__user-img {
    margin-right: 8px;

    &__foto {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #ff8c00;
    }
  }

  &__menu-icon {
    font-size: 35px;
    color: var(--text-color);
    cursor: pointer;
    z-index: 10001;
    display: none;

    @media (max-width: 768px) {
      display: block;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem 2%;
    font-size: 1.1rem;

    &__navbar {
      display: none;
      position: absolute;
      top: 100%;
      right: -100%;
      width: 100%;
      height: 30vh;
      background: var(--bg-color);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      transition: all 0.5s ease;
      margin: 0;
    }

    &__nav-item {
      margin: 12px 0;
      padding: 0 25px;
      color: var(--text-color);

      &:hover {
        transform: translateY(5px);
      }
    }

    &__user {
      font-size: 1.1rem;
      margin-left: 0;
    }
  }

  @media (min-width: 769px) {
    &__navbar {
      display: flex;
    }

    &__menu-icon {
      display: none;
    }
  }
}
</style>