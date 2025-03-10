<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGamesStore } from '@/stores/games'

const route = useRoute()
const games = useGamesStore()

const gamesToDisplay = computed(() => {
  //si hay un filtro activo, se aplica
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
  gap: 1.5rem;
  width: 100%;
  padding: 1rem;
  margin-bottom: 3rem;

  &__no-results {
    text-align: center;
    font-weight: bold;
  }
}

.game-card {
  background-color: #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-decoration: none;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);

    .game-card__overlay {
      opacity: 1;
    }

    .game-card__image--img {
      transform: scale(1.05);
    }
  }

  &__image {
    position: relative;
    height: 180px;
    overflow: hidden;

    &--img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.3s ease;
    }
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.3s ease;

    &--details {
      background-color: #f25421;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 30px;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      transform: translateY(5px);
      transition: all 0.3s ease;
    }
  }

  &__info {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: #e8e8e8;
  }

  &__title {
    color: #f25421;
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__badge {
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 600;
    color: white;

    &--year {
      background-color: #00aa6c;
    }

    &--pegi {
      background-color: #f25421;
    }
  }
}

@media (min-width: 768px) {
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .game-card__image {
    height: 200px;
  }
}

@media (min-width: 1024px) {
  .games-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    padding: 2rem;
  }
}

@media (min-width: 1440px) {
  .games-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>