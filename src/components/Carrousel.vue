<template>
  <section class="carousel">
    <div class="carousel__main">
      <img
        :src="`${store.top5Videojuegos[0]?.caratula}`"
        alt="Imagen principal"
        class="carousel__image"
      />
    </div>

    <!-- Miniaturas debajo de la imagen principal -->
    <div class="carousel__thumbnails">
      <div class="carousel__thumbnail-container">
        <img
          v-for="(videojuego, index) in store.top5Videojuegos"
          :key="index"
          :src="`${videojuego.caratula}`"
          :alt="videojuego.titulo"
          @click="showSlide(index)"
          class="carousel__thumbnail"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGamesStore } from '@/stores/games'

const currentSlide = ref(0)
const store = useGamesStore()

// Llamamos a la función de la store para obtener los videojuegos
onMounted(() => {
  store.fetchTop5Videojuegos()
})

// Función para mostrar el slide actual
function showSlide(index: number) {
  currentSlide.value = index
  const mainImage = document.querySelector('.carousel__image') as HTMLImageElement
  mainImage.src = `${store.top5Videojuegos[index].caratula}`
  updateActiveThumbnail()
}

// Función para actualizar la miniatura activa
function updateActiveThumbnail() {
  const thumbnails = document.querySelectorAll('.carousel__thumbnail')
  thumbnails.forEach((thumb, index) => {
    thumb.classList.toggle('active', index === currentSlide.value)
  })
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 120px; /* Ajustamos el espacio superior para el mobile-first */
  margin-bottom: 20px;
  padding-bottom: 20px;
}

.carousel__main {
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1; /* Asegura que la imagen principal no se corte por el header */
}

.carousel__image {
  width: 100%;
  height: auto; /* Garantiza que la imagen mantenga su proporción */
  border-radius: 15px;
  object-fit: contain; /* Usamos contain para que la imagen no se corte */
  transition: opacity 0.5s ease;
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

/* Mobile First */
@media (min-width: 768px) {
  .carousel__main {
    max-width: 100%;
  }

  .carousel__thumbnail {
    width: 90px;
    height: 60px;
  }
}

@media (min-width: 1024px) {
  .carousel__main {
    max-width: 1200px;
  }

  .carousel__thumbnail {
    width: 110px;
    height: 70px;
  }
}
</style>