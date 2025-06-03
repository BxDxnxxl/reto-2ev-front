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
  }
}

// Formato de fecha a española
const formatearFechaEspañola = (fecha: string | number | Date) => {
  // Si es un año, lo devolvemos como string
  if (typeof fecha === 'number') {
    return fecha.toString()
  }

  // Si es fecha completa, la formateamos como DD/MM/AAAA
  const fechaObj = new Date(fecha)
  const dia = fechaObj.getDate().toString().padStart(2, '0')
  const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0')
  const anio = fechaObj.getFullYear()

  return `${dia}/${mes}/${anio}`
}

onMounted(async () => {
  if (props.gameId !== null) {
    await gamesStore.verDetalleVideojuego(props.gameId)
    videojuego.value = gamesStore.detalleVideojuego
    console.log('Cargado:', videojuego.value)

    if (videojuego.value?.titulo) {
      await cargarClips(videojuego.value.titulo)
    }
  }
})


const clips = ref<any[]>([])

const cargarClips = async (nombreJuego: string) => {
  try {
    const res = await fetch(`http://localhost:4444/api/twitch/clips?game=${encodeURIComponent(nombreJuego)}`)
    const data = await res.json()
    clips.value = data.data
  } catch (error) {
    console.error("Error cargando clips de Twitch:", error)
  }
}

</script>

