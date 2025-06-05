<script setup lang="ts">
import { ref, onMounted, computed, defineProps } from 'vue'
import { useGamesStore } from '@/stores/games'
import type { VideojuegoDetalleDto } from '@/stores/dtos/videojuegoDetalle.dto'
import { useRouter } from 'vue-router'

const router = useRouter()

const irAReview = () => {
  if (props.gameId) {
    router.push(`/reviewVideojuego?id=${props.gameId}`)
  }
}

const props = defineProps({
  gameId: {
    type: Number,
    default: null,
  },
})

const gamesStore = useGamesStore()
const videojuego = ref<VideojuegoDetalleDto | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Función para obtener la URL de la imagen PEGI según el valor
const getPegiImageUrl = (pegiValue: number) => {
  switch (pegiValue) {
    case 3:
      return 'src/assets/img/pegi3.png'
    case 7:
      return 'src/assets/img/pegi7.png'
    case 12:
      return 'src/assets/img/pegi12.svg'
    case 16:
      return 'src/assets/img/pegi16.png'
    case 18:
      return 'src/assets/img/pegi18.png'
    default:
      return undefined
  }
}

// Formato de fecha a española
const formatearFechaEspañola = (fecha: string | number | Date) => {
  if (typeof fecha === 'number') {
    return fecha.toString()
  }

  const fechaObj = new Date(fecha)
  const dia = fechaObj.getDate().toString().padStart(2, '0')
  const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0')
  const anio = fechaObj.getFullYear()

  return `${dia}/${mes}/${anio}`
}

// Computed para la valoración con estrellas
const valoracionEstrellas = computed(() => {
  if (!videojuego.value?.valoracionPromedio) return { llenas: 0, media: false, vacias: 5 }
  
  const valor = videojuego.value.valoracionPromedio / 2 // Convertir de 10 a 5
  const llenas = Math.floor(valor)
  const media = valor % 1 >= 0.5
  const vacias = 5 - llenas - (media ? 1 : 0)
  
  return { llenas, media, vacias }
})

onMounted(async () => {
  if (props.gameId !== null) {
    try {
      isLoading.value = true
      await gamesStore.verDetalleVideojuego(props.gameId)
      videojuego.value = gamesStore.detalleVideojuego
      
      if (videojuego.value?.titulo) {
        await cargarClips(videojuego.value.titulo)
      }
    } catch (err) {
      error.value = 'Error al cargar el videojuego'
      console.error('Error:', err)
    } finally {
      isLoading.value = false
    }
  }
})

const clips = ref<any[]>([])

const cargarClips = async (nombreJuego: string) => {
  try {
    const res = await fetch(`https://wannagamesapi.retocsv.es/api/twitch/clips?game=${encodeURIComponent(nombreJuego)}`)
    const data = await res.json()
    clips.value = data.data
  } catch (error) {
    console.error("Error cargando clips de Twitch:", error)
  }
}
</script>

