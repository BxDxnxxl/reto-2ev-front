<script setup lang="ts">
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Ideas from "@/components/Ideas.vue";
</script>

<template>
  <div class="ideas-view">
    <Header />
    <main class="ideas-view__contenido">
      <Ideas />
    </main>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.ideas-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__contenido {
    flex: 1;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 2rem;

    @media (min-width: 768px) {
      padding-left: 5%;
      padding-right: 5%;
    }
  }
}
</style>
