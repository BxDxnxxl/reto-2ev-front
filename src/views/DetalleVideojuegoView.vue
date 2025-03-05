<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router'
import DetalleVideojuego from '@/components/DetalleVideojuego.vue'

const route = useRoute()

const gameId = route.query.id ? Number(route.query.id) : null
</script>

<template>
  <Header />
  <DetalleVideojuego :gameId="gameId" />
</template>

<style lang="scss" scoped>
</style>
