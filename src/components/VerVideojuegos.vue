<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useGamesStore } from '@/stores/games';
import FormVideojuego from '@/components/FormVideojuego.vue';
import Swal from 'sweetalert2';

const store = useGamesStore();
const mostrarFormulario = ref(false);

// Paginación
const currentPage = ref(1);
const itemsPerPage = ref(10);

onMounted(() => {
  store.fetchVideojuegos();
});

// Computed para la paginación
const totalPages = computed(() => {
  return Math.ceil(store.games.length / itemsPerPage.value);
});

const videojuegosPaginados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return store.games.slice(start, end);
});

const paginasVisibles = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }
  
  return pages;
});

function cambiarPagina(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function cambiarItemsPorPagina(newItemsPerPage: number) {
  itemsPerPage.value = newItemsPerPage;
  currentPage.value = 1; // Resetear a la primera página
}

async function borrarVideojuego(id: number) {
  const confirm = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280'
  });

  if (confirm.isConfirmed) {
    await store.deleteVideojuego(id);
    await store.fetchVideojuegos();
    
    // Ajustar página si es necesario después de eliminar
    if (videojuegosPaginados.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1;
    }
    
    Swal.fire({
      title: 'Eliminado',
      text: 'El videojuego ha sido eliminado.',
      icon: 'success',
      confirmButtonColor: '#10b981'
    });
  }
}

async function guardarVideojuego(videojuego: any) {
  await store.createVideojuegos(videojuego);
  await store.fetchVideojuegos();
  mostrarFormulario.value = false;
}

</script>

