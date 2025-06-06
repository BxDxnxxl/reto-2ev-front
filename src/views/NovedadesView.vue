<script setup lang="ts">
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import NovedadesBlogComponent from "@/components/NovedadesList.vue";
</script>

<template>
  <div class="novedades-view">
    <Header />
    

    <section class="novedades-hero">
      <div class="novedades-hero__container">
        <div class="novedades-hero__content">
          <h1 class="novedades-hero__title">Novedades</h1>
          <p class="novedades-hero__subtitle">
            Mantente al día con las últimas noticias y actualizaciones
          </p>
          <div class="novedades-hero__decoration"></div>
        </div>
      </div>
    </section>

    <main class="novedades-view__contenido">
      <div class="novedades-view__container">
        <NovedadesBlogComponent />
      </div>
    </main>
    
    <Footer />
  </div>
</template>
<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.novedades-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: $background-color;

  &__contenido {
    flex: 1;
    padding: $spacing-large 0; 
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, $primary-color, transparent);
    }
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-large;
  }
}

.novedades-hero {
  background: linear-gradient(135deg, $secondary-color 0%, #1a1a1a 100%);
  padding: calc($spacing-xxl + 2rem) 0 $spacing-large 0; 
  margin-top: 9rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(242, 84, 33, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-large;
    position: relative;
    z-index: 2;
  }

  &__content {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
  }

  &__title {
    font-family: $font-family-title;
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    color: $text-color;
    margin-bottom: $spacing-large;
    position: relative;
    
    background: $primary-gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background: $primary-gradient;
      border-radius: 2px;
    }
  }

  &__subtitle {
    font-size: $font-size-large;
    color: rgba($text-color, 0.8);
    line-height: 1.6;
    margin-bottom: $spacing-xl;
    font-weight: 300;
  }

  &__decoration {
    display: flex;
    justify-content: center;
    gap: $spacing-small;
    
    &::before,
    &::after {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: $primary-color;
      animation: pulse 2s infinite;
    }
    
    &::before {
      animation-delay: 0s;
    }
    
    &::after {
      animation-delay: 1s;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}


@media (max-width: $desktop) {
  .novedades-hero {
    padding: calc($spacing-xl + 1.5rem) 0 $spacing-medium 0;
    margin-top: 6rem;
    
    &__title {
      margin-bottom: $spacing-medium;
    }
    
    &__subtitle {
      font-size: $font-size-base;
      margin-bottom: $spacing-large;
    }
  }
  
  .novedades-view {
    &__contenido {
      padding: $spacing-medium 0; 
    }
    
    &__container {
      padding: 0 $spacing-medium;
    }
  }
}

@media (max-width: 480px) {
  .novedades-hero {
    margin-top: 4rem;
    padding: calc($spacing-large + 1rem) 0 $spacing-small 0; 
    
    &__container,
    .novedades-view__container {
      padding: 0 $spacing-medium;
    }
  }
  
  .novedades-view {
    &__contenido {
      padding: $spacing-small 0; 
    }
  }
}
</style>