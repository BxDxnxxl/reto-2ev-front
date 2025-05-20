<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useReviewStore } from '@/stores/review'
import { useGamesStore } from '@/stores/games'

const route = useRoute()
const games = useGamesStore()
const reviewStore = useReviewStore()

const id = Number(route.params.id)

onMounted(() => {
  games.verDetalleVideojuego(id)
  reviewStore.getReviewByVideojuego(id)
})

const videojuego = computed(() => games.detalleVideojuego)
const review = computed(() => reviewStore.review)
</script>

<template>
  <div class="container" v-if="videojuego && review">
    <div class="title">
      <h1>{{ videojuego.titulo }}</h1>
      <div class="nav">
        <a v-if="review?.sitioOficial" :href="review.sitioOficial" target="_blank">Sitio oficial</a>
        <a v-if="review?.sitioCompra" :href="review.sitioCompra" target="_blank">Cómpralo</a>
        <a v-if="review?.metacritic" :href="review.metacritic" target="_blank">Metacritic</a>
        <a href="#" @click.prevent="$router.back()">Salir</a>
      </div>
    </div>

    <div class="box">
      <div class="about">
        <img :src="videojuego.caratula" :alt="videojuego.titulo" class="detalle-videojuego__imagen" />

        <div class="text-content">
          <p><b>SINOPSIS</b></p>
          <p>{{ review.contenido }}</p>

          <br>

          <p><b>CONCLUSIÓN</b></p>
          <p>{{ review.opinionPersonal }}</p>

          <p><b>Descubre más con el siguiente tráiler oficial:</b></p>
          <figure style="text-align: center;" v-if="review.trailer">
            <iframe width="560" height="315" :src="review.trailer" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            <figcaption>Tráiler oficial de <strong>{{ videojuego.titulo }}</strong></figcaption>
          </figure>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Cargando datos...</p>
  </div>
</template>



<style lang="scss" scoped>
@import '../assets/styles/variables.scss';

.container {
    max-width: 1280px;
    margin: 0 auto;
    padding: $spacing-large;
    background-color: $background-color;
}

.title {
    text-align: center;
    margin-bottom: $spacing-large;

    h1 {
        font-size: 36px;
        text-transform: uppercase;
        color: $primary-color;
        margin-bottom: $spacing-small;
    }

    .nav {
        a {
            color: $text-color;
            font-size: $font-size-large;
            margin: 0 $spacing-medium;
            text-transform: uppercase;
            font-weight: bold;
            text-decoration: none;

            &:hover {
                color: lighten($primary-color, 10%);
            }
        }
    }
}

.box {
    background-color: $text-color;
    padding: $spacing-large;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
}

h3 {
    font-size: $font-size-xlarge;
    text-transform: uppercase;
    margin-bottom: $spacing-medium;
    background: $primary-color;
    color: $text-color;
    padding: $spacing-small $spacing-medium;
    border-radius: $border-radius;
    display: inline-block;
}

.about {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-large;

    .image {
        width: 100%;
        max-width: 1000px;
        border-radius: 16px;
        box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.02);
        }
    }

    .text-content {
        width: 100%;
        color: $secondary-color;
        text-align: justify;

        p {
            margin-bottom: $spacing-medium;
        }

        ul {
            list-style: none;
            padding-left: 0;

            li {
                margin-bottom: $spacing-small;
                font-size: $font-size-base;

                b {
                    color: $primary-color;
                    margin-right: $spacing-small;
                }
            }
        }

        b {
            color: $primary-color;
        }

        a {
            color: lighten($primary-color, 20%);
            text-decoration: none;

            &:hover {
                color: darken($primary-color, 10%);
            }
        }
    }
}
</style>
