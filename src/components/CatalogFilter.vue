<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useGenresStore } from '@/stores/generos'
import { usePlatformsStore } from '@/stores/plataforma'
import { useCompaniesStore } from '@/stores/compañia'

const genresStore = useGenresStore()
const platformsStore = usePlatformsStore()
const companiesStore = useCompaniesStore()

const selectedFilter = ref({ type: '', value: '' })

// Cargar datos al montar el componente
onMounted(() => {
  genresStore.fetchGenres()
  platformsStore.fetchPlatforms()
  companiesStore.fetchCompanies()
})
</script>


<template>
  <div class="catalog">
    <div class="catalog__filters">
      <div class="filter">
        <button class="filter__button">Géneros</button>
        <div class="filter__dropdown">
          <label v-for="genre in genresStore.generos" :key="genre.id" class="filter__label">
            <input
              type="radio"
              name="filter"
              @change="selectedFilter = { type: 'genero', value: genre.name }"
            />
            {{ genre.name }}
          </label>
        </div>
      </div>

      <div class="filter">
        <button class="filter__button">Plataformas</button>
        <div class="filter__dropdown">
          <label v-for="platform in platformsStore.plataforams" :key="platform.id" class="filter__label">
            <input
              type="radio"
              name="filter"
              @change="selectedFilter = { type: 'plataforma', value: platform.name }"
            />
            {{ platform.name }}
          </label>
        </div>
      </div>

      <div class="filter">
        <button class="filter__button">Compañías</button>
        <div class="filter__dropdown">
          <label v-for="company in companiesStore.companias" :key="company.id" class="filter__label">
            <input
              type="radio"
              name="filter"
              @change="selectedFilter = { type: 'compañia', value: company.name }"
            />
            {{ company.name }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
$color-bg: #272727;
$color-text: #ffffff;
$color-primary: #f25421;
$box-shadow: 0 2rem 3rem rgba(0, 0, 0, 0.3);

.catalog {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1rem;
}

.catalog__search {
  width: 100%;
  max-width: 600px;
  margin-bottom: 1rem;
}

.catalog__search-input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  background-color: $color-bg;
  color: $color-text;
  box-shadow: $box-shadow;
}

.catalog__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
  justify-content: flex-start;
}

.filter {
  position: relative;
}

.filter__button {
  background-color: $color-primary;
  color: $color-text;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.filter__dropdown {
  display: none;
  position: absolute;
  background-color: $color-bg;
  min-width: 200px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 5px;
  z-index: 1;
}

.filter:hover .filter__dropdown {
  display: block;
}

.filter__label {
  display: block;
  color: $color-text;
  padding: 5px;
}

@media (min-width: 768px) {
  .catalog {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .catalog__search {
    width: 50%;
    margin-bottom: 0;
    text-align: center;
  }

  .catalog__filters {
    flex-direction: row;
    width: auto;
  }
}

@media (min-width: 1024px) {
  .catalog__search {
    width: 40%;
  }

  .catalog__filters {
    justify-content: flex-start;
  }
}
</style>
