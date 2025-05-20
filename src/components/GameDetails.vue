<script setup>
import { computed } from 'vue'
import { useReviewStore } from '@/stores/review'
import { useGamesStore } from '@/stores/games'

const reviewStore = useReviewStore()
const gamesStore = useGamesStore()

const review = computed(() => reviewStore.review)
const detalleVideojuego = computed(() => gamesStore.detalleVideojuego)
</script>

<template>
  <div class="details-box" v-if="review && detalleVideojuego">
    <h3>Detalles del juego</h3>
    <ul>
      <li><strong>Duración:</strong> {{ review.duracionJuego }} horas</li>
      <li><strong>Género:</strong> {{ detalleVideojuego.generos.map(g => g.nombre).join(', ') }}</li>
      <li><strong>Plataformas:</strong> {{ detalleVideojuego.plataformas.map(p => p.nombre).join(', ') }}</li>
      <li><strong>Desarrollador:</strong> {{ detalleVideojuego.compania }}</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.details-box {
  background: $background-color;
  color: $text-color;
  padding: $spacing-medium;
  border-radius: $border-radius;
  margin-bottom: $spacing-large;
  box-shadow: $box-shadow;

  h3 {
    color: $primary-color;
    font-size: $font-size-xlarge;
  }

  li {
    margin: $spacing-small 0;
    font-size: $font-size-base;

    strong {
      color: $primary-color;
    }
  }
}
</style>