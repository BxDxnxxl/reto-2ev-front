<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePublicacionesEmpresasStore } from '@/stores/publicacionesEmpresasStore';
import { useUsersStore } from '@/stores/users';
import type { NovedadesDto } from "@/stores/dtos/Novedades.dto";

const publicacionesStore = usePublicacionesEmpresasStore();
const userStore = useUsersStore();

const isModalOpen = ref(false);
  const selectedNovedad = ref<NovedadesDto | null>(null);

onMounted(async () => {
  await publicacionesStore.fetchNovedades();
});

const openModal = (novedad: NovedadesDto ) => {
  selectedNovedad.value = novedad;
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedNovedad.value = null;
  document.body.style.overflow = 'auto';
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

console.log(publicacionesStore.novedades);
</script>

<template>
  <section class="novedades-blog">
    <div class="novedades-blog__background"></div>
    
    <div class="novedades-blog__container">
      <div class="novedades-blog__grid">
        <article
          v-for="(novedad, index) in publicacionesStore.novedades"
          :key="novedad.id"
          class="novedades-blog__card"
          :style="{ '--delay': `${index * 0.1}s` }"
        >
          <div class="novedades-blog__card-shine"></div>
          
          <div class="novedades-blog__card-header">
            <div class="novedades-blog__empresa-info">
              <div class="novedades-blog__logo-container">
                <div class="novedades-blog__logo-ring"></div>
                <img
                  class="novedades-blog__logo"
                  :src="novedad.logoEmpresa"
                  :alt="`Logo de ${novedad.nombreEmpresa}`"
                />
              </div>
              <div class="novedades-blog__empresa-details">
                <h2 class="novedades-blog__empresa-nombre">{{ novedad.nombreEmpresa }}</h2>
                <time class="novedades-blog__fecha"
                  :datetime="new Date(novedad.fechaPublicacion).toISOString()"
                >
                  <i class="mdi mdi-calendar-outline"></i>
                  {{ new Date(novedad.fechaPublicacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) }}
                </time>
              </div>
            </div>
          </div>

          <div class="novedades-blog__content">
            <h3 class="novedades-blog__titulo-noticia">{{ novedad.titulo }}</h3>
            
            <div class="novedades-blog__main-content">
              <div class="novedades-blog__imagen-container">
                <img 
                  :src="novedad.imagen" 
                  :alt="`Imagen de ${novedad.titulo}`" 
                  class="novedades-blog__imagen" 
                />
                <div class="novedades-blog__imagen-overlay"></div>
              </div>
              
              <div class="novedades-blog__texto-wrapper">
                <div class="novedades-blog__texto-content">
                  <p class="novedades-blog__resumen">{{ novedad.contenido }}</p>
                </div>
                <div class="novedades-blog__read-more" @click="openModal(novedad)">
                  <span>Leer más</span>
                  <i class="mdi mdi-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>

          <footer class="novedades-blog__card-footer">
            <div class="novedades-blog__contacto">
              <div class="novedades-blog__contacto-info">
                <span class="novedades-blog__contacto-label">
                  <i class="mdi mdi-email-outline"></i>
                  Contacto
                </span>
                <a 
                  :href="`mailto:${novedad.emailUsuario}`" 
                  class="novedades-blog__contacto-email"
                >
                  {{ novedad.emailUsuario }}
                </a>
              </div>
            </div>

            <v-btn
              v-if="userStore.currentUser?.id === novedad.id"
              color="error"
              variant="outlined"
              size="small"
              class="novedades-blog__btn-eliminar"
              @click="$emit('eliminar', novedad.id)"
            >
              <v-icon start>mdi-delete</v-icon>
              Eliminar
            </v-btn>
          </footer>
        </article>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isModalOpen && selectedNovedad" class="modal-overlay" @click="closeModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <div class="modal-header__content">
                <div class="modal-logo-container">
                  <div class="modal-logo-ring"></div>
                  <img
                    class="modal-logo"
                    :src="selectedNovedad.logoEmpresa"
                    :alt="`Logo de ${selectedNovedad.nombreEmpresa}`"
                  />
                </div>
                <div class="modal-header__info">
                  <h2 class="modal-empresa-nombre">{{ selectedNovedad.nombreEmpresa }}</h2>
                  <time class="modal-fecha">
                    <i class="mdi mdi-calendar-outline"></i>
                    {{ new Date(selectedNovedad.fechaPublicacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) }}
                  </time>
                </div>
              </div>
              <button class="modal-close-btn" @click="closeModal">
                <i class="mdi mdi-close"></i>
              </button>
            </div>

            <div class="modal-content">
              <h1 class="modal-title">{{ selectedNovedad.titulo }}</h1>
              
              <div class="modal-image-container" v-if="selectedNovedad.imagen">
                <img 
                  :src="selectedNovedad.imagen" 
                  :alt="`Imagen de ${selectedNovedad.titulo}`" 
                  class="modal-image"
                />
              </div>

              <div class="modal-text">
                <p>{{ selectedNovedad.contenido }}</p>
              </div>

              <div class="modal-footer">
                <div class="modal-contact">
                  <span class="modal-contact-label">
                    <i class="mdi mdi-email-outline"></i>
                    Contacto:
                  </span>
                  <a 
                    :href="`mailto:${selectedNovedad.emailUsuario}`" 
                    class="modal-contact-email"
                  >
                    {{ selectedNovedad.emailUsuario }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped lang="scss">
@import "@/assets/styles/variables.scss";

@mixin card-hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba($primary-color, 0.3), 
              0 0 0 1px rgba($primary-color, 0.4);
}

@mixin text-gradient {
  background: $primary-gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@mixin glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.novedades-blog {
  background: $background-color;
  min-height: 100vh;
  padding: $spacing-xl $spacing-medium;
  position: relative;
  overflow: hidden;

  &__background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba($primary-color, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(#ff8c00, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(#ffd700, 0.05) 0%, transparent 50%);
    animation: backgroundPulse 8s ease-in-out infinite alternate;
    z-index: -1;
  }

  &__container {
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  &__titulo {
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 900;
    margin-bottom: $spacing-medium;
    line-height: 1.1;

    &-highlight {
      @include text-gradient;
      display: block;
      animation: titleFloat 3s ease-in-out infinite alternate;
    }

    &-accent {
      color: $text-color;
      display: block;
      opacity: 0.9;
      font-weight: 300;
    }
  }

  &__subtitulo {
    font-size: clamp(1rem, 2vw, 1.25rem);
    color: lighten($primary-color, 20%);
    font-weight: 300;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  &__grid {
    display: grid;
    gap: $spacing-xl;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  }

  &__card {
    @include glass-effect;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    animation: cardSlideIn 0.6s ease-out forwards;
    animation-delay: var(--delay);
    opacity: 0;
    transform: translateY(30px);
    display: flex;
    flex-direction: column;
    min-height: 500px;

    &:hover {
      @include card-hover;
      
      .novedades-blog__card-shine {
        opacity: 1;
        transform: translateX(100%);
      }

      .novedades-blog__imagen {
        transform: scale(1.1);
      }

      .novedades-blog__read-more {
        opacity: 1;
        transform: translateY(0);
      }
    }

    &-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      opacity: 0;
      transition: all 0.6s ease;
      z-index: 1;
      pointer-events: none;
    }
  }

  &__card-header {
    padding: $spacing-xl;
    background: linear-gradient(135deg, rgba($primary-color, 0.1), rgba(#ff8c00, 0.05));
    position: relative;
    flex-shrink: 0;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: $primary-gradient;
    }
  }

  &__empresa-info {
    display: flex;
    align-items: center;
    gap: $spacing-large;
  }

  &__logo-container {
    width: 80px;
    height: 80px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__logo-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(from 0deg, $primary-color, #ff8c00, #ffd700, $primary-color);
    animation: logoRotate 4s linear infinite;
    
    &::after {
      content: '';
      position: absolute;
      inset: 3px;
      border-radius: 50%;
      background: $background-color;
    }
  }

  &__logo {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 50%;
    z-index: 1;
    position: relative;
    transition: transform 0.3s ease;
  }

  &__empresa-details {
    flex: 1;
    min-width: 0;
  }

  &__empresa-nombre {
    font-size: $font-size-xlarge;
    font-weight: 700;
    @include text-gradient;
    margin-bottom: $spacing-small;
    word-wrap: break-word;
  }

  &__fecha {
    font-size: $font-size-small;
    color: lighten($primary-color, 20%);
    display: flex;
    align-items: center;
    gap: $spacing-small;

    i {
      font-size: 16px;
    }
  }

  &__content {
    padding: $spacing-xl;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__titulo-noticia {
    font-size: $font-size-xlarge;
    font-weight: 800;
    color: $text-color;
    margin-bottom: $spacing-large;
    line-height: 1.3;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background: $primary-gradient;
      border-radius: 2px;
    }
  }

  &__main-content {
    display: flex;
    gap: $spacing-large;
    flex: 1;
    min-height: 0;
  }

  &__imagen-container {
    width: 180px;
    height: 140px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    background: linear-gradient(45deg, rgba($primary-color, 0.1), rgba(#ff8c00, 0.1));
    align-self: flex-start;
  }

  &__imagen {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.4s ease;
  }

  &__imagen-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 60%, rgba($primary-color, 0.2));
    opacity: 0;
    transition: opacity 0.3s ease;

    .novedades-blog__card:hover & {
      opacity: 1;
    }
  }

  &__texto-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  &__texto-content {
    flex: 1;
    overflow: hidden;
  }

  &__resumen {
    font-size: $font-size-base;
    line-height: 1.7;
    color: lighten($text-color, 10%);
    margin: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__read-more {
    display: flex;
    align-items: center;
    gap: $spacing-small;
    color: $primary-color;
    font-weight: 600;
    font-size: $font-size-small;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    cursor: pointer;
    margin-top: $spacing-medium;
    align-self: flex-start;

    i {
      transition: transform 0.3s ease;
    }

    &:hover i {
      transform: translateX(4px);
    }
  }

  &__card-footer {
    padding: $spacing-large $spacing-xl;
    background: rgba(255, 255, 255, 0.02);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: auto;
    flex-shrink: 0;
  }

  &__contacto-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-small;
  }

  &__contacto-label {
    font-size: $font-size-small;
    color: lighten($primary-color, 20%);
    display: flex;
    align-items: center;
    gap: $spacing-small;
    font-weight: 500;

    i {
      font-size: 14px;
    }
  }

  &__contacto-email {
    font-size: $font-size-small;
    font-weight: 600;
    color: $primary-color;
    text-decoration: none;
    transition: all 0.3s ease;
    word-break: break-all;

    &:hover {
      color: lighten($primary-color, 10%);
      text-decoration: underline;
    }
  }

  &__btn-eliminar {
    transition: all 0.3s ease !important;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(#ef4444, 0.3);
    }
  }

  @keyframes backgroundPulse {
    0% { opacity: 0.4; }
    100% { opacity: 0.8; }
  }

  @keyframes headerGlow {
    0% { box-shadow: 0 0 5px rgba($primary-color, 0.5); }
    100% { box-shadow: 0 0 20px rgba($primary-color, 0.8); }
  }

  @keyframes titleFloat {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-5px); }
  }

  @keyframes logoRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes cardSlideIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: $spacing-large $spacing-medium;

    &__grid {
      grid-template-columns: 1fr;
      gap: $spacing-large;
    }

    &__card {
      margin: 0 auto;
      max-width: 100%;
      min-height: auto;
    }

    &__main-content {
      flex-direction: column;
      gap: $spacing-medium;
    }

    &__imagen-container {
      width: 100%;
      height: 200px;
      align-self: stretch;
    }

    &__resumen {
      -webkit-line-clamp: none;
      overflow: visible;
    }

    &__empresa-info {
      gap: $spacing-medium;
    }

    &__logo-container {
      width: 60px;
      height: 60px;
    }

    &__logo {
      width: 45px;
      height: 45px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: $spacing-large;
    }
  }

  @media (max-width: 600px) {
    &__grid {
      grid-template-columns: 1fr;
    }
    
    &__card {
      min-width: 0;
    }
    
    &__contacto-email {
      font-size: 12px;
    }
  }

  @media (min-width: $desktop) {
    padding: 4rem 2rem;

    &__grid {
      gap: $spacing-xxl;
    }
  }

  @media (min-width: $xl) {
    &__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-large;
}

.modal-container {
  @include glass-effect;
  border-radius: 24px;
  max-width: 800px;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
  position: relative;
}

.modal-header {
  padding: $spacing-xl;
  background: linear-gradient(135deg, rgba($primary-color, 0.15), rgba(#ff8c00, 0.1));
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &__content {
    display: flex;
    align-items: center;
    gap: $spacing-large;
    flex: 1;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }
}

.modal-logo-container {
  width: 70px;
  height: 70px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-logo-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(from 0deg, $primary-color, #ff8c00, #ffd700, $primary-color);
  animation: logoRotate 4s linear infinite;
  
  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: $background-color;
  }
}

.modal-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: 50%;
  z-index: 1;
  position: relative;
}

.modal-empresa-nombre {
  font-size: $font-size-large;
  font-weight: 700;
  @include text-gradient;
  margin-bottom: $spacing-small;
  word-wrap: break-word;
}

.modal-fecha {
  font-size: $font-size-small;
  color: lighten($primary-color, 20%);
  display: flex;
  align-items: center;
  gap: $spacing-small;

  i {
    font-size: 14px;
  }
}

.modal-close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-color;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  i {
    font-size: 20px;
  }
}

.modal-content {
  padding: $spacing-xl;
  max-height: calc(90vh - 120px);
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: $primary-color;
    border-radius: 3px;
    
    &:hover {
      background: lighten($primary-color, 10%);
    }
  }
}

.modal-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
  color: $text-color;
  margin-bottom: $spacing-large;
  line-height: 1.3;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: $primary-gradient;
    border-radius: 2px;
  }
}

.modal-image-container {
  margin-bottom: $spacing-large;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(45deg, rgba($primary-color, 0.1), rgba(#ff8c00, 0.1));
  max-height: 400px;
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.modal-text {
  margin-bottom: $spacing-xl;

  p {
    font-size: $font-size-base;
    line-height: 1.8;
    color: lighten($text-color, 5%);
    margin: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }
}

.modal-footer {
  padding-top: $spacing-large;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-contact {
  display: flex;
  align-items: center;
  gap: $spacing-medium;
  flex-wrap: wrap;
}

.modal-contact-label {
  font-size: $font-size-small;
  color: lighten($primary-color, 20%);
  display: flex;
  align-items: center;
  gap: $spacing-small;
  font-weight: 500;

  i {
    font-size: 16px;
  }
}

.modal-contact-email {
  font-size: $font-size-base;
  font-weight: 600;
  color: $primary-color;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: lighten($primary-color, 10%);
    text-decoration: underline;
  }
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: $spacing-medium;
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header {
    padding: $spacing-large;
    
    &__content {
      gap: $spacing-medium;
    }
  }

  .modal-logo-container {
    width: 60px;
    height: 60px;
  }

  .modal-logo {
    width: 40px;
    height: 40px;
  }

  .modal-content {
    padding: $spacing-large;
    max-height: calc(95vh - 100px);
  }

  .modal-contact {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-small;
  }
}
</style>