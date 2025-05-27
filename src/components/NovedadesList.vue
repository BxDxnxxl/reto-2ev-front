<script setup lang="ts">
import { onMounted } from 'vue';
import { usePublicacionesEmpresasStore } from '@/stores/publicacionesEmpresasStore';
import { useUsersStore } from '@/stores/users';

const publicacionesStore = usePublicacionesEmpresasStore();
const userStore = useUsersStore();

onMounted(async () => {
  await publicacionesStore.fetchNovedades();
});
console.log(publicacionesStore.novedades);

</script>

<template>
  <section class="novedades-blog">
    <div class="novedades-blog__container">
      <header class="novedades-blog__header">
        <h1 class="novedades-blog__titulo">Novedades del Mes</h1>
        <p class="novedades-blog__subtitulo">Mantente al día con las últimas actualizaciones</p>
      </header>

      <div class="novedades-blog__grid">
        <article
          v-for="novedad in publicacionesStore.novedades"
          :key="novedad.id"
          class="novedades-blog__card"
        >
          <!-- Header de la card -->
          <div class="novedades-blog__card-header">
            <div class="novedades-blog__empresa-info">
              <div class="novedades-blog__logo-container">
                <img
                  class="novedades-blog__logo"
                  :src="novedad.logoEmpresa"
                  :alt="`Logo de ${novedad.nombreEmpresa}`"
                />
              </div>
              <div class="novedades-blog__empresa-details">
                <h2 class="novedades-blog__empresa-nombre">{{ novedad.nombreEmpresa }}</h2>
                <time class="novedades-blog__fecha" :datetime="novedad.fechaPublicacion">
                  {{ new Date(novedad.fechaPublicacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) }}
                </time>
              </div>
            </div>
          </div>

          <!-- Contenido principal -->
          <div class="novedades-blog__content">
            <h3 class="novedades-blog__titulo-noticia">{{ novedad.titulo }}</h3>
            <p class="novedades-blog__resumen">{{ novedad.contenido }}</p>
          </div>

          <!-- Imagen destacada -->
          <div v-if="novedad.imagen" class="novedades-blog__media">
            <img
              :src="novedad.imagen"
              :alt="`Imagen de ${novedad.titulo}`"
              class="novedades-blog__imagen"
            />
          </div>

          <!-- Footer -->
          <footer class="novedades-blog__card-footer">
            <div class="novedades-blog__contacto">
              <span class="novedades-blog__contacto-label">Contacto:</span>
              <a 
                :href="`mailto:${novedad.emailUsuario}`" 
                class="novedades-blog__contacto-email"
              >
                {{ novedad.emailUsuario }}
              </a>
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
  </section>
</template>

<style scoped lang="scss">
// Variables
$primary-color: #2563eb;
$secondary-color: #64748b;
$text-dark: #1e293b;
$text-light: #64748b;
$background-light: #f8fafc;
$border-color: #e2e8f0;
$shadow-light: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
$shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-large: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

// Mixins
@mixin card-hover {
  transform: translateY(-4px);
  box-shadow: $shadow-large;
}

@mixin text-gradient {
  background: linear-gradient(135deg, $primary-color, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.novedades-blog {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding: 1.5rem 1rem;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 0 1rem;
  }

  &__titulo {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
    @include text-gradient;
    letter-spacing: -0.025em;
  }

  &__subtitulo {
    font-size: 1.125rem;
    color: $text-light;
    font-weight: 400;
  }

  &__grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
  }

  &__card {
    background: white;
    border-radius: 16px;
    box-shadow: $shadow-medium;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid $border-color;

    &:hover {
      @include card-hover;
    }
  }

  &__card-header {
    padding: 1.5rem 1.5rem 0;
  }

  &__empresa-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__logo-container {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    background: $background-light;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid $border-color;
  }

  &__logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: 8px;
  }

  &__empresa-details {
    flex: 1;
    min-width: 0;
  }

  &__empresa-nombre {
    font-size: 1.125rem;
    font-weight: 600;
    color: $text-dark;
    margin: 0 0 0.25rem 0;
    line-height: 1.4;
  }

  &__fecha {
    font-size: 0.875rem;
    color: $text-light;
    font-weight: 500;
  }

  &__content {
    padding: 1.5rem;
    padding-bottom: 1rem;
  }

  &__titulo-noticia {
    font-size: 1.375rem;
    font-weight: 700;
    color: $text-dark;
    line-height: 1.3;
    margin: 0 0 1rem 0;
    letter-spacing: -0.01em;
  }

  &__resumen {
    font-size: 1rem;
    line-height: 1.6;
    color: $secondary-color;
    margin: 0;
  }

  &__media {
    margin: 0 1.5rem 1.5rem;
    border-radius: 12px;
    overflow: hidden;
    background: $background-light;
  }

  &__imagen {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease;

    .novedades-blog__card:hover & {
      transform: scale(1.02);
    }
  }

  &__card-footer {
    padding: 1rem 1.5rem 1.5rem;
    border-top: 1px solid $border-color;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__contacto {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__contacto-label {
    font-size: 0.875rem;
    color: $text-light;
    font-weight: 500;
  }

  &__contacto-email {
    font-size: 0.875rem;
    color: $primary-color;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #1d4ed8;
      text-decoration: underline;
    }
  }

  &__btn-eliminar {
    align-self: flex-start;
  }

  // Responsive Design - Desktop
  @media (min-width: 768px) {
    padding: 3rem 2rem;

    &__titulo {
      font-size: 3rem;
    }

    &__subtitulo {
      font-size: 1.25rem;
    }

    &__grid {
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2.5rem;
    }

    &__card {
      border-radius: 20px;
    }

    &__card-header {
      padding: 2rem 2rem 0;
    }

    &__logo-container {
      width: 64px;
      height: 64px;
    }

    &__logo {
      width: 48px;
      height: 48px;
    }

    &__empresa-nome {
      font-size: 1.25rem;
    }

    &__content {
      padding: 2rem;
      padding-bottom: 1.5rem;
    }

    &__titulo-noticia {
      font-size: 1.5rem;
    }

    &__resumen {
      font-size: 1.0625rem;
    }

    &__media {
      margin: 0 2rem 2rem;
      border-radius: 16px;
    }

    &__card-footer {
      padding: 1.5rem 2rem 2rem;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    &__contacto {
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
    }
  }

  @media (min-width: 1024px) {
    padding: 4rem 2rem;

    &__header {
      margin-bottom: 4rem;
    }

    &__grid {
      gap: 3rem;
    }
  }
}
</style>