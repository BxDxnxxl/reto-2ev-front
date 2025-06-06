<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGamesStore } from '@/stores/games'

const route = useRoute()
const games = useGamesStore()

const gamesToDisplay = computed(() => {

  if (games.filtroActivo) {
    return games.juegosFiltrados
  }
  return games.games
})

onMounted(() => {
  games.fetchVideojuegos(true)
})
</script>

<template>
  <div class="games-grid" id="obras-container">
    <div v-if="games.filtroActivo && gamesToDisplay.length === 0" class="games-grid__no-results">
      No se encontraron videojuegos con los filtros seleccionados.
    </div>

    <router-link
      v-for="game in gamesToDisplay"
      :key="game.id"
      :to="`/detalleVideojuego?id=${game.id}`"
      class="game-card"
    >
      <div class="game-card__image">
        <img :src="game.caratula" :alt="game.titulo" class="game-card__image--img" />
        <div class="game-card__overlay">
          <span class="game-card__overlay--details">Ver detalles</span>
        </div>
      </div>
      <div class="game-card__info">
        <h3 class="game-card__title">{{ game.titulo }}</h3>
        <div class="game-card__footer">
          <span class="game-card__badge game-card__badge--year">{{
            new Date(game.anioSalida).getFullYear()
          }}</span>
          <span class="game-card__badge game-card__badge--pegi">PEGI {{ game.pegi }}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.games-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-large;
  width: 100%;
  padding: $spacing-medium;
  margin-bottom: $spacing-xxl;

  &__no-results {
    text-align: center;
    font-family: $font-family-base;
    font-weight: 600;
    color: $text-color;
    font-size: $font-size-base;
    padding: $spacing-xl;
    background-color: $card-background;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
  }
}

.game-card {
  background-color: $card-background;
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: $box-shadow;
  transition: $transition;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(242, 84, 33, 0.2);
    border-color: $primary-color;

    .game-card__overlay {
      opacity: 1;
    }

    .game-card__image--img {
      transform: scale(1.05);
    }

    .game-card__overlay--details {
      transform: translateY(0);
    }
  }

  &__image {
    position: relative;
    height: 180px;
    overflow: hidden;
    background-color: $secondary-color;

    &--img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: $transition;
    }
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($secondary-color, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: $transition;

    &--details {
      background: $primary-gradient;
      color: $text-color;
      padding: $spacing-small $spacing-medium;
      border-radius: 30px;
      font-family: $font-family-base;
      font-weight: 600;
      font-size: $font-size-small;
      box-shadow: 0 4px 12px rgba($primary-color, 0.3);
      transform: translateY(5px);
      transition: $transition;
      border: none;
      cursor: pointer;
    }
  }

  &__info {
    padding: $spacing-medium;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: $card-background;
  }

  &__title {
    color: $primary-color;
    font-family: $font-family-base;
    font-weight: 700;
    font-size: $font-size-base;
    margin-bottom: $spacing-small;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: $transition;

    &:hover {
      color: lighten($primary-color, 10%);
    }
  }

  &__footer {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-small;
  }

  &__badge {
    padding: $spacing-extra-small $spacing-small;
    border-radius: $border-radius / 2;
    font-family: $font-family-base;
    font-size: 12px;
    font-weight: 600;
    color: $text-color;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: $transition;

    &--year {
      background-color: $color-success;
      
      &:hover {
        background-color: lighten($color-success, 10%);
      }
    }

    &--pegi {
      background-color: $primary-color;
      
      &:hover {
        background-color: lighten($primary-color, 10%);
      }
    }
  }
}

@media (min-width: $desktop) {
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-large;
    padding: $spacing-large;
  }

  .game-card {
    &__image {
      height: 200px;
    }

    &__title {
      font-size: $font-size-large;
    }
  }
}

@media (min-width: $laptop) {
  .games-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-xl;
    padding: $spacing-xl;
  }

  .game-card {
    &__image {
      height: 220px;
    }

    &__info {
      padding: $spacing-large;
    }

    &__title {
      font-size: $font-size-large;
      margin-bottom: $spacing-medium;
    }
  }
}

@media (min-width: $xl) {
  .games-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-xl;
  }

  .game-card {
    &__image {
      height: 240px;
    }

    &__title {
      font-size: $font-size-xlarge;
    }
  }
}

.game-card {
  &--loading {
    background-color: $color-disabled;
    pointer-events: none;
    opacity: 0.7;
  }

  &--error {
    border-color: $color-error;
    
    .game-card__title {
      color: $color-error;
    }
  }
}

.game-card {
  &:focus-visible {
    outline: 2px solid $primary-color;
    outline-offset: 2px;
  }

  &:focus {
    outline: none;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.game-card {
  animation: fadeInUp 0.3s ease forwards;
}
</style>