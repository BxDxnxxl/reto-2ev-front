<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import DashboardMain from '@/components/DashboardMain.vue'
</script>


<template>
  <div class="dashboard">
    <Sidebar />
    
    <DashboardMain />
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
</style>