<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGamesStore } from '@/stores/games'

const route = useRoute()
const games = useGamesStore()

onMounted(() => {
  games.fetchVideojuegos(true)
})
</script>

<template>
  <div class="games-grid" id="obras-container">
    <router-link 
      v-for="game in games.games" 
      :key="game.id"
      :to="`/detalleVideojuego?id=${game.id}`"
      class="game-card"
    >
      <div class="game-card-image">
        <img :src="game.caratula" :alt="game.titulo" />
        <div class="game-card-overlay">
          <span class="view-details">Ver detalles</span>
        </div>
      </div>
      <div class="game-card-info">
        <h3 class="game-title">{{ game.titulo }}</h3>
        <div class="game-card-footer">
          <span class="year-badge">{{ new Date(game.anioSalida).getFullYear() }}</span>
          <span class="pegi-badge">PEGI {{ game.pegi }}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.games-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  padding: 1rem;
  margin-bottom: 3rem;
}

.game-card {
  background-color: #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    
    .game-card-overlay {
      opacity: 1;
    }
    
    .game-card-image img {
      transform: scale(1.05);
    }
  }
}

.game-card-image {
  position: relative;
  height: 180px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}

.game-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.view-details {
  background-color: #f25421;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(5px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.game-card-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #e8e8e8;
}

.game-title {
  color: #f25421;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.game-card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.year-badge, .pegi-badge {
  background-color: #f25421;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.year-badge {
  background-color: #00aa6c;
}

@media (min-width: 768px) {
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  .game-card-image {
    height: 200px;
  }
}

@media (min-width: 1024px) {
  .games-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    padding: 2rem;
  }
}

@media (min-width: 1440px) {
  .games-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>