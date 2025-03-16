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
  width: 100%;
}

.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $spacing-medium;
  width: 100%;
  max-width: 900px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(200px, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, minmax(180px, 1fr));
  }
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $background-color;
  border-radius: $border-radius;
  padding: $spacing-medium;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: $text-color;
  text-decoration: none;
  box-shadow: $box-shadow;
  width: 100%;
  max-width: 180px;
  aspect-ratio: 1/1;
  justify-self: center;
  min-height: 180px;
}

.card__image {
  width: 80px;
  height: 80px;
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
  max-width: 90%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
}

@media (min-width: 768px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
  }
}

@media (min-width: 1024px) {
  .cards {
    grid-template-columns: repeat(5, 1fr);
    width: 100%;
  }

  .card {
    max-width: 180px;
  }
}

</style>
