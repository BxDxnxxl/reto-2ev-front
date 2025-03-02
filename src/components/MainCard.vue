<script setup>
import { ref, onMounted } from "vue";
import { useCompaniesStore } from "@/stores/compañia";
import { useGenresStore } from "@/stores/generos";

const companiesStore = useCompaniesStore();
const genresStore = useGenresStore();

const top5Companias = ref([]);
const top5Generos = ref([]);

onMounted(async () => {
  await companiesStore.fetchTop5Companies();
  await genresStore.fetchTop5Genres();
  top5Companias.value = companiesStore.top5Companias;
  top5Generos.value = genresStore.top5Generos;
});
</script>

<template>
    <div class="cards-container">
      <div class="section">
        <h2 class="section__title">Compañías Populares</h2>
        <div class="cards">
          <router-link v-for="compania in top5Companias" :key="compania.id" to="/catalog" class="card">
            <img :src="compania.url_imagen" :alt="compania.nombre" class="card__image" />
            <p class="card__name">{{ compania.nombre }}</p>
          </router-link>
        </div>
      </div>
  
      <div class="section">
        <h2 class="section__title">Géneros Populares</h2>
        <div class="cards">
          <router-link v-for="genero in top5Generos" :key="genero.id" to="/catalog" class="card">
            <img :src="genero.url_imagen" :alt="genero.nombre" class="card__image" />
            <p class="card__name">{{ genero.nombre }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <style lang="scss" scoped>
  .cards-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1rem;
  }
  
  .section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .section__title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
    width: 100%;
    max-width: 768px;
  }
  
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #272727;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    transition: transform 0.3s ease;
    color: white;
    text-decoration: none;
  
    &:hover {
      transform: scale(1.05);
    }
  }
  
  .card__image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
  }
  
  .card__name {
    margin-top: 0.5rem;
    font-size: 1rem;
  }
  
  @media (min-width: 768px) {
    .cards-container {
      flex-direction: row;
      justify-content: center;
      gap: 4rem;
    }
  
    .cards {
      grid-template-columns: repeat(5, 1fr);
      max-width: none;
    }
  }
  </style>
  