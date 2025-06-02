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
                <time class="novedades-blog__fecha"
                  :datetime="new Date(novedad.fechaPublicacion).toISOString()"
                >
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
            <div class="novedades-blog__media">
              <img :src="novedad.imagen" alt="Imagen noticia" class="novedades-blog__imagen" />
              <p class="novedades-blog__resumen">{{ novedad.contenido }}</p>
            </div>
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
</template><style scoped lang="scss">
@import "@/assets/styles/variables.scss";

@mixin card-hover {
  transform: translateY(-4px);
  box-shadow: $box-shadow;
}

@mixin text-gradient {
  background: $primary-gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.novedades-blog {
  background: $background-color;
  min-height: 100vh;
  padding: $spacing-large $spacing-medium;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__header {
    text-align: center;
    margin-bottom: $spacing-large;
    padding: 0 $spacing-medium;
  }

  &__titulo {
    font-size: $font-size-xlarge;
    font-weight: 900;
    @include text-gradient;
    margin-bottom: $spacing-small;
  }

  &__subtitulo {
    font-size: $font-size-base;
    color: $primary-color;
  }

  &__grid {
    display: grid;
    gap: $spacing-large;
    grid-template-columns: 1fr;
  }

  &__card {
    background: $background-color;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    border: 1px solid lighten($dark-color, 40%);
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      @include card-hover;
    }
  }

  &__card-header {
    padding: $spacing-large $spacing-large 0;
  }

  &__empresa-info {
    display: flex;
    align-items: center;
    gap: $spacing-medium;
  }

  &__logo-container {
    width: 56px;
    height: 56px;
    background: lighten($background-color, 10%);
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid lighten($dark-color, 40%);
  }

  &__logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: calc($border-radius / 2);
  }

  &__empresa-details {
    display: flex;
    flex-direction: column;
  }

  &__empresa-nombre {
    font-size: $font-size-large;
    font-weight: 700;
    color: $primary-color;
    margin-bottom: $spacing-extra-small;
  }

  &__fecha {
    font-size: $font-size-small;
    color: lighten($primary-color, 10%);
  }

  &__content {
    padding: $spacing-large;
    padding-bottom: $spacing-medium;
  }

  &__titulo-noticia {
    font-size: $font-size-xlarge;
    font-weight: 800;
    color: $primary-color;
    margin-bottom: $spacing-medium;
  }

  &__media {
    display: flex;
    align-items: flex-start;
    gap: $spacing-medium;
  }

  &__imagen {
    width: 120px;
    height: auto;
    object-fit: cover;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    flex-shrink: 0;
  }

  &__resumen {
    font-size: $font-size-base;
    line-height: 1.6;
    color: lighten($primary-color, 10%);
    margin: 0;
    flex: 1;
  }

  &__card-footer {
    padding: $spacing-medium $spacing-large $spacing-large;
    border-top: 1px solid lighten($dark-color, 40%);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__contacto-label {
    font-size: $font-size-small;
    color: lighten($primary-color, 10%);
    margin-right: $spacing-small;
  }

  &__contacto-email {
    font-size: $font-size-small;
    font-weight: 600;
    color: $primary-color;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (min-width: $desktop) {
    padding: 3rem 2rem;

    &__titulo {
      font-size: 3rem;
    }

    &__subtitulo {
      font-size: 1.25rem;
    }

    &__grid {
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    }

    &__imagen {
      width: 160px;
    }
  }
}
</style>
