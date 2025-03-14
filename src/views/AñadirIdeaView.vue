<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router'
import FormularioIdea from '@/components/FormularioIdea.vue'

const route = useRoute()

</script>

<template>
  <Header />

    <FormularioIdea />
</template>

<style scoped lang="scss">

</style>
