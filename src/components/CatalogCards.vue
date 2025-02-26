<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGamesStore } from '@/stores/games'

const route = useRoute()

const games = useGamesStore()

onMounted(() => {
  games.fetchVideojuegos(true)
})
</script>

<template>
  <div class="container-products" id="obras-container">
    <div class="card-product" v-for="games in games.games" :key="games.id">
      <div class="container-img">
        <img :src="`${games.caratula}`" :alt="games.titulo" class="img-item" />
      </div>
      <div class="content-card-product">
        <h3 class="titulo-item">{{ games.titulo }}</h3>
   <!--     <RouterLink :to="{ name: 'Detalles', params: { id: games.id } }" class="game-button">
          Detalles
        </RouterLink>-->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:root {
  $secondary-color: #272727;
  $primary-gradient: linear-gradient(90deg, #f25421, #ff8c00, #ffd700);
  $primary-color: #f25421;
  $background-color: #272727;
  $text-color: #ffffff;
  $dark-color: #272727;
  $box-shadow: 0 2rem 3rem var($dark-color);
  $btn-color: #f25421;
}

.container-products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 3rem;
  width: 100%;
  margin-bottom: 50px;
}

.card-product {
  background-color: #ffffff;
  padding: 2rem 3rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.container-img {
  width: 100%;
  height: 15rem;
  display: flex;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.content-card-product {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: #000;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    margin-top: 1rem;
  }
}

.game-button {
  background-color: #f25421;
  border: none;
  border-radius: 30px;
  padding: 14px 35px;
  color: white;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  width: fit-content;

  &:hover {
    background-color: #f25421;
    color: #ffffff;
  }
}
</style>