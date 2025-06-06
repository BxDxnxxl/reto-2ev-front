<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Carrousel from '@/components/Carrousel.vue'
import MainCard from '@/components/MainCard.vue'
import Swal from 'sweetalert2'
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { usePublicacionesEmpresasStore } from '@/stores/publicacionesEmpresasStore'

const usersStore = useUsersStore()
const publicacionesStore = usePublicacionesEmpresasStore()

const mostrarModal = () => {
  const contenido = publicacionesStore.destacadasNoLeidas.map(pub => {
    return `
      <div class="news-item">
        <div class="news-header">
          <h4 class="news-title">${pub.titulo}</h4>
          <span class="news-badge">🔥 Destacada</span>
        </div>
        <p class="news-content">${pub.contenido}</p>
        <button onclick="window.marcarNoticiaLeida(${pub.id})" class="news-read-btn">
          <span class="btn-icon">✅</span>
          Marcar como leída
        </button>
      </div>
    `
  }).join('')

  Swal.fire({
    title: '<div class="modal-title"><span class="notification-icon">🔔</span>Noticias Destacadas</div>',
    html: `
      <div class="news-container">
        ${contenido}
      </div>
      <style>
        .modal-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 600;
          color: #f25421;
        }
        
        .notification-icon {
          animation: shake 0.5s infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        
        .news-container {
          max-height: 400px;
          overflow-y: auto;
          padding: 10px;
        }
        
        .news-item {
          background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
          border: 1px solid #f25421;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          text-align: left;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .news-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #f25421, #ff8c00, #ffd700);
        }
        
        .news-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(242, 84, 33, 0.2);
        }
        
        .news-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 10px;
        }
        
        .news-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
          flex: 1;
        }
        
        .news-badge {
          background: linear-gradient(45deg, #f25421, #ff8c00);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .news-content {
          color: #cccccc;
          line-height: 1.5;
          margin: 12px 0;
          font-size: 0.95rem;
        }
        
        .news-read-btn {
          background: linear-gradient(45deg, #f25421, #ff8c00);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          margin-top: 12px;
        }
        
        .news-read-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(242, 84, 33, 0.4);
        }
        
        .btn-icon {
          transition: transform 0.3s ease;
        }
        
        .news-read-btn:hover .btn-icon {
          transform: scale(1.2);
        }
        
        .swal2-popup {
          background: #272727 !important;
          color: #ffffff !important;
          border: 1px solid #f25421 !important;
          border-radius: 16px !important;
        }
        
        .swal2-title {
          color: #ffffff !important;
        }
      </style>
    `,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: { 
      popup: 'swal2-news-popup',
      title: 'swal2-custom-title'
    },
    width: '600px'
  })
}

const marcarNoticiaLeida = async (idPublicacion: number) => {
  const idUsuario = usersStore.currentUser?.id
  if (!idUsuario) return

  await publicacionesStore.marcarPublicacionComoLeida(idUsuario, idPublicacion)

  if (publicacionesStore.destacadasNoLeidas.length === 0) {
    Swal.close()
  } else {
    mostrarModal()
  }
}

onMounted(async () => {
  const idUsuario = usersStore.currentUser?.id
  if (!idUsuario) return

  ;(window as any).marcarNoticiaLeida = marcarNoticiaLeida

  await publicacionesStore.fetchPublicacionesDestacadasNoLeidas(idUsuario)

  if (publicacionesStore.destacadasNoLeidas.length > 0) {
    mostrarModal()
  }
})
</script>

