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
  $box-shadow: 0 2rem 3rem rgba(0, 0, 0, 0.1);
  $btn-color: #f25421;
}

.container-products {
  display: grid;
  grid-template-columns: 1fr; 
  gap: 5rem;
  width: 100%;
  margin-bottom: 50px;
  padding: 0 1rem; 
}

.card-product {
  background-color: #272727;
  padding: 2rem;
  border-radius: 1rem; 
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  max-width: 100%; 
  height: auto;
  position: relative;
}

.card-product:hover {
  transform: translateY(-10px); 
  box-shadow: 0 2rem 8rem rgb(255, 115, 0); 
}

.container-img {
  width: 100%;
  height: 15rem; 
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-radius: 1rem; 

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1rem; 
  }
}

.content-card-product {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;

  h3 {
    color: #fff;
    font-weight: 700;
    font-size: 1.2rem;
    text-align: center;
    margin-top: 1rem;
    line-height: 1.3;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: color 0.3s ease;
  }

  h3:hover {
    color: #f25421; 
  }
}


@media (min-width: 600px) {
  .container-products {
    grid-template-columns: repeat(2, 1fr); 
    padding: 0 2rem; 
  }

  .card-product {
    max-width: 90%;
  }
}


@media (min-width: 1024px) {
  .container-products {
    grid-template-columns: repeat(4, 1fr); 
    padding: 0 4rem; 
  }

  .card-product {
    max-width: 18rem; 
  }
}
</style>