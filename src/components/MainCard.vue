<script setup>
import { ref, onMounted } from 'vue'
import { useCompaniesStore } from '@/stores/compañia'
import { useGenresStore } from '@/stores/generos'

const companiesStore = useCompaniesStore()
const genresStore = useGenresStore()

const top5Companias = ref([])
const top5Generos = ref([])
const isLoading = ref(true)

const genresVisible = ref(false)
const companiesVisible = ref(false)

onMounted(async () => {
  try {
    await companiesStore.fetchTop5Companies()
    await genresStore.fetchTop5Genres()
    top5Companias.value = companiesStore.top5Companias
    top5Generos.value = genresStore.top5Generos
    
    setTimeout(() => {
      genresVisible.value = true
      setTimeout(() => {
        companiesVisible.value = true
      }, 300)
    }, 100)
    
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="cards-container">
    <div v-if="isLoading" class="loading-container">
      <div class="skeleton-section" v-for="i in 2" :key="i">
        <div class="skeleton-title"></div>
        <div class="skeleton-cards">
          <div class="skeleton-card" v-for="j in 5" :key="j"></div>
        </div>
      </div>
    </div>

    <template v-else>
      <div 
        class="section" 
        :class="{ 'section--visible': genresVisible }"
      >
        <div class="section__header">
          <h2 class="section__title">
            <span class="section__title-text">Géneros Populares</span>
            <div class="section__title-decoration">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
          </h2>
          <p class="section__subtitle">Explora los géneros más populares del momento</p>
        </div>
        
        <div class="cards">
          <router-link 
            v-for="(genero, index) in top5Generos" 
            :key="genero.id" 
            to="/catalog" 
            class="card"
            :style="{ '--delay': `${index * 0.1}s` }"
          >
            <div class="card__image-container">
              <img :src="`${genero.urlImagen}`" :alt="genero.nombre" class="card__image" />
              <div class="card__image-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div class="card__content">
              <h3 class="card__name">{{ genero.nombre }}</h3>
              <div class="card__stats">
                <span class="card__stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Popular
                </span>
              </div>
            </div>
            <div class="card__shine"></div>
          </router-link>
        </div>
      </div>

      <div 
        class="section" 
        :class="{ 'section--visible': companiesVisible }"
      >
        <div class="section__header">
          <h2 class="section__title">
            <span class="section__title-text">Compañías Populares</span>
            <div class="section__title-decoration">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </h2>
          <p class="section__subtitle">Descubre las desarrolladoras más reconocidas</p>
        </div>
        
        <div class="cards">
          <router-link
            v-for="(compania, index) in top5Companias"
            :key="compania.id"
            to="/catalog"
            class="card"
            :style="{ '--delay': `${index * 0.1}s` }"
          >
            <div class="card__image-container">
              <img :src="`${compania.urlImagen}`" :alt="compania.nombre" class="card__image" />
              <div class="card__image-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div class="card__content">
              <h3 class="card__name">{{ compania.nombre }}</h3>
              <div class="card__stats">
                <span class="card__stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                  Top Studio
                </span>
              </div>
            </div>
            <div class="card__shine"></div>
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 3rem;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.skeleton-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.skeleton-title {
  width: 300px;
  height: 40px;
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 8px;
}

.skeleton-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.skeleton-card {
  height: 250px;
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 16px;
}

.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  &--visible {
    opacity: 1;
    transform: translateY(0);
  }
}

.section__header {
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
}

.section__title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 2.5rem;
  font-weight: 800;
  font-family: $font-family-title;
  margin-bottom: 1rem;
  color: transparent;
  background: $primary-gradient;
  background-clip: text;
  -webkit-background-clip: text;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: $primary-gradient;
    border-radius: 2px;
    animation: expandWidth 1s ease-out 0.5s backwards;
  }
}

.section__title-decoration {
  color: $primary-color;
  animation: pulse 2s ease-in-out infinite;
}

.section__subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
  }
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.8), rgba(20, 20, 20, 0.9));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  text-decoration: none;
  color: $text-color;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) var(--delay, 0s) forwards;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(242, 84, 33, 0.1), rgba(255, 140, 0, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 20px;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(242, 84, 33, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: rgba(242, 84, 33, 0.3);
    
    &::before {
      opacity: 1;
    }
    
    .card__image {
      transform: scale(1.1);
    }
    
    .card__image-overlay {
      opacity: 1;
    }
    
    .card__shine {
      transform: translateX(100%);
    }
  }
}

.card__image-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, $primary-color, #ff8c00);
  padding: 4px;
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, $primary-color, #ff8c00, #ffd700);
    border-radius: 50%;
    z-index: -1;
    animation: rotate 3s linear infinite;
  }
}

.card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: $card-background;
}

.card__image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(242, 84, 33, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.card__content {
  text-align: center;
  flex: 1;
}

.card__name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.3;
}

.card__stats {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.card__stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(242, 84, 33, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid rgba(242, 84, 33, 0.3);
  
  svg {
    opacity: 0.8;
  }
}

.card__shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: transform 0.6s ease;
  pointer-events: none;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes expandWidth {
  from {
    width: 0;
  }
  to {
    width: 100px;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .cards {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
  
  .section__title {
    font-size: 1.8rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .card {
    padding: 1.25rem;
  }
  
  .card__image-container {
    width: 80px;
    height: 80px;
  }
  
  .card__name {
    font-size: 1.1rem;
  }
}
</style>