<template>
  <div class="detalle-videojuego">
    <!-- Loading State -->
    <div v-if="isLoading" class="detalle-videojuego__loading">
      <div class="loading-spinner"></div>
      <p>Cargando información del videojuego...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="detalle-videojuego__error">
      <div class="error-icon">⚠️</div>
      <h3>Error al cargar</h3>
      <p>{{ error }}</p>
    </div>

    <!-- Content -->
    <div v-else-if="videojuego" class="detalle-videojuego__contenedor">
      <!-- Imagen del juego -->
      <div class="detalle-videojuego__imagen-wrapper">
        <div class="imagen-container">
          <img 
            :src="videojuego.caratula" 
            :alt="videojuego.titulo" 
            class="detalle-videojuego__imagen"
            loading="lazy"
          />
          <div class="imagen-overlay">
            <div class="overlay-content">
              <span class="overlay-text">Ver en detalle</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Información del juego -->
      <div class="detalle-videojuego__info">
        <header class="detalle-videojuego__header">
          <h1 class="detalle-videojuego__titulo">{{ videojuego.titulo }}</h1>
          
          <!-- Metadatos principales -->
          <div class="detalle-videojuego__meta">
            <div class="meta-item meta-item--valoracion">
              <div class="valoracion-container">
                <div class="estrellas">
                  <span 
                    v-for="n in valoracionEstrellas.llenas" 
                    :key="`llena-${n}`" 
                    class="estrella estrella--llena"
                  >★</span>
                  <span 
                    v-if="valoracionEstrellas.media" 
                    class="estrella estrella--media"
                  >★</span>
                  <span 
                    v-for="n in valoracionEstrellas.vacias" 
                    :key="`vacia-${n}`" 
                    class="estrella estrella--vacia"
                  >☆</span>
                </div>
                <span class="valoracion-numero">{{ videojuego.valoracionPromedio.toFixed(1) }}/10</span>
              </div>
            </div>

            <div class="meta-item meta-item--fecha">
              <span class="meta-icon">📅</span>
              <span class="meta-text">{{ formatearFechaEspañola(videojuego.anioSalida) }}</span>
            </div>

            <div v-if="videojuego.pegi" class="meta-item meta-item--pegi">
              <span class="meta-label">PEGI:</span>
              <img :src="getPegiImageUrl(videojuego.pegi)" :alt="`PEGI ${videojuego.pegi}`" class="pegi-imagen" />
            </div>
          </div>
        </header>

        <!-- Descripción -->
        <div class="detalle-videojuego__descripcion-section">
          <p class="detalle-videojuego__descripcion">{{ videojuego.descripcion }}</p>
        </div>

        <!-- Información de la compañía -->
        <div class="detalle-videojuego__compania">
          <span class="compania-label">Desarrolladora</span>
          <span class="compania-nombre">{{ videojuego.compania }}</span>
        </div>

        <!-- Géneros -->
        <section class="detalle-videojuego__seccion">
          <h3 class="seccion-titulo">
            <span class="seccion-icon">🎮</span>
            <span>Géneros</span>
          </h3>
          <div class="detalle-videojuego__tags">
            <span 
              v-for="genero in videojuego.generos" 
              :key="genero.id" 
              class="tag tag--genero"
            >
              {{ genero.nombre }}
            </span>
          </div>
        </section>

        <!-- Plataformas -->
        <section class="detalle-videojuego__seccion">
          <h3 class="seccion-titulo">
            <span class="seccion-icon">🕹️</span>
            <span>Plataformas</span>
          </h3>
          <div class="detalle-videojuego__tags">
            <span 
              v-for="plataforma in videojuego.plataformas" 
              :key="plataforma.id" 
              class="tag tag--plataforma"
            >
              {{ plataforma.nombre }}
            </span>
          </div>
        </section>

        <!-- Botón de acción -->
        <div class="detalle-videojuego__acciones">
          <button class="btn btn--primary btn--review" @click="irAReview()">
            <span class="btn-icon">📝</span>
            <span>Ver Review Completa</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Clips de Twitch (sin modificar) -->
    <section class="detalle-videojuego__seccion" v-if="clips.length">
      <h3><span class="icono">📺</span> Clips populares en Twitch</h3>
      <div class="detalle-videojuego__clips">
        <div class="twitch-clip" v-for="clip in clips" :key="clip.id">
          <iframe :src="`https://clips.twitch.tv/embed?clip=${clip.id}&parent=localhost`" width="100%" height="300"
            allowfullscreen></iframe>
          <p>{{ clip.title }}</p>
        </div>
      </div>
    </section>

    <!-- Estado vacío -->
    <div v-else class="detalle-videojuego__empty">
      <div class="empty-icon">🎮</div>
      <h3>Videojuego no encontrado</h3>
      <p>No se ha encontrado información del videojuego solicitado.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.detalle-videojuego {
  width: 100%;
  margin-top: 0;
  margin-bottom: $spacing-xlarge;

  // Estados de carga y error
  &__loading,
  &__error,
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    padding: $spacing-xlarge;
    background: $card-background;
    border-radius: $border-radius * 2;
    color: $text-color;
    text-align: center;

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba($primary-color, 0.2);
      border-top: 4px solid $primary-color;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: $spacing-medium;
    }

    .error-icon,
    .empty-icon {
      font-size: 48px;
      margin-bottom: $spacing-medium;
    }

    h3 {
      font-size: $font-size-xlarge;
      font-weight: 600;
      margin: 0 0 $spacing-small 0;
      color: $text-color;
    }

    p {
      font-size: $font-size-base;
      color: rgba($text-color, 0.7);
      margin: 0;
    }
  }

  &__error {
    border: 1px solid $color-error;
    background: rgba($color-error, 0.1);
  }

  // Contenedor principal
  &__contenedor {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: linear-gradient(135deg, #2a2a2a 0%, $secondary-color 100%);
    border-radius: $border-radius * 2;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    color: $text-color;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: $primary-gradient;
    }
  }

  // Imagen del videojuego
  &__imagen-wrapper {
    position: relative;
    width: 100%;
    padding: $spacing-xlarge $spacing-large;
    display: flex;
    justify-content: center;
    background: linear-gradient(135deg, #1a1a1a 0%, $card-background 100%);

    .imagen-container {
      position: relative;
      max-width: 300px;
      width: 100%;
      border-radius: $border-radius;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
      transition: $transition;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);

        .imagen-overlay {
          opacity: 1;
        }
      }
    }

    .imagen-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba($primary-color, 0.9), rgba(#ff8c00, 0.9));
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: $transition;

      .overlay-content {
        text-align: center;
        color: $text-color;
        font-weight: 600;
        font-size: $font-size-base;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }
    }
  }

  &__imagen {
    width: 100%;
    height: auto;
    display: block;
    transition: $transition;
  }

  // Información del videojuego
  &__info {
    padding: $spacing-xlarge $spacing-large;
    display: flex;
    flex-direction: column;
    gap: $spacing-large;
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
  }

  &__titulo {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    color: $text-color;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    line-height: 1.2;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-medium;
    align-items: center;

    .meta-item {
      display: flex;
      align-items: center;
      gap: $spacing-small;
      padding: $spacing-small $spacing-medium;
      background: rgba($text-color, 0.1);
      border-radius: $border-radius;
      font-size: $font-size-small;
      font-weight: 500;
      transition: $transition;

      &:hover {
        background: rgba($text-color, 0.15);
      }

      &--valoracion {
        background: rgba($color-warning, 0.2);
        border: 1px solid rgba($color-warning, 0.3);
      }

      &--fecha {
        background: rgba($primary-color, 0.1);
        border: 1px solid rgba($primary-color, 0.2);
      }

      &--pegi {
        background: rgba($color-success, 0.1);
        border: 1px solid rgba($color-success, 0.2);
      }
    }

    .meta-icon {
      font-size: 16px;
    }

    .meta-label {
      font-size: $font-size-small;
      color: rgba($text-color, 0.8);
      font-weight: 500;
    }
  }

  // Valoración con estrellas
  .valoracion-container {
    display: flex;
    align-items: center;
    gap: $spacing-small;

    .estrellas {
      display: flex;
      gap: 2px;

      .estrella {
        font-size: 16px;
        transition: $transition;

        &--llena {
          color: $color-warning;
        }

        &--media {
          color: $color-warning;
          opacity: 0.6;
        }

        &--vacia {
          color: rgba($text-color, 0.3);
        }
      }
    }

    .valoracion-numero {
      font-weight: 600;
      color: $color-warning;
      font-size: $font-size-small;
    }
  }

  .pegi-imagen {
    height: 24px;
    width: auto;
    border-radius: 4px;
  }

  // Descripción
  &__descripcion-section {
    position: relative;
    padding: $spacing-large;
    background: rgba($text-color, 0.05);
    border-radius: $border-radius;
    border-left: 4px solid $primary-color;
  }

  &__descripcion {
    font-size: $font-size-base;
    line-height: 1.7;
    color: rgba($text-color, 0.9);
    margin: 0;
    font-weight: 400;
  }

  // Compañía
  &__compania {
    display: flex;
    flex-direction: column;
    gap: $spacing-small;
    padding: $spacing-medium;
    background: rgba($primary-color, 0.1);
    border-radius: $border-radius;
    border: 1px solid rgba($primary-color, 0.2);

    .compania-label {
      font-size: $font-size-small;
      color: rgba($text-color, 0.7);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .compania-nombre {
      font-weight: 600;
      font-size: $font-size-base;
      color: $text-color;
    }
  }

  // Secciones
  &__seccion {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;

    .seccion-titulo {
      margin: 0;
      font-size: $font-size-large;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: $spacing-small;
      color: $text-color;

      .seccion-icon {
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: rgba($primary-color, 0.2);
        border-radius: 50%;
      }
    }
  }

  // Tags
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-small;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    padding: $spacing-small $spacing-medium;
    border-radius: $border-radius;
    font-size: $font-size-small;
    font-weight: 500;
    transition: $transition;
    cursor: default;

    &--genero {
      background: linear-gradient(135deg, $primary-color, #ff8c00);
      color: $text-color;
      box-shadow: 0 2px 8px rgba($primary-color, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($primary-color, 0.4);
      }
    }

    &--plataforma {
      background: rgba($text-color, 0.1);
      color: $text-color;
      border: 1px solid rgba($primary-color, 0.3);

      &:hover {
        background: rgba($text-color, 0.15);
        border-color: rgba($primary-color, 0.5);
        transform: translateY(-2px);
      }
    }
  }

  // Acciones
  &__acciones {
    display: flex;
    gap: $spacing-medium;
    margin-top: $spacing-medium;
  }

  // Botones
  .btn {
    display: inline-flex;
    align-items: center;
    gap: $spacing-small;
    padding: $spacing-medium $spacing-large;
    font-size: $font-size-base;
    font-weight: 600;
    border-radius: $border-radius;
    border: none;
    cursor: pointer;
    transition: $transition;
    text-decoration: none;
    font-family: inherit;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    &:hover::before {
      left: 100%;
    }

    &--primary {
      background: linear-gradient(135deg, $primary-color, #ff8c00);
      color: $text-color;
      box-shadow: 0 4px 15px rgba($primary-color, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba($primary-color, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .btn-icon {
      font-size: 18px;
    }
  }

  // Clips de Twitch (mantenido sin cambios)
  &__clips {
    margin-top: $spacing-large;
    display: flex;
    gap: $spacing-medium;
    overflow-x: auto;
    padding-bottom: $spacing-small;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    justify-content: flex-start;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
    }

    .twitch-clip {
      flex: 0 0 auto;
      width: 320px;
      height: 180px;
      border-radius: $border-radius;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      transition: $transition;

      &:hover {
        transform: scale(1.05);
      }

      iframe {
        width: 100%;
        height: 100%;
        border: none;
      }

      p {
        color: $text-color;
        font-size: $font-size-small;
        margin-top: $spacing-small;
        text-align: center;
        max-width: 100%;
        word-wrap: break-word;
      }
    }
  }

  // Animaciones
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  // Media queries
  @media (max-width: 400px) {
    &__clips {
      padding-bottom: $spacing-small;
      gap: $spacing-small;

      .twitch-clip {
        width: 260px;
        height: 146px;
      }
    }
  }

  @media (min-width: $desktop) {
    margin-bottom: $spacing-xxl;

    &__contenedor {
      flex-direction: row;
      align-items: stretch;
      max-width: 1200px;
      margin: 0 auto;
    }

    &__imagen-wrapper {
      width: 40%;
      padding: $spacing-xxl;
      align-items: center;
    }

    &__imagen {
      max-width: 100%;
    }

    &__info {
      width: 60%;
      padding: $spacing-xxl;
      border-left: 1px solid rgba($text-color, 0.1);
    }

    &__titulo {
      font-size: 32px;
    }

    &__meta {
      .meta-item {
        font-size: $font-size-base;
      }
    }

    .pegi-imagen {
      height: 28px;
    }

    &__descripcion {
      font-size: $font-size-large;
    }

    &__compania {
      flex-direction: row;
      align-items: center;
      gap: $spacing-medium;

      .compania-label {
        font-size: $font-size-base;
      }

      .compania-nombre {
        font-size: $font-size-large;
      }
    }

    .seccion-titulo {
      font-size: $font-size-xlarge;
    }

    .tag {
      font-size: $font-size-base;
    }

    .btn {
      font-size: $font-size-large;
    }
  }

  @media (min-width: 1200px) {
    &__imagen-wrapper {
      width: 35%;
    }

    &__info {
      width: 65%;
    }
  }

  @media (min-width: $xl) {
    &__contenedor {
      max-width: 1400px;
    }

    &__imagen-wrapper {
      width: 33%;
    }

    &__info {
      width: 67%;
      padding: $spacing-xxl * 1.5;
    }

    &__titulo {
      font-size: 36px;
    }

    &__meta {
      .meta-item {
        font-size: $font-size-large;
      }
    }

    .pegi-imagen {
      height: 32px;
    }

    &__descripcion {
      font-size: $font-size-large;
      line-height: 1.8;
    }

    &__compania {
      .compania-label {
        font-size: $font-size-large;
      }

      .compania-nombre {
        font-size: $font-size-xlarge;
      }
    }

    .seccion-titulo {
      font-size: 24px;
    }

    .tag {
      font-size: $font-size-large;
      padding: $spacing-small $font-size-large;
    }

    .btn {
      font-size: $font-size-large;
      padding: $spacing-large $spacing-xlarge;
    }
  }
}
</style>