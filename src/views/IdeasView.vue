<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router'
import IdeasCard from '@/components/IdeasCard.vue'

const route = useRoute()
</script>

<template>
  <Header />

    <IdeasCard />
</template>

<style scoped lang="scss">

</style>
