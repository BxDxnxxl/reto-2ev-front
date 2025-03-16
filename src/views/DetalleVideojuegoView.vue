<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router'
import DetalleVideojuego from '@/components/DetalleVideojuego.vue'
import Comentarios from '@/components/Comentarios.vue'
import PostComentario from '@/components/PostComentario.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()

const gameId = route.query.id ? Number(route.query.id) : 0
</script>

<template>
  <div class="app-layout">
    <Header />
    <main class="app-content">
      <DetalleVideojuego :gameId="gameId" />
      <PostComentario :gameId="gameId"/>
      <Comentarios :gameId="gameId" />
    </main>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-content {
  padding-top: 1rem;
  padding-left: 2%;
  padding-right: 2%;
  margin-top: 0;
  width: 100%;
  
  @media (min-width: 768px) {
    padding-left: 5%;
    padding-right: 5%;
  }
}
</style>