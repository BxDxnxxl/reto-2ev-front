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
.carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 200px; /* Añadido espacio arriba */
  margin-bottom: 20px; /* Añadido espacio abajo */
  padding-bottom: 20px; /* Asegura que haya espacio entre el carrousel y el footer */
}

.carousel__main {
  position: relative;
  width: 100%;
  max-width: 900px;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  .carousel__image {
    width: 100%;
    border-radius: 15px;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
}

.carousel__thumbnails {
  display: flex;
  justify-content: center; /* Centra las miniaturas */
  align-items: center;
  margin-top: 20px;
  width: 100%;
  overflow-x: auto; /* Permite el desplazamiento horizontal de miniaturas */
  padding-bottom: 20px;
}

.carousel__thumbnail-container {
  display: flex;
  gap: 10px;
  padding: 0 20px;
}

.carousel__thumbnail {
  width: 80px;
  height: 50px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 3px solid transparent;
}

.carousel__thumbnail:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 99, 71, 0.8);
}

.carousel__thumbnail.active {
  border-color: #ff6347;
  transform: scale(1.1);
}

@media (min-width: 600px) {
  .carousel__main {
    max-width: 1000px;
  }

  .carousel__thumbnail-container .carousel__thumbnail {
    width: 100px;
    height: 60px;
  }
}

@media (min-width: 1024px) {
  .carousel__main {
    max-width: 1200px;
  }

  .carousel__thumbnail-container .carousel__thumbnail {
    width: 120px;
    height: 70px;
  }
}
</style>
