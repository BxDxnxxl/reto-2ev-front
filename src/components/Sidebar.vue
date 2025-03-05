<script setup>
import { useUsersStore } from '@/stores/users';
import { useRouter } from 'vue-router';

const userStore = useUsersStore();
const router = useRouter();

const logout = () => {
  userStore.logout();
  router.push('/');
};
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__profile">
      <img src="https://via.placeholder.com/80" alt="Perfil" class="sidebar__profile-img" />
    </div>
    <nav class="sidebar__nav">
      <router-link
        to="/usuarios"
        :class="{ 'sidebar__link--active': $route.path === '/usuarios' }"
        class="sidebar__link"
      >
        Usuarios
      </router-link>
      <hr />
      <router-link
        to="/catalog"
        :class="{ 'sidebar__link--active': $route.path === '/catalogo' }"
        class="sidebar__link"
      >
        Catálogo
      </router-link>
    </nav>
    <router-link 
      to="/" 
      class="sidebar__logout" 
      @click="logout"
    >
      Cerrar Sesión
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  width: 100%;
  background: #272727;
  color: white;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;

  @media (min-width: 768px) {
    width: 250px;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
  }

  &__profile-img {
    border-radius: 50%;
    margin-bottom: 20px;
  }

  &__nav {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: auto;
  }

  &__link {
    padding: 10px;
    color: white;
    text-decoration: none;
    text-align: center;
    transition: background 0.3s;

    &--active {
      background: #7f8c8d;
    }
  }

  &__logout {
    background: #f25421;
    border: none;
    padding: 10px;
    color: white;
    width: 100%;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition: background 0.3s;
    display: block;

    &:hover {
      background: #d64321;
    }
  }
}
</style>
