<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useGamesStore } from '@/stores/games'

const currentSlide = ref(0)
const store = useGamesStore()
let interval: number | null = null
const isTransitioning = ref(false)

onMounted(() => {
  store.fetchTop5Videojuegos()
  startAutoPlay()
})

const startAutoPlay = () => {
  interval = setInterval(() => {
    nextSlide()
  }, 7000)
}

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

function showSlide(index: number) {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentSlide.value = index
  setTimeout(() => {
    isTransitioning.value = false
  }, 500)
}

function nextSlide() {
  if (store.top5Videojuegos.length > 0 && !isTransitioning.value) {
    showSlide((currentSlide.value + 1) % store.top5Videojuegos.length)
  }
}

function prevSlide() {
  if (store.top5Videojuegos.length > 0 && !isTransitioning.value) {
    showSlide(currentSlide.value === 0 ? store.top5Videojuegos.length - 1 : currentSlide.value - 1)
  }
}
</script>

<template>
  <section class="carousel">
    <button
      @click="prevSlide"
      class="carousel__nav carousel__nav--prev"
      :disabled="isTransitioning"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div class="carousel__main">
      <div class="carousel__background">
        <img
          :src="store.top5Videojuegos[currentSlide]?.caratula"
          alt="Background blur"
          class="carousel__background-image"
        />
      </div>

      <img
        :src="store.top5Videojuegos[currentSlide]?.caratula"
        alt="Imagen principal"
        class="carousel__image"
        :class="{ 'carousel__image--transitioning': isTransitioning }"
      />

      <div class="carousel__overlay"></div>

      <div class="carousel__info">
        <div class="carousel__content">
          <h3 class="carousel__title">{{ store.top5Videojuegos[currentSlide]?.titulo }}</h3>
          <p class="carousel__description">
            Descubre este increíble videojuego y sumérgete en una experiencia única
          </p>
          <router-link
            v-if="store.top5Videojuegos.length"
            :to="`/detalleVideojuego?id=${store.top5Videojuegos[currentSlide]?.id}`"
            class="carousel__button"
          >
            <span>Ver Más</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </router-link>
        </div>
      </div>

      <div class="carousel__progress">
        <div
          class="carousel__progress-bar"
          :style="{ animationDuration: '7s' }"
          :key="currentSlide"
        ></div>
      </div>
    </div>

    <button
      @click="nextSlide"
      class="carousel__nav carousel__nav--next"
      :disabled="isTransitioning"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div class="carousel__thumbnails">
      <div class="carousel__thumbnail-container">
        <div
          v-for="(videojuego, index) in store.top5Videojuegos"
          :key="index"
          @click="showSlide(index)"
          class="carousel__thumbnail-wrapper"
          :class="{ active: index === currentSlide }"
        >
          <img :src="videojuego.caratula" :alt="videojuego.titulo" class="carousel__thumbnail" />
          <div class="carousel__thumbnail-overlay">
            <div class="carousel__thumbnail-play">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="carousel__dots">
      <button
        v-for="(_, index) in store.top5Videojuegos"
        :key="index"
        @click="showSlide(index)"
        class="carousel__dot"
        :class="{ active: index === currentSlide }"
      ></button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.carousel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 40px;
  padding: 0 20px;
}

.carousel__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover:not(:disabled) {
    background: rgba(242, 84, 33, 0.8);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 8px 25px rgba(242, 84, 33, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--prev {
    left: 20px;
  }

  &--next {
    right: 20px;
  }
}

.carousel__main {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 500px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  background: $card-background;
}

.carousel__background {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  z-index: 0;

  &-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(20px) brightness(0.3);
    transform: scale(1.1);
  }
}

.carousel__image {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &--transitioning {
    transform: scale(1.05);
  }
}

.carousel__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(30, 30, 30, 0.8) 100%
  );
  z-index: 2;
}

.carousel__info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  padding: 40px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    transparent 100%
  );
}

.carousel__content {
  max-width: 500px;
  animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel__title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  font-family: $font-family-title;
  margin-bottom: 12px;
  line-height: 1.2;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.carousel__description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 24px;
  line-height: 1.6;
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
}

.carousel__button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, $primary-color, darken($primary-color, 10%));
  color: white;
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(242, 84, 33, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 12px 35px rgba(242, 84, 33, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);

    &::before {
      left: 100%;
    }
  }
}

.carousel__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 4;

  &-bar {
    height: 100%;
    background: linear-gradient(90deg, $primary-color, #ff8c00);
    width: 0;
    animation: progress 7s linear;
  }
}

.carousel__thumbnails {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  width: 100%;
  overflow-x: auto;
  padding: 10px 0;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: $primary-color;
    border-radius: 2px;
  }
}

.carousel__thumbnail-container {
  display: flex;
  gap: 12px;
  padding: 0 20px;
}

.carousel__thumbnail-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 25px rgba(242, 84, 33, 0.3);
  }

  &.active {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 25px rgba(242, 84, 33, 0.5);

    .carousel__thumbnail-overlay {
      opacity: 1;
    }
  }
}

.carousel__thumbnail {
  width: 90px;
  height: 60px;
  object-fit: cover;
  transition: transform 0.3s ease;

  @media (min-width: 768px) {
    width: 110px;
    height: 75px;
  }
}

.carousel__thumbnail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(242, 84, 33, 0.8), rgba(255, 140, 0, 0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.carousel__thumbnail-play {
  color: white;
  animation: pulse 2s infinite;
}

.carousel__dots {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.carousel__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.active {
    background: $primary-color;
    transform: scale(1.2);
    box-shadow: 0 0 12px rgba(242, 84, 33, 0.5);
  }

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.6);
    transform: scale(1.1);
  }
}

// Animations
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes progress {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

// Responsive design
@media (max-width: 768px) {
  .carousel {
    padding: 0 10px;
  }

  .carousel__main {
    height: 350px;
  }

  .carousel__nav {
    width: 40px;
    height: 40px;

    &--prev {
      left: 10px;
    }

    &--next {
      right: 10px;
    }
  }

  .carousel__info {
    padding: 20px;
  }

  .carousel__button {
    padding: 12px 24px;
    font-size: 1rem;
  }

  .carousel__thumbnail {
    width: 70px;
    height: 50px;
  }
}

@media (min-width: 1200px) {
  .carousel__main {
    height: 600px;
  }

  .carousel__title {
    font-size: 3rem;
  }
}
</style>