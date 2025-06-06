<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRolesStore } from '@/stores/roles'
import PerfilAnimado from './PerfilAnimado.vue'
import LogoCanvasAnimation from './LogoCanvasAnimation.vue'

const userStore = useUsersStore()
const rolesStore = useRolesStore()
const menuOpen = ref(false)
const isScrolled = ref(false)

const isLoggedIn = computed(() => !!userStore.currentUser)
const username = computed(() => userStore.currentUser?.username || 'Iniciar Sesión')

// Roles permitidos para mostrar el enlace
const puedeVerNoticiasAfiliado = computed(() => {
  const rolesUsuario = userStore.currentUser?.roles.map((r) => r.id) || []
  return (
    rolesUsuario.includes(rolesStore.ADMIN) || rolesUsuario.includes(rolesStore.USUARIO_AFILIADO)
  )
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function handleScroll() {
  isScrolled.value = window.scrollY > 10

  const headerElement = document.querySelector('.header') as HTMLElement
  const mainElement = document.querySelector('main') as HTMLElement
  if (headerElement && mainElement) {
    const headerHeight = headerElement.offsetHeight
    mainElement.style.paddingTop = `${headerHeight}px`
  }
}

function getImageSrc(pic: string | File | null | undefined): string {
  if (!pic) return 'https://via.placeholder.com/40'
  if (typeof pic === 'string') return pic
  if (pic instanceof File) return URL.createObjectURL(pic)
  return 'https://via.placeholder.com/40'
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }">
    <link
      href="https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="https://unpkg.com/boxicons@latest/css/boxicons.min.css" />

    <a href="/" class="header__logo">
      <LogoCanvasAnimation :canvasSize="120" />
    </a>

    <nav class="header__nav">
      <ul class="header__navbar" :class="{ 'header__navbar--open': menuOpen }">
        <li>
          <router-link to="/" class="header__nav-item" @click="closeMenu">Inicio</router-link>
        </li>
        <li>
          <router-link to="/catalog" class="header__nav-item" @click="closeMenu"
            >Catálogo</router-link
          >
        </li>
        <li>
          <router-link to="/ideas" class="header__nav-item" @click="closeMenu"
            >WannaShare</router-link
          >
        </li>
        <li>
          <router-link to="/novedades" class="header__nav-item" @click="closeMenu"
            >Novedades</router-link
          >
        </li>
        <li v-if="puedeVerNoticiasAfiliado">
          <router-link to="/noticiasafiliado" class="header__nav-item" @click="closeMenu"
            >Noticias Afiliado</router-link
          >
        </li>
      </ul>
    </nav>

    <section class="header__main">
      <router-link :to="isLoggedIn ? '/dashboard' : '/login'" class="header__user-link">
        <div class="header__user-img">
          <img
            v-if="isLoggedIn && userStore.currentUser?.profilePic"
            :src="getImageSrc(userStore.currentUser.profilePic)"
            alt="Foto de perfil"
            class="header__user-img__foto"
          />
          <PerfilAnimado v-else width="40" height="40" />
        </div>
        <span class="header__user">
          {{ isLoggedIn ? username : 'Cuenta' }}
        </span>
      </router-link>

      <button class="header__menu-icon" @click="toggleMenu" aria-label="Toggle menu">
        <i :class="menuOpen ? 'ri-close-line' : 'ri-menu-line'"></i>
      </button>
    </section>

    <!-- Overlay para cerrar el menú en móvil -->
    <div v-if="menuOpen" class="header__overlay" @click="closeMenu"></div>
  </header>
</template>

<style scoped lang="scss">
:root {
  --bg-color: #272727;
  --bg-color-scrolled: rgba(39, 39, 39, 0.95);
  --main-color: linear-gradient(90deg, #f25421, #ff8c00, #ffd700);
  --text-color: #ffffff;
  --accent-color: #ffd700;
  --border-color: #ff8c00;
  --header-height: 80px;
}

.header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  padding: 1rem 5%;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  padding-top: var(--header-height);

  &--scrolled {
    background: var(--bg-color-scrolled);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(20px);
  }

  &__logo {
    display: flex;
    align-items: center;
    z-index: 1002;
  }

  &__nav {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  &__navbar {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    align-items: center;
  }

  &__nav-item {
    color: var(--text-color);
    font-size: 1.2rem;
    font-weight: 500;
    padding: 8px 20px;
    margin: 0 5px;
    transition: all 0.3s ease;
    position: relative;
    text-decoration: none;
    border-radius: 8px;

    &:hover {
      color: var(--accent-color);
      background: rgba(255, 215, 0, 0.1);
      transform: translateY(-2px);

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
      bottom: 0;
      transition: 0.3s ease;
      transform: translateX(-50%);
    }

    &.router-link-active {
      color: var(--accent-color);
      background: rgba(255, 215, 0, 0.15);

      &::after {
        width: 100%;
      }
    }
  }

  &__main {
    display: flex;
    align-items: center;
    z-index: 1002;
  }

  &__user-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 25px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: var(--text-color);

    &:hover {
      background: rgba(255, 215, 0, 0.2);
      transform: translateY(-2px);

      .header__user {
        color: var(--accent-color);
      }
    }

    &:visited {
      color: var(--text-color);
    }

    &:focus {
      color: var(--text-color);
      outline: 2px solid var(--accent-color);
      outline-offset: 2px;
    }
  }

  &__user {
    margin-left: 12px;
    font-size: 1.1rem;
    color: var(--text-color);
    font-weight: 500;
    transition: all 0.3s ease;
  }

  &__user-img {
    display: flex;
    align-items: center;

    &__foto {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--border-color);
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--accent-color);
        box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
      }
    }
  }

  &__menu-icon {
    font-size: 28px;
    color: var(--text-color);
    cursor: pointer;
    z-index: 1003;
    display: none;
    background: none;
    border: none;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      color: var(--accent-color);
      background: rgba(255, 215, 0, 0.1);
    }

    &:focus {
      outline: 2px solid var(--accent-color);
      outline-offset: 2px;
    }
  }

  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: none;
  }

  // Responsive
  @media (max-width: 768px) {
    padding: 1rem 4%;

    &__navbar {
      position: fixed;
      top: 0;
      right: -100%;
      width: 320px;
      height: 100vh;
      background: linear-gradient(135deg, var(--bg-color) 0%, rgba(39, 39, 39, 0.98) 100%);
      backdrop-filter: blur(20px);
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1001;
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
      border-left: 1px solid rgba(255, 140, 0, 0.3);

      &--open {
        right: 0;
      }

      li {
        width: 100%;
        margin: 1rem 0;
        display: flex;
        justify-content: center;
      }
    }

    &__nav-item {
      display: block;
      margin: 0;
      padding: 1.2rem 2rem;
      border-radius: 15px;
      font-size: 1.3rem;
      font-weight: 600;
      text-align: center;
      width: 100%;
      max-width: 250px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 140, 0, 0.2);
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
        background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
        transition: left 0.5s ease;
      }

      &:hover {
        background: rgba(255, 215, 0, 0.15);
        border-color: var(--accent-color);
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);

        &::before {
          left: 100%;
        }

        &::after {
          width: 0;
        }
      }

      &.router-link-active {
        background: rgba(255, 215, 0, 0.2);
        border-color: var(--accent-color);
        color: var(--accent-color);
        box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);

        &::after {
          width: 0;
        }
      }
    }

    &__menu-icon {
      display: block;
    }

    &__overlay {
      display: block;
    }

    &__user-link {
      margin-right: 1rem;
    }

    &__user {
      display: none;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem 3%;

    &__logo {
      :deep(canvas) {
        width: 80px !important;
        height: 80px !important;
      }
    }

    &__navbar {
      width: 100vw;
      right: -100%;
      padding: 2rem 1.5rem;

      &--open {
        right: 0;
      }

      li {
        margin: 0.8rem 0;
      }
    }

    &__nav-item {
      font-size: 1.2rem;
      padding: 1rem 1.5rem;
      max-width: none;
    }
  }

  @media (min-width: 769px) {
    &__navbar {
      display: flex;
    }

    &__menu-icon {
      display: none;
    }

    &__overlay {
      display: none;
    }
  }
}
</style>