<template>
  <div class="detalle-videojuego">
    <div v-if="videojuego" class="detalle-videojuego__contenedor">
      <div class="detalle-videojuego__imagen-wrapper">
        <img :src="videojuego.caratula" :alt="videojuego.titulo" class="detalle-videojuego__imagen" />
      </div>

      <div class="detalle-videojuego__info">
        <h1 class="detalle-videojuego__titulo">{{ videojuego.titulo }}</h1>

        <div class="detalle-videojuego__meta">
          <span class="detalle-videojuego__valoracion">
            <span class="icono">⭐</span> {{ videojuego.valoracionPromedio.toFixed(2) }}/10
          </span>
          <span class="detalle-videojuego__anio">
            <span class="icono">📅</span> {{ formatearFechaEspañola(videojuego.anioSalida) }}
          </span>
          <span v-if="videojuego.pegi" class="detalle-videojuego__pegi">
            <h3>Pegi:</h3>
            <img :src="getPegiImageUrl(videojuego.pegi)" :alt="`PEGI ${videojuego.pegi}`" class="pegi-imagen" />
          </span>
        </div>

        <p class="detalle-videojuego__descripcion">{{ videojuego.descripcion }}</p>

        <div class="detalle-videojuego__compania">
          <span class="etiqueta">Desarrolladora:</span>
          <span class="valor">{{ videojuego.compania }}</span>
        </div>

        <!-- Géneros -->
        <div class="detalle-videojuego__seccion">
          <h3><span class="icono">🎮</span> Géneros</h3>
          <div class="detalle-videojuego__tags">
            <span v-for="genero in videojuego.generos" :key="genero.id" class="tag tag--genero">
              {{ genero.nombre }}
            </span>
          </div>
        </div>

        <!-- Plataformas -->
        <div class="detalle-videojuego__seccion">
          <h3><span class="icono">🕹️</span> Plataformas</h3>
          <div class="detalle-videojuego__tags">
            <span v-for="plataforma in videojuego.plataformas" :key="plataforma.id" class="tag tag--plataforma">
              {{ plataforma.nombre }}
            </span>
          </div>
        </div>
        <button class="boton-review" @click="irAReview()">Ver Review Completa</button>
      </div>
    </div>

    <!-- Clips de Twitch -->
    <div class="detalle-videojuego__seccion" v-if="clips.length">
      <h3><span class="icono">📺</span> Clips populares en Twitch</h3>
      <div class="detalle-videojuego__clips">
        <div class="twitch-clip" v-for="clip in clips" :key="clip.id">
          <iframe :src="`https://clips.twitch.tv/embed?clip=${clip.id}&parent=localhost`" width="100%" height="300"
            allowfullscreen></iframe>
          <p>{{ clip.title }}</p>
        </div>
      </div>
    </div>


    <div v-else class="detalle-videojuego__error">
      <p>No se ha encontrado información del videojuego.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.detalle-videojuego {
  width: 100%;
  margin-top: 0;
  margin-bottom: 24px;

  &__contenedor {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: linear-gradient(to bottom, #323232, #272727);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    color: #fff;
  }

  &__imagen-wrapper {
    position: relative;
    width: 100%;
    padding-top: 10px;
    display: flex;
    justify-content: center;
    background: #1e1e1e;
  }

  &__imagen {
    max-width: 280px;
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  &__info {
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__titulo {
    font-size: 26px;
    font-weight: 700;
    margin: 0;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    font-size: 15px;

    >span {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .icono {
      font-size: 18px;
    }
  }

  &__valoracion {
    color: #ffcc00;
    font-weight: 600;
  }

  &__pegi {
    display: flex;
    align-items: center;
  }

  .pegi-imagen {
    height: 28px;
    width: auto;
  }

  &__descripcion {
    font-size: 16px;
    line-height: 1.6;
    color: #e0e0e0;
    margin: 0;
  }

  &__compania {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .etiqueta {
      font-size: 14px;
      color: #a0a0a0;
    }

    .valor {
      font-weight: 600;
      font-size: 16px;
    }
  }

  &__seccion {
    display: flex;
    flex-direction: column;
    gap: 10px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;

      .icono {
        font-size: 20px;
      }
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .tag {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;

    &--genero {
      background: #f25421;
      color: #fff;

      &:hover {
        background: #e04a17;
        transform: translateY(-2px);
      }
    }

    &--plataforma {
      background: #333;
      color: #fff;
      border: 1px solid #f25421;

      &:hover {
        background: #3e3e3e;
        transform: translateY(-2px);
      }
    }
  }

  .boton-review {
    margin-top: 16px;
    align-self: flex-start;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    background-color: #f25421;
    color: #fff;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    &:hover {
      background-color: #e04a17;
      transform: translateY(-2px);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  &__error {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    background: #272727;
    border-radius: 10px;
    color: #fff;
    padding: 20px;
  }

  &__clips {
    margin-top: 20px;
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 10px;
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
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.05);
      }

      iframe {
        width: 100%;
        height: 100%;
        border: none;
      }

      p {
        color: #fff;
        font-size: 14px;
        margin-top: 8px;
        text-align: center;
        max-width: 100%;
        word-wrap: break-word;
      }
    }
  }

  @media (max-width: 400px) {
    &__clips {
      padding-bottom: 8px;
      gap: 8px;

      .twitch-clip {
        width: 260px;
        height: 146px;
      }
    }
  }

  /* --- Resto media queries existentes --- */

  @media (min-width: 768px) {
    margin-bottom: 40px;

    &__contenedor {
      flex-direction: row;
      align-items: stretch;
      max-width: 1200px;
      margin: 0 auto;
    }

    &__imagen-wrapper {
      width: 40%;
      padding: 30px;
      align-items: center;
    }

    &__imagen {
      max-width: 100%;
    }

    &__info {
      width: 60%;
      padding: 30px;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
    }

    &__titulo {
      font-size: 32px;
    }

    &__meta {
      font-size: 16px;

      .icono {
        font-size: 20px;
      }
    }

    .pegi-imagen {
      height: 32px;
    }

    &__descripcion {
      font-size: 17px;
    }

    &__compania {
      flex-direction: row;
      align-items: center;
      gap: 10px;

      .etiqueta {
        font-size: 15px;
      }

      .valor {
        font-size: 17px;
      }
    }

    &__seccion {
      h3 {
        font-size: 20px;
      }
    }

    .tag {
      font-size: 15px;
    }

    .boton-review {
      font-size: 17px;
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

  @media (min-width: 1440px) {
    &__contenedor {
      max-width: 1400px;
    }

    &__imagen-wrapper {
      width: 33%;
    }

    &__info {
      width: 67%;
      padding: 40px;
    }

    &__titulo {
      font-size: 36px;
    }

    &__meta {
      font-size: 18px;

      .icono {
        font-size: 22px;
      }
    }

    .pegi-imagen {
      height: 38px;
    }

    &__descripcion {
      font-size: 18px;
      line-height: 1.8;
    }

    &__compania {
      .etiqueta {
        font-size: 16px;
      }

      .valor {
        font-size: 18px;
      }
    }

    &__seccion {
      h3 {
        font-size: 22px;
      }
    }

    .tag {
      font-size: 16px;
      padding: 8px 14px;
    }

    .boton-review {
      font-size: 18px;
      padding: 12px 24px;
    }
  }
}
</style>
