<script>
import { useUsersStore } from '@/stores/users';
import { computed } from 'vue';
import PerfilAnimado from './PerfilAnimado.vue'
import LogoCanvasAnimation from './LogoCanvasAnimation.vue'

export default {
  components: {
    PerfilAnimado,
    LogoCanvasAnimation,
  },
  setup() {
    const userStore = useUsersStore();
    
    const isLoggedIn = computed(() => !!userStore.currentUser);
    const username = computed(() => userStore.currentUser?.username || 'Iniciar Sesión');

    return {
      userStore,
      isLoggedIn,
      username
    }
  },
  data() {
    return {
      menuOpen: false,
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },
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

    <ul class="header__navbar" :class="{ open: menuOpen }">
      <li>
        <router-link to="/" class="header__nav-item header__nav-item--active">Inicio</router-link>
      </li>
      <li>
        <router-link to="/catalog" class="header__nav-item header__nav-item--active">
          Catálogo
        </router-link>
      </li>
    </ul>

    <section class="header__main">
      <PerfilAnimado width="40" height="40" class="header__user-img" />
      
      <router-link :to="isLoggedIn ? '/dashboard' : '/login'">
        <a href="/" class="header__user">
          {{ isLoggedIn ? username : 'Cuenta' }}
        </a>
      </router-link>

      <div class="header__menu-icon" @click="toggleMenu">
        <i class="ri-menu-line"></i>
      </div>
    </section>
  </header>
</template>

<style>
:root {
  --bg-color: #272727;
  --main-color: linear-gradient(90deg, #f25421, #ff8c00, #ffd700);
  --text-color: #ffffff;
}

.header {
  position:sticky;
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
}

.header__logo {
  display: flex;
  align-items: center;
}

.header__navbar {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.header__nav-item {
  color: var(--text-color);
  font-size: 1.2rem;
  font-weight: 500;
  padding: 5px 15px;
  margin: 0 15px;
  transition: all 0.4s ease;
  position: relative;
}

.header__nav-item:hover {
  color: #ffd700;
  font-weight: bold;
}

.header__nav-item::after {
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

.header__nav-item:hover::after {
  width: 100%;
}

.header__main {
  display: flex;
  align-items: center;
}

.header__user {
  margin-left: 20px;
  margin-right: 20px;
  font-size: 1.2rem;
  color: var(--text-color);
  font-weight: 500;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
}

.header__user-img {
  margin-right: 8px;
}

.header__user i {
  color: #ff8c00;
  font-size: 28px;
  margin-right: 7px;
}

.header__main a:hover {
  color: #ffd700;
  font-weight: bold;
}

.header__menu-icon {
  font-size: 35px;
  color: var(--text-color);
  cursor: pointer;
  z-index: 10001;
  display: none;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem 2%;
    font-size: 1.1rem;
  }


  .header__navbar {
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

  .header__nav-item {
    margin: 12px 0;
    padding: 0px 25px;
    color: var(--text-color);
  }

  .header__nav-item:hover {
    color: #ffd700;
    transform: translateY(5px);
  }

  .header__navbar.open {
    right: 0;
    display: flex;
  }


  .header__menu-icon {
    display: block;
  }

  .header__main {
    justify-content: space-between;
    width: 100%;
  }

  .header__user {
    font-size: 1.1rem;
    margin-left: 0;
  }
}

@media (min-width: 769px) {
  .header__navbar {
    display: flex;
  }

  .header__menu-icon {
    display: none;
  }
}
</style>