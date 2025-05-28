<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useReviewStore } from '@/stores/review'
import { useGamesStore } from '@/stores/games'

const route = useRoute()
const games = useGamesStore()
const reviewStore = useReviewStore()
const id = Number(route.params.id)

const props = defineProps({
  gameId: {
    type: Number,
    default: null,
  },
})

onMounted(() => {
  const id = props.gameId || Number(route.params.id)

  if (!id || isNaN(id)) {
    console.error('ID inválido o no encontrado en la ruta')
    return
  }

  games.verDetalleVideojuego(id)
  reviewStore.getReviewByVideojuego(id)
})

const videojuego = computed(() => games.detalleVideojuego)
const review = computed(() => reviewStore.review)

const trailerEmbedUrl = computed(() => {
  if (!review.value?.trailer) return null

  const url = review.value.trailer

  // Detectar y convertir formato YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }
  return url
})

</script>

<template>
  <div class="container" v-if="videojuego && review">
    <header class="title">
      <h1>{{ videojuego.titulo }}</h1>
      <nav class="nav">
        <a v-if="review?.sitioOficial" :href="review.sitioOficial" target="_blank">Sitio oficial</a>
        <a v-if="review?.sitioCompra" :href="review.sitioCompra" target="_blank">Cómpralo</a>
        <a v-if="review?.metacritic" :href="review.metacritic" target="_blank">Metacritic</a>
        <a href="#" @click.prevent="$router.back()">Salir</a>
      </nav>
    </header>

    <section class="box">
      <div class="about">
        <img :src="videojuego.caratula" :alt="videojuego.titulo" class="image" />

        <div class="text-content">
          <p><b>SINOPSIS</b></p>
          <p>{{ review.contenido }}</p>

          <p><b>Descubre más con el siguiente tráiler oficial:</b></p>
          <div class="video-wrapper" v-if="review.trailer">
            <iframe v-if="trailerEmbedUrl" :src="trailerEmbedUrl" frameborder="0" allow="autoplay; encrypted-media"
              allowfullscreen></iframe>

            <figcaption>Tráiler oficial de <strong>{{ videojuego.titulo }}</strong></figcaption>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-else>
    <p>Cargando datos...</p>
  </div>
</template>




<style lang="scss" scoped>
@import '../assets/styles/variables.scss';

:global(html, body) {
  margin: 0;
  padding: 0;
  background-color: $background-color;
  color: $text-color;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: $spacing-large $spacing-medium;
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
}

.title {
  background-color: lighten($background-color, 3%);
  padding: $spacing-large;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  text-align: center;

  h1 {
    font-size: 40px;
    text-transform: uppercase;
    color: $primary-color;
    margin-bottom: $spacing-small;
    letter-spacing: 1px;
  }

  .nav {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: $spacing-small;

    a {
      background-color: $primary-color;
      color: $text-color;
      font-size: $font-size-large;
      padding: $spacing-small $spacing-medium;
      border-radius: $border-radius;
      text-transform: uppercase;
      font-weight: bold;
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        background-color: lighten($primary-color, 10%);
        transform: scale(1.05);
      }
    }
  }
}

.box {
  background-color: lighten($background-color, 3%);
  padding: $spacing-large;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}

.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-large;

  .image {
    width: 100%;
    max-width: 800px;
    border-radius: 16px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  .text-content {
    width: 100%;
    color: $text-color;
    text-align: justify;
    max-width: 800px;

    p {
      margin-bottom: $spacing-medium;
      line-height: 1.6;
    }

    b {
      color: $primary-color;
    }

    .video-wrapper {
      width: 100%;
      aspect-ratio: 16 / 9;
      position: relative;
      margin-top: $spacing-medium;

      iframe {
        width: 100%;
        height: 100%;
        border-radius: $border-radius;
      }

      figcaption {
        text-align: center;
        font-size: $font-size-small;
        color: lighten($secondary-color, 20%);
        margin-top: $spacing-small;
      }
    }
  }
}
</style>

