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
    <h3 class="details-box__title">Detalles del juego</h3>
    <ul class="details-box__list">
      <li class="details-box__item"><strong class="details-box__label">Duración:</strong> {{ review.duracionJuego }} horas</li>
      <li class="details-box__item"><strong class="details-box__label">Género:</strong> {{ detalleVideojuego.generos.map(g => g.nombre).join(', ') }}</li>
      <li class="details-box__item"><strong class="details-box__label">Plataformas:</strong> {{ detalleVideojuego.plataformas.map(p => p.nombre).join(', ') }}</li>
      <li class="details-box__item"><strong class="details-box__label">Desarrollador:</strong> {{ detalleVideojuego.compania }}</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.details-box {
  background: $background-color;
  padding: $spacing-small;
  border-radius: $border-radius;
  margin-bottom: $spacing-large;
  box-shadow: $box-shadow;
  font-size: $font-size-small;

  .details-box__title {
    color: $primary-color;
    font-size: $font-size-large;
    margin-bottom: $spacing-small;
  }

  .details-box__list {
    padding-left: 1em;
  }

  .details-box__item {
    margin: $spacing-small 0;
    font-size: $font-size-base;
  }

  .details-box__label {
    color: $primary-color;
  }

  @media (min-width: 768px) {
    padding: $spacing-medium;
    font-size: $font-size-base;

    .details-box__title {
      font-size: $font-size-xlarge;
    }
  }
}
</style>
