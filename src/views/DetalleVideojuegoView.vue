<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router'
import DetalleVideojuego from '@/components/DetalleVideojuego.vue'
import Comentarios from '@/components/Comentarios.vue'

const route = useRoute()

const gameId = route.query.id ? Number(route.query.id) : undefined
</script>

<template>
  <Header />
  <DetalleVideojuego :gameId="gameId" />
  <Comentarios :gameId="gameId" />
</template>

<style lang="scss" scoped>
</style>
