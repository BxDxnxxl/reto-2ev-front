<script setup>
import { ref, onMounted } from 'vue'
import { useCompaniesStore } from '@/stores/compañia'
import { useGenresStore } from '@/stores/generos'

const companiesStore = useCompaniesStore()
const genresStore = useGenresStore()

const top5Companias = ref([])
const top5Generos = ref([])

onMounted(async () => {
  await companiesStore.fetchTop5Companies()
  await genresStore.fetchTop5Genres()
  top5Companias.value = companiesStore.top5Companias
  top5Generos.value = genresStore.top5Generos
  console.log(top5Companias.value);
  console.log(top5Generos.value);
})
</script>

<template>
  <div class="cards-container">
    <!-- Sección de Géneros Populares -->
    <div class="section">
      <h2 class="section__title">Géneros Populares</h2>
      <div class="cards">
        <router-link v-for="genero in top5Generos" :key="genero.id" to="/catalog" class="card">
          <img :src="`${genero.urlImagen}`" :alt="genero.nombre" class="card__image" />
          <p class="card__name">{{ genero.nombre }}</p>
        </router-link>
      </div>
    </div>

    <!-- Sección de Compañías Populares -->
    <div class="section">
      <h2 class="section__title">Compañías Populares</h2>
      <div class="cards">
        <router-link
          v-for="compania in top5Companias"
          :key="compania.id"
          to="/catalog"
          class="card"
        >
          <img :src="`${compania.urlImagen}`" :alt="compania.nombre" class="card__image" />
          <p class="card__name">{{ compania.nombre }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

html,
body {
  margin: 0;
  padding: 0;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
  padding: $spacing-medium;
}

.section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section__title {
  font-size: $font-size-xlarge;
  font-weight: bold;
  margin-bottom: $spacing-medium;
  text-align: center;
  color: $primary-color;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.cards {
  display: column;
  justify-content: center;
  grid-template-columns: repeat(1, 1fr);
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: $spacing-medium;
  padding-bottom: $spacing-small;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2%;
  background: $background-color;
  border-radius: $border-radius;
  padding: $spacing-medium;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: $text-color;
  text-decoration: none;
  box-shadow: $box-shadow;
  min-width: 160px;
  max-width: 200px;
  height: auto;
  scroll-snap-align: start;
}

.card__image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid $text-color;
}

.card__name {
  margin-top: $spacing-small;
  font-size: $font-size-large;
  font-weight: 600;
  color: $text-color;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

@media (min-width: $desktop) {
  .cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-large;
    justify-content: center;
  }

  .card {
    min-width: auto;
    max-width: 250px;
  }
}

@media (min-width: $laptop) {
  .cards {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
