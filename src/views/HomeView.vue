<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Carrousel from '@/components/Carrousel.vue'
import MainCard from '@/components/MainCard.vue'
</script>

<template>
  <div class="app-layout">
    <Header />
    <main class="app-content">
      <Carrousel />
      <MainCard />
      <Footer />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-content {
  padding-top: 12rem;
  padding-left: 2%;
  padding-right: 2%;
  margin-top: 0;
  width: 100%;

  @media (min-width: 768px) {
    padding-top: 11.5rem;
    padding-left: 5%;
    padding-right: 5%;
  }
}
</style>