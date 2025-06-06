<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

</script>


<template>
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600&family=Poppins:wght@300;400;500&family=Playfair+Display:wght@600&display=swap" rel="stylesheet">
  <RouterView />
</template>

<style lang="scss">
@import '../src/assets/styles/variables.scss';

body {
  font-family: $font-family-base;
}

h1, h2, h3 {
  font-family: $font-family-title;
}
</style>
