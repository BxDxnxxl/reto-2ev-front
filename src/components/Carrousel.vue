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
  margin-top: 150px;
  margin-bottom: 20px;
  padding-bottom: 20px;
}

.carousel__contenedor {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.carousel__imagen-wrapper {
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
}

.carousel__imagen {
  width: 100%;
  max-width: 600px;
  border-radius: 15px;
  object-fit: cover;
  transition: opacity 0.5s ease;
}

.carousel__info {
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.carousel__thumbnails {
  display: flex;
  justify-content: center;
  align-items: center;
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
  .carousel {
    margin-bottom: 40px;
  }

  .carousel__contenedor {
    flex-direction: row;
    align-items: stretch;
    max-width: 1200px;
    margin: 0 auto;
  }

  .carousel__imagen-wrapper {
    width: 40%;
    padding: 30px;
    display: flex;
    align-items: center;
  }

  .carousel__imagen {
    max-width: 100%;
  }

  .carousel__info {
    width: 60%;
    padding: 30px;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
  }
}

@media (min-width: 1200px) {
  .carousel__imagen-wrapper {
    width: 35%;
  }

  .carousel__info {
    width: 65%;
  }
}

@media (min-width: 1440px) {
  .carousel__contenedor {
    max-width: 1400px;
  }

  .carousel__imagen-wrapper {
    width: 33%;
  }

  .carousel__info {
    width: 67%;
    padding: 40px;
  }
}
</style>