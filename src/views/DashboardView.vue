<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import DashboardMain from '@/components/DashboardMain.vue'
import { onMounted, computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRouter } from 'vue-router'

const userStore = useUsersStore()
const router = useRouter()
console.log(userStore.currentUser)
const isLoggedIn = computed(() => !!userStore.currentUser)

</script>

<template>
  <div class="dashboard">
    <div v-if="!isLoggedIn" class="login-message">
      <p>Necesitas estar logeado para poder acceder a esta ruta</p>
      <v-btn color="primary" class="login-button" @click="$router.push('/login')">
        Logéate aquí
      </v-btn>
    </div>

    <template v-else>
      <Sidebar />
      <DashboardMain />
    </template>
  </div>
</template>
  
<style lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;

  @media (min-width: 768px) {
    flex-direction: row;
  }
}

.login-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  padding: 1rem;
}

.login-button {
  margin-top: 1rem;
  width: fit-content; 
}
</style>