<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGamesStore } from '@/stores/games';

const currentSlide = ref(0);
const store = useGamesStore();

// Llamamos a la función de la store para obtener los videojuegos
onMounted(() => {
  store.fetchVideojuegos();
});

// Función para mostrar el slide actual
function showSlide(index: number) {
  currentSlide.value = index;
  const mainImage = document.querySelector('.carousel__image') as HTMLImageElement;
  mainImage.src = `/images/banners/${store.games[index].imagen}`;
  updateActiveThumbnail();
}

// Función para avanzar al siguiente slide
function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % store.games.length;
  showSlide(currentSlide.value);
}

// Función para retroceder al slide anterior
function previousSlide() {
  currentSlide.value = (currentSlide.value - 1 + store.games.length) % store.games.length;
  showSlide(currentSlide.value);
}

// Función para actualizar la miniatura activa
function updateActiveThumbnail() {
  const thumbnails = document.querySelectorAll('.carousel__thumbnail');
  thumbnails.forEach((thumb, index) => {
    thumb.classList.toggle('active', index === currentSlide.value);
  });
}
</script>

<template>
  <section class="carousel">
    <div class="carousel__main">
      <img
        :src="`/images/banners/${store.games[0]?.imagen}`"
        alt="Imagen principal"
        class="carousel__image"
      />
    </div>

    <div class="carousel__thumbnails">
      <button class="carousel__arrow carousel__arrow--left" @click="previousSlide">&#10094;</button>

      <div class="carousel__thumbnail-container">
        <img
          v-for="(videojuego, index) in store.games"
          :key="index"
          :src="`/images/banners/${videojuego.imagen}`"
          :alt="videojuego.titulo"
          @click="showSlide(index)"
          class="carousel__thumbnail"
        />
      </div>

      <button class="carousel__arrow carousel__arrow--right" @click="nextSlide">&#10095;</button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.carousel__main {
  width: 100%;
  max-width: 800px;
  position: relative;

  .carousel__image {
    width: 100%;
    border-radius: 10px;
  }
}

.carousel__thumbnails {
  display: flex;
  align-items: center;
  margin-top: 20px;

  .carousel__arrow {
    background: transparent;
    border: none;
    font-size: 30px;
    cursor: pointer;
    color: #fff;
  }

  .carousel__thumbnail-container {
    display: flex;
    gap: 10px;

    .carousel__thumbnail {
      width: 80px;
      height: 45px;
      object-fit: cover;
      cursor: pointer;
      border-radius: 5px;
      transition: transform 0.3s ease-in-out;
    }

    .carousel__thumbnail.active {
      border: 3px solid #ff6347;
      transform: scale(1.1);
    }
  }
}

@media (min-width: 600px) {
  .carousel__main {
    max-width: 1000px;
  }

  .carousel__thumbnail-container .carousel__thumbnail {
    width: 100px;
    height: 55px;
  }
}

@media (min-width: 1024px) {
  .carousel__main {
    max-width: 1200px;
  }
}
</style>