<template>
  <div class="home-view">
    <Header />
    
    <!-- Background decorativo -->
    <div class="home-view__background">
      <div class="home-view__gradient home-view__gradient--primary"></div>
      <div class="home-view__gradient home-view__gradient--secondary"></div>
      <div class="home-view__gradient home-view__gradient--accent"></div>
    </div>
    
    <main class="home-view__content">
      <div class="home-view__container">
        <!-- Sección del carrousel con mejor presentación -->
        <section class="home-section">
          <div class="home-section__header">
            <div class="home-section__line"></div>
            <h2 class="home-section__title">Destacados</h2>
            <div class="home-section__line"></div>
          </div>
          <div class="home-section__wrapper">
            <Carrousel />
          </div>
        </section>

        <!-- Sección de contenido principal -->
        <section class="home-section">
          <div class="home-section__header">
            <div class="home-section__line"></div>
            <h2 class="home-section__title">Contenido Principal</h2>
            <div class="home-section__line"></div>
          </div>
          <div class="home-section__wrapper">
            <MainCard />
          </div>
        </section>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: $background-color;
  overflow-x: hidden;
}

// Background decorativo
.home-view__background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.home-view__gradient {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.1;
  animation: float 8s ease-in-out infinite;

  &--primary {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, $primary-color, transparent);
    top: 10%;
    left: -10%;
    animation-delay: 0s;
  }

  &--secondary {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, #ff8c00, transparent);
    top: 60%;
    right: -10%;
    animation-delay: 2s;
  }

  &--accent {
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, #ffd700, transparent);
    bottom: 20%;
    left: 50%;
    animation-delay: 4s;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

.home-view__content {
  flex: 1;
  position: relative;
  z-index: 2;
  padding: $spacing-xl 0;
}

.home-view__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-large;
}

// Secciones mejoradas
.home-section {
  margin-bottom: $spacing-xxl;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.home-section__header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-xl;
  gap: $spacing-large;
}

.home-section__line {
  height: 2px;
  background: linear-gradient(90deg, transparent, $primary-color, transparent);
  flex: 1;
  max-width: 200px;
}

.home-section__title {
  font-family: $font-family-title;
  font-size: $font-size-xlarge;
  font-weight: 600;
  color: $text-color;
  text-align: center;
  position: relative;
  background: $primary-gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 8px;
    height: 8px;
    background: $primary-color;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  &::before {
    left: -20px;
    animation-delay: 0s;
  }
  
  &::after {
    right: -20px;
    animation-delay: 1s;
  }
}

// Wrappers con efectos
.home-section__wrapper {
  position: relative;
  border-radius: $border-radius;
  overflow: hidden;
  background: rgba($card-background, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba($primary-color, 0.1);
  padding: $spacing-large;
  transition: $transition;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: $primary-gradient;
    opacity: 0.5;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba($primary-color, 0.1);
    border-color: rgba($primary-color, 0.3);
  }
}

// Responsive Design
@media (max-width: $laptop) {
  .home-view__container {
    max-width: 100%;
    padding: 0 $spacing-medium;
  }
  
  .home-section__header {
    margin-bottom: $spacing-large;
    gap: $spacing-medium;
  }
  
  .home-section__line {
    max-width: 150px;
  }
  
  .home-section__title {
    font-size: $font-size-large;
    
    &::before,
    &::after {
      display: none;
    }
  }
}

@media (max-width: $desktop) {
  .home-view__content {
    padding: $spacing-large 0;
  }
  
  .home-view__container {
    padding: 0 $spacing-medium;
  }
  
  .home-section__wrapper {
    padding: $spacing-medium;
  }
  
  .home-section {
    margin-bottom: $spacing-xl;
  }
  
  .home-view__gradient {
    &--primary {
      width: 300px;
      height: 300px;
    }
    
    &--secondary {
      width: 200px;
      height: 200px;
    }
    
    &--accent {
      width: 150px;
      height: 150px;
    }
  }
}

@media (max-width: 480px) {
  .home-section__header {
    flex-direction: column;
    gap: $spacing-small;
  }
  
  .home-section__line {
    width: 80px;
    max-width: none;
  }
  
  .home-section__title {
    font-size: $font-size-base;
  }
  
  .home-section__wrapper {
    padding: $spacing-medium;
    margin: 0 -#{$spacing-small};
  }
}

// Animación de pulso
@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: translateY(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateY(-50%) scale(1.3);
  }
}
</style>