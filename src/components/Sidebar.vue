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

const isAdmin = computed(() =>
  userStore.currentUser?.roles?.some((role) => role.id === rolesStore.ADMIN) || false
);
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__profile">
      <img src="https://via.placeholder.com/80" alt="Perfil" class="sidebar__profile-img" />
    </div>
    <nav class="sidebar__nav">
      <button v-if="isAdmin" class="sidebar__link" @click="emit('change-view', 'usuarios')">
        Usuarios
      </button>
      <button v-if="isAdmin" class="sidebar__link" @click="emit('change-view', 'videojuegos')">
        Videojuegos
      </button>
      <hr />
      <button class="sidebar__link" @click="emit('change-view', 'dashboard')">
        Mi Perfil
      </button>
      <button class="sidebar__link" @click="$emit('change-view', 'solicitudes')">
  📩    Solicitudes
      </button>
      <button v-if="isAdmin" class="sidebar__link" @click="emit('change-view', 'empresas')">
        Empresas
      </button>
      <button class="sidebar__link">
        <router-link to="/" class="sidebar__link">
          Inicio
        </router-link>
      </button>

    </nav>
    <button class="sidebar__logout" @click="logout">
      Cerrar Sesión
    </button>
  </div>
</template>
<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.sidebar {
  width: 100%;
  background: $background-color;
  color: $text-color;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-large;
  position: relative;

  @media (min-width: $desktop) {
    width: 250px;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
  }

  &__profile-img {
    border-radius: 50%;
    margin-bottom: $spacing-medium;
    width: 80px;
    height: 80px;
    object-fit: cover;
    border: 2px solid $primary-color;
  }

  &__nav {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: auto;
  }

  &__link {
    padding: $spacing-small;
    color: $text-color;
    text-decoration: none;
    text-align: center;
    background: none;
    border: none;
    font-size: $font-size-base;
    cursor: pointer;
    transition: background 0.3s;
    border-radius: $border-radius;

    &:hover {
      background: lighten($background-color, 10%);
    }
  }

  &__logout {
    background: $primary-color;
    border: none;
    padding: $spacing-small;
    color: $text-color;
    width: 100%;
    cursor: pointer;
    text-align: center;
    border-radius: $border-radius;
    transition: background 0.3s;

    &:hover {
      background: darken($primary-color, 5%);
    }
  }
}
</style>
