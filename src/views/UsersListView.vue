<script setup lang="ts">
import TablaUsuarios from '@/components/ListaUsuarios.vue'
import Header from '@/components/Header.vue'
</script>

<template>
  
    <Header />
    <TablaUsuarios />

</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.lista-usuarios {
  padding: $spacing-large;
}
</style>