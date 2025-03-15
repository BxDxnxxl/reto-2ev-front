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
      <hr />
      <button class="sidebar__link" @click="emit('change-view', 'dashboard')">
        Mi Perfil
      </button>
    </nav>
    <button class="sidebar__logout" @click="logout">
      Cerrar Sesión
    </button>
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
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
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
    transition: background 0.3s;

    &:hover {
      background: #d64321;
    }
  }
}
</style>
