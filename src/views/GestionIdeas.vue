<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router'
import ListaIdeas from '@/components/ListaIdeas.vue'

const route = useRoute()
</script>

<template>
  <Header />

    <ListaIdeas  />
</template>

<style scoped lang="scss">

</style>
