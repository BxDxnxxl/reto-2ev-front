<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useGamesStore } from '@/stores/games'

const currentSlide = ref(0)
const store = useGamesStore()
let interval: number | null = null

onMounted(() => {
  store.fetchTop5Videojuegos()
  startAutoPlay()
})

const startAutoPlay = () => {
  interval = setInterval(() => {
    nextSlide()
  }, 7000)
}

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

function showSlide(index: number) {
  currentSlide.value = index
}

function nextSlide() {
  if (store.top5Videojuegos.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % store.top5Videojuegos.length
  }
}
</script>

<template>
  <h2 class="carousel__heading">Los mejor valorados</h2>
  <section class="carousel">
    <div class="carousel__main">
      <img
        :src="store.top5Videojuegos[currentSlide]?.caratula"
        alt="Imagen principal"
        class="carousel__image"
      />

      <div class="carousel__info">
        <h3 class="carousel__title">{{ store.top5Videojuegos[currentSlide]?.titulo }}</h3>
        <router-link
          v-if="store.top5Videojuegos.length"
          :to="`/detalleVideojuego?id=${store.top5Videojuegos[currentSlide]?.id}`"
          class="carousel__button"
        >
          Ver Más
        </router-link>
      </div>
    </div>

    <div class="carousel__thumbnails">
      <div class="carousel__thumbnail-container">
        <img
          v-for="(videojuego, index) in store.top5Videojuegos"
          :key="index"
          :src="videojuego.caratula"
          :alt="videojuego.titulo"
          @click="showSlide(index)"
          class="carousel__thumbnail"
          :class="{ active: index === currentSlide }"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
.carousel__heading {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: $primary-color;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: 1.5rem;
  position: relative;
  
  &::after {
    content: "";
    display: block;
    width: 80px;
    height: 4px;
    background: $primary-color;
    margin: 8px auto 0;
    border-radius: 2px;
  }

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
}
.carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  padding-bottom: 20px;
}

.carousel__main {
  position: relative;
  width: 80%;
  height: 40vh;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.carousel__image {
  width: 100%;
  height: 100%;
  object-fit: fill;
  border-radius: 15px;
  transition: opacity 0.5s ease;
}

.carousel__info {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 35%;
  background: linear-gradient(to top, rgba(30, 30, 30, 0.9), rgba(30, 30, 30, 0.7), rgba(30, 30, 30, 0.4));  ;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 20px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.carousel__title {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.carousel__button {
  background: $primary-color;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background: darken($primary-color, 10%);
    transform: scale(1.05);
  }
}

.carousel__thumbnails {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 10px;
}

.carousel__thumbnail-container {
  display: flex;
  gap: 8px;
  padding: 0 15px;
}

.carousel__thumbnail {
  width: 70px;
  height: 50px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease;
  border: 2px solid transparent;
}

.carousel__thumbnail:hover {
  transform: scale(1.1);
  box-shadow: 0 0 12px rgba(255, 99, 71, 0.8);
}

.carousel__thumbnail.active {
  border-color: #ff6347;
  transform: scale(1.1);
}

@media (min-width: 768px) {
  .carousel__main {
    height: 50vh;
  }

  .carousel__thumbnail {
    width: 90px;
    height: 60px;
  }
}

@media (min-width: 1024px) {
  .carousel__main {
    height: 50vh;
  }

  .carousel__thumbnail {
    width: 110px;
    height: 70px;
  }
}
</style>