<template>
  <div class="videojuegos">
    <v-container class="videojuegos__contenedor" fluid>
      <!-- Título y botón en columna -->
      <div class="videojuegos__header">
        <h2 class="videojuegos__titulo">🎮 Gestión de Videojuegos</h2>
        <v-btn 
          class="videojuegos__btn-crear" 
          color="primary" 
          size="large"
          prepend-icon="mdi-plus-circle-outline"
          @click="mostrarFormulario = true"
        >
          <span class="videojuegos__btn-texto">Añadir Videojuego</span>
        </v-btn>
      </div>

      <!-- Controles simples -->
      <div class="videojuegos__controles">
        <div class="videojuegos__info">
          <span class="videojuegos__info-texto">Mostrando {{ videojuegosPaginados.length }} de {{ store.games?.length || 0 }} videojuegos</span>
        </div>
        
        <div class="videojuegos__items-por-pagina">
          <label>Mostrar:</label>
          <select 
            :value="itemsPerPage" 
            @change="cambiarItemsPorPagina(Number($event.target.value))"
            class="videojuegos__select-items"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <!-- Vista móvil: Cards -->
      <div class="videojuegos__cards-movil">
        <div 
          v-for="v in videojuegosPaginados" 
          :key="v.id" 
          class="videojuegos__card"
        >
          <div class="videojuegos__card-header">
            <h3 class="videojuegos__card-titulo">{{ v.titulo }}</h3>
            <span v-if="v.pegi" class="pegi-badge">PEGI {{ v.pegi }}</span>
          </div>
          
          <div class="videojuegos__card-info">
            <div class="videojuegos__card-item">
              <span class="videojuegos__card-label">Descripción:</span>
              <span class="videojuegos__card-value">{{ v.descripcion || 'Sin descripción' }}</span>
            </div>
            
            <div class="videojuegos__card-item">
              <span class="videojuegos__card-label">Año:</span>
              <span class="videojuegos__card-value">{{ v.anioSalida }}</span>
            </div>
          </div>
          
          <div class="videojuegos__card-acciones">
            <v-btn 
              color="error" 
              size="small"
              variant="outlined"
              @click="borrarVideojuego(v.id)"
              class="videojuegos__btn-eliminar"
            >
              Eliminar
            </v-btn>
          </div>
        </div>

        <!-- Estado vacío para móvil -->
        <div v-if="store.games?.length === 0" class="estado-vacio">
          <p>No hay videojuegos disponibles</p>
          <v-btn 
            color="primary" 
            @click="mostrarFormulario = true"
          >
            Añadir primer videojuego
          </v-btn>
        </div>
      </div>

      <!-- Vista desktop: Tabla -->
      <div class="videojuegos__tabla-contenedor">
        <v-table class="videojuegos__tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Año</th>
              <th>PEGI</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in videojuegosPaginados" :key="v.id">
              <td>{{ v.titulo }}</td>
              <td>{{ v.descripcion || 'Sin descripción' }}</td>
              <td>{{ v.anioSalida }}</td>
              <td>
                <span v-if="v.pegi" class="pegi-badge">PEGI {{ v.pegi }}</span>
                <span v-else>-</span>
              </td>
              <td>
                <v-btn 
                  color="error" 
                  size="small"
                  variant="outlined"
                  @click="borrarVideojuego(v.id)"
                >
                  Eliminar
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <!-- Estado vacío para desktop -->
        <div v-if="store.games?.length === 0" class="estado-vacio">
          <p>No hay videojuegos disponibles</p>
          <v-btn 
            color="primary" 
            @click="mostrarFormulario = true"
          >
            Añadir primer videojuego
          </v-btn>
        </div>
      </div>

      <!-- Paginación simple -->
      <div class="videojuegos__paginacion" v-if="totalPages > 1">
        <v-btn 
          :disabled="currentPage === 1"
          @click="cambiarPagina(currentPage - 1)"
          size="small"
          class="videojuegos__btn-paginacion"
        >
          <span class="videojuegos__btn-pag-texto">Anterior</span>
          <span class="videojuegos__btn-pag-icono">‹</span>
        </v-btn>

        <span class="pagina-info">
          <span class="pagina-info-completa">Página {{ currentPage }} de {{ totalPages }}</span>
          <span class="pagina-info-corta">{{ currentPage }}/{{ totalPages }}</span>
        </span>

        <v-btn 
          :disabled="currentPage === totalPages"
          @click="cambiarPagina(currentPage + 1)"
          size="small"
          class="videojuegos__btn-paginacion"
        >
          <span class="videojuegos__btn-pag-texto">Siguiente</span>
          <span class="videojuegos__btn-pag-icono">›</span>
        </v-btn>
      </div>
    </v-container>

    <!-- Modal del formulario -->
    <v-dialog 
      v-model="mostrarFormulario" 
      max-width="900"
      persistent
    >
      <FormVideojuego @creado="guardarVideojuego" />
      <v-btn 
        @click="mostrarFormulario = false"
        style="position: absolute; top: 10px; right: 10px;"
        icon="mdi-close"
        size="small"
      />
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.videojuegos {
  padding: $spacing-small;
  background-color: $background-color;
  color: $text-color;
  min-height: 100vh;

  // Tablet y desktop
  @media (min-width: 768px) {
    padding: $spacing-large;
  }

  &__contenedor {
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;

    // Desktop
    @media (min-width: 1024px) {
      max-width: 1400px;
      gap: $spacing-large;
    }
  }

  &__header {
    text-align: center;
    padding: $spacing-medium;
    background: $card-background;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    display: flex;
    flex-direction: column;
    gap: $spacing-small;
    align-items: center;
    border: 1px solid rgba($primary-color, 0.2);

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-xl;
      gap: $spacing-medium;
    }
  }

  &__titulo {
    font-size: $font-size-large;
    font-weight: 700;
    color: $text-color;
    margin: 0;
    background: $primary-gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    // Desktop
    @media (min-width: 768px) {
      font-size: $font-size-xlarge;
    }
  }

  &__btn-crear {
    font-weight: 600;
    background: $primary-gradient;
    color: $text-color;
    border-radius: $border-radius;
    padding: $spacing-small $spacing-medium;
    font-size: $font-size-small;
    border: none;
    cursor: pointer;
    transition: $transition;
    box-shadow: $box-shadow;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    .videojuegos__btn-texto {
      display: none;
    }

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-medium $spacing-large;
      font-size: $font-size-base;

      .videojuegos__btn-texto {
        display: inline;
      }
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0px 4px 8px rgba($primary-color, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &__controles {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-small $spacing-medium;
    background: $card-background;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    flex-wrap: wrap;
    gap: $spacing-small;
    border: 1px solid rgba($primary-color, 0.1);

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-medium $spacing-large;
      gap: $spacing-medium;
    }
  }

  &__info {
    color: rgba($text-color, 0.8);
    font-weight: 500;
    font-size: $font-size-small;
    flex: 1;

    &-texto {
      display: block;
      
      // En móvil muy pequeño, texto más corto
      @media (max-width: 480px) {
        &::before {
          content: "{{ videojuegosPaginados.length }}/{{ store.games?.length || 0 }}";
        }
        
        /* Ocultar el texto original en móviles muy pequeños si es necesario */
      }
    }
  }

  &__items-por-pagina {
    display: flex;
    align-items: center;
    gap: $spacing-extra-small;
    flex-shrink: 0;

    // Desktop
    @media (min-width: 768px) {
      gap: $spacing-small;
    }

    label {
      color: rgba($text-color, 0.8);
      font-weight: 500;
      font-size: $font-size-small;
      white-space: nowrap;
    }

    select {
      padding: $spacing-extra-small $spacing-small;
      border-radius: $border-radius;
      border: 1px solid $color-disabled;
      background-color: $card-background;
      color: $text-color;
      font-size: $font-size-small;
      transition: $transition;
      min-width: 50px;

      // Desktop
      @media (min-width: 768px) {
        padding: $spacing-small $spacing-medium;
        min-width: 60px;
      }

      &:focus {
        outline: none;
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
      }
    }
  }

  // Vista móvil con cards
  &__cards-movil {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;

    // Ocultar en desktop
    @media (min-width: 768px) {
      display: none;
    }
  }

  &__card {
    background-color: $card-background;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    border: 1px solid rgba($primary-color, 0.2);
    padding: $spacing-medium;
    display: flex;
    flex-direction: column;
    gap: $spacing-small;
  }

  &__card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-small;
    flex-wrap: wrap;
    gap: $spacing-extra-small;
  }

  &__card-titulo {
    font-size: $font-size-base;
    font-weight: 700;
    color: $primary-color;
    margin: 0;
    flex: 1;
    word-break: break-word;
    min-width: 0;
  }

  &__card-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-small;
  }

  &__card-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $spacing-small;
    flex-wrap: wrap;
  }

  &__card-label {
    font-weight: 600;
    color: $primary-color;
    font-size: $font-size-small;
    flex-shrink: 0;
  }

  &__card-value {
    color: $text-color;
    font-size: $font-size-small;
    text-align: right;
    word-break: break-word;
    flex: 1;
    min-width: 0;
  }

  &__card-acciones {
    display: flex;
    justify-content: center;
    margin-top: $spacing-small;
    padding-top: $spacing-small;
    border-top: 1px solid rgba($primary-color, 0.1);
  }

  &__btn-eliminar {
    min-width: 80px;
  }

  // Vista desktop con tabla
  &__tabla-contenedor {
    display: none;

    // Mostrar solo en desktop
    @media (min-width: 768px) {
      display: block;
      background: $card-background;
      border-radius: $border-radius;
      box-shadow: $box-shadow;
      overflow-x: auto;
      border: 1px solid rgba($primary-color, 0.1);
      margin: $spacing-medium 0;

      &::-webkit-scrollbar {
        height: 8px;
      }

      &::-webkit-scrollbar-track {
        background: rgba($primary-color, 0.1);
        border-radius: $border-radius;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba($primary-color, 0.5);
        border-radius: $border-radius;

        &:hover {
          background: rgba($primary-color, 0.7);
        }
      }
    }
  }

  &__tabla {
    width: 100%;
    border-collapse: collapse;
    font-size: $font-size-base;
    table-layout: auto;

    th {
      background: $card-background;
      font-weight: 600;
      color: $primary-color;
      padding: $spacing-medium $spacing-large;
      font-size: $font-size-base;
      text-align: left;
      border-bottom: 2px solid #ff8c00;
      border-right: 1px solid #ff8c00;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
      position: sticky;
      top: 0;
      z-index: 10;

      &:last-child {
        border-right: none;
      }

      &:nth-child(1) { width: 25%; }
      &:nth-child(2) { width: 35%; }
      &:nth-child(3) { width: 15%; }
      &:nth-child(4) { width: 15%; }
      &:nth-child(5) { width: 10%; }
    }

    td {
      padding: $spacing-medium $spacing-large;
      font-size: $font-size-base;
      color: $primary-color;
      background-color: $card-background;
      border-bottom: 1px solid #ff8c00;
      border-right: 1px solid rgba(#ff8c00, 0.3);
      transition: $transition;
      text-align: left;
      vertical-align: middle;
      line-height: 1.5;

      &:last-child {
        border-right: none;
        text-align: center;
      }

      &:nth-child(1) {
        font-weight: 500;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &:nth-child(2) {
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &:nth-child(3) {
        text-align: center;
        font-weight: 600;
      }

      &:nth-child(4) {
        text-align: center;
      }
    }

    tr:hover td {
      background-color: rgba($primary-color, 0.05);
      transform: scale(1.01);
    }

    tr:nth-child(even) td {
      background-color: rgba($card-background, 0.8);
    }

    tr {
      height: 60px;
    }
  }

  .pegi-badge {
    background: rgba($primary-color, 0.2);
    color: $primary-color;
    padding: $spacing-extra-small $spacing-small;
    border-radius: $border-radius;
    font-size: $font-size-small;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    border: 1px solid rgba($primary-color, 0.3);
    display: inline-block;
    min-width: 30px;
    text-align: center;
    flex-shrink: 0;
  }

  .estado-vacio {
    text-align: center;
    padding: $spacing-large;
    color: rgba($text-color, 0.6);
    font-size: $font-size-base;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-xxl;
      font-size: $font-size-large;
    }

    &::before {
      content: "🎮";
      display: block;
      font-size: 2rem;
      margin-bottom: $spacing-small;
      opacity: 0.5;

      // Desktop
      @media (min-width: 768px) {
        font-size: 3rem;
        margin-bottom: $spacing-medium;
      }
    }
  }

  &__paginacion {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $spacing-extra-small;
    padding: $spacing-small $spacing-medium;
    background: $card-background;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    border: 1px solid rgba($primary-color, 0.1);
    flex-wrap: wrap;

    // Desktop
    @media (min-width: 768px) {
      gap: $spacing-small;
      padding: $spacing-medium;
    }
  }

  &__btn-paginacion {
    background: $primary-gradient;
    color: $text-color;
    border: none;
    padding: $spacing-small;
    border-radius: $border-radius;
    font-weight: 700;
    font-size: $font-size-small;
    cursor: pointer;
    transition: $transition;
    min-width: 40px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 6px rgba($primary-color, 0.3);

    .videojuegos__btn-pag-texto {
      display: none;
    }

    .videojuegos__btn-pag-icono {
      display: inline;
      font-size: $font-size-base;
    }

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-small $spacing-large;
      font-size: $font-size-base;
      min-width: 100px;

      .videojuegos__btn-pag-texto {
        display: inline;
      }

      .videojuegos__btn-pag-icono {
        display: none;
      }
    }

    &:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0px 4px 8px rgba($primary-color, 0.4);
    }

    &[disabled] {
      background: $color-disabled;
      cursor: not-allowed;
      opacity: 0.6;
      box-shadow: none;

      &:hover {
        transform: none;
      }
    }
  }

  .pagina-info {
    color: rgba($text-color, 0.9);
    font-weight: 500;
    font-size: $font-size-small;
    padding: 0 $spacing-small;
    text-align: center;

    // Desktop
    @media (min-width: 768px) {
      font-size: $font-size-base;
      padding: 0 $spacing-medium;
      min-width: 120px;
    }

    .pagina-info-completa {
      display: none;

      // Desktop
      @media (min-width: 768px) {
        display: inline;
      }
    }

    .pagina-info-corta {
      display: inline;

      // Desktop
      @media (min-width: 768px) {
        display: none;
      }
    }
  }

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $spacing-large;
    color: rgba($text-color, 0.7);
    font-size: $font-size-base;

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-xxl;
    }
  }

  &__error {
    background: rgba($color-error, 0.1);
    border: 1px solid rgba($color-error, 0.3);
    color: $color-error;
    padding: $spacing-medium;
    border-radius: $border-radius;
    text-align: center;
    font-weight: 500;
  }

  * {
    transition: $transition;
  }
}
</style>