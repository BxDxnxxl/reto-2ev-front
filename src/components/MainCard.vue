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
    <!-- Sección de Géneros Populares -->
    <div class="section">
      <h2 class="section__title">Géneros Populares</h2>
      <div class="cards">
        <router-link v-for="genero in top5Generos" :key="genero.id" to="/catalog" class="card">
          <img :src="genero.url_imagen" :alt="genero.nombre" class="card__image" />
          <p class="card__name">{{ genero.nombre }}</p>
        </router-link>
      </div>
    </div>

    <!-- Sección de Compañías Populares -->
    <div class="section">
      <h2 class="section__title">Compañías Populares</h2>
      <div class="cards">
        <router-link v-for="compania in top5Companias" :key="compania.id" to="/catalog" class="card">
          <img :src="compania.url_imagen" :alt="compania.nombre" class="card__image" />
          <p class="card__name">{{ compania.nombre }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cards-container {
  display: flex;
  flex-direction: column;
  gap: 3rem; 
  padding: 1rem;
}

.section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section__title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #f25421;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}


.cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr); 
  gap: 1.5rem;
  width: 100%;
  justify-content: center;
  padding: 20px;

}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #272727;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: #e0e0e0;
  text-decoration: none;
  box-shadow: 0 2rem 3rem rgba(0, 0, 0, 0.3);
  min-width: 160px; 
  height: auto; 
  flex-shrink: 0; 
}

.card__image {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #ffffff;
}

.card__name {
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: #ffffff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}


@media (max-width: 1024px) {
  .cards {
    display: flex;
    flex-wrap: nowrap; 
    overflow-x: scroll; 
    gap: 1.5rem;
    padding-bottom: 1rem;
    scroll-snap-type: x mandatory; 
  }

  .card {
    scroll-snap-align: start; 
    min-width: 200px; 
  }
}

@media (max-width: 480px) {
  .cards {
    gap: 1rem;
  }
}
</style>
