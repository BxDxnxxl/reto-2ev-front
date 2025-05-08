<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useReviewStore } from '@/stores/review'
import { useGamesStore } from '@/stores/games'

const route = useRoute()
const games = useGamesStore()
const reviewStore = useReviewStore()

onMounted(() => {
  games.fetchVideojuegos(true)  
  const id = route.params.id  
  reviewStore.getReviewByVideojuego(id)  
})
</script>

<template>
  <div class="container">
    <div class="title">
      <h1>{{ videojuego.titulo }}</h1>
      <div class="nav">
        <a href="https://www.rockstargames.com/reddeadredemption2/">Sitio oficial</a>
        <a href="https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/">Steam</a>
        <a href="https://www.metacritic.com/game/red-dead-redemption-2/">Metacritic</a>
        <a href="#">Salir</a>
      </div>
    </div>

    <div class="box">
      <div class="about">
        <img :src="videojuego.caratula" :alt="videojuego.titulo" class="detalle-videojuego__imagen" />
        
        <div class="text-content">
          <p><b>SINOPSIS</b></p>
          <p>{{ reviewStore.review?.contenido }}</p>

          <p><b>LO MEJOR Y LO PEOR</b></p>
          <ul>
            <li><b>✔</b> Historia absorbente y madura</li>
            <li><b>✔</b> Mundo abierto rico y coherente</li>
            <li><b>✔</b> Apartado técnico impresionante</li>
            <li><b>✘</b> Ritmo lento puede no gustar a todos</li>
            <li><b>✘</b> Controles algo rígidos en ciertas situaciones</li>
          </ul>

          <br>

          <p><b>CONCLUSIÓN</b>{{ reviewStore.review?.opinionPersonal }}</p>  


          <p><b>Descubre más con el siguiente tráiler oficial:</b></p>
          <figure style="text-align: center;">
            <iframe width="560" height="315" :src="reviewStore.review?.trailer" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>  <!-- Usamos el trailer -->
            <figcaption>Tráiler oficial de <strong>{{ videojuego.titulo }}</strong></figcaption>
          </figure>
        </div>
      </div>
    </div>
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
