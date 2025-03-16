<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useGenresStore } from '@/stores/generos'
import { usePlatformsStore } from '@/stores/plataforma'
import { useCompaniesStore } from '@/stores/compañia'
import { useGamesStore } from '@/stores/games'

const genresStore = useGenresStore()
const platformsStore = usePlatformsStore()
const companiesStore = useCompaniesStore()
const gamesStore = useGamesStore()

const selectedGenre = ref('')
const selectedPlatform = ref('')
const selectedCompany = ref('')

onMounted(() => {
  genresStore.fetchGenres()
  platformsStore.fetchPlatforms()
  companiesStore.fetchCompanies()
})

//función para que aplique los filtros
function applyFilters() {
  gamesStore.filtrarVideojuegos(
    selectedCompany.value || null,
    selectedGenre.value || null,
    selectedPlatform.value || null
  )
}

//cada cambiio de filtro, se llama a la funciónde la llamada para que pille bien los filtros
watch(selectedGenre, () => applyFilters())
watch(selectedPlatform, () => applyFilters())
watch(selectedCompany, () => applyFilters())

function clearFilters() {
  selectedGenre.value = ''
  selectedPlatform.value = ''
  selectedCompany.value = ''
  gamesStore.clearFilters()
}
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
              name="genreFilter"
              :checked="selectedGenre === genre.nombre"
              @change="selectedGenre = genre.nombre"
            />
            {{ genre.nombre }}
          </label>
        </div>
      </div>

      <div class="filter">
        <button class="filter__button">Plataformas</button>
        <div class="filter__dropdown">
          <label
            v-for="platform in platformsStore.plataforams"
            :key="platform.id"
            class="filter__label"
          >
            <input
              type="radio"
              name="platformFilter"
              :checked="selectedPlatform === platform.nombre"
              @change="selectedPlatform = platform.nombre"
            />
            {{ platform.nombre }}
          </label>
        </div>
      </div>

      <div class="filter">
        <button class="filter__button">Compañías</button>
        <div class="filter__dropdown">
          <label
            v-for="company in companiesStore.companias"
            :key="company.id"
            class="filter__label"
          >
            <input
              type="radio"
              name="companyFilter"
              :checked="selectedCompany === company.nombre"
              @change="selectedCompany = company.nombre"
            />
            {{ company.nombre }}
          </label>
        </div>
      </div>

      <button class="filter__clear" @click="clearFilters">Eliminar filtros</button>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

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
  background-color: $background-color;
  color: $text-color;
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
  background-color: $primary-color;
  color: $text-color;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.filter__dropdown {
  display: none;
  position: absolute;
  background-color: $background-color;
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
  color: $text-color;
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
