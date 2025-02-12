<script setup lang="ts">
import TablaUsuarios from '@/components/ListaUsuarios.vue'
</script>

<template>
  <v-container>
    <TablaUsuarios />
  </v-container>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.lista-usuarios {
  padding: $spacing-large;
}
</style>