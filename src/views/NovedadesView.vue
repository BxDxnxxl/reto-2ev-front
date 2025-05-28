<script setup lang="ts">
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import NovedadesBlogComponent from "@/components/NovedadesList.vue";
</script>

<template>
  <div class="novedades-view">
    <Header />
    <main class="novedades-view__contenido">
      <NovedadesBlogComponent />
    </main>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.novedades-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__contenido {
    flex: 1;
  }
}
</style>