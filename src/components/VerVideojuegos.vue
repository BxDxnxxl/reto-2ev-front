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
          Añadir Videojuego
        </v-btn>
      </div>

      <!-- Controles simples -->
      <div class="videojuegos__controles">
        <div class="videojuegos__info">
          Mostrando {{ videojuegosPaginados.length }} de {{ store.games?.length || 0 }} videojuegos
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

      <!-- Tabla simple -->
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

        <!-- Estado vacío -->
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
        >
          Anterior
        </v-btn>

        <span class="pagina-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>

        <v-btn 
          :disabled="currentPage === totalPages"
          @click="cambiarPagina(currentPage + 1)"
          size="small"
        >
          Siguiente
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
  padding: $spacing-large;
  background-color: $background-color;
  color: $text-color;
  min-height: 100vh;

  &__contenedor {
    max-width: 1400px; // Aumentado para dar más espacio a la tabla
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: $spacing-large;
  }

  &__header {
    text-align: center;
    padding: $spacing-xl;
    background: $card-background;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
    align-items: center;
    border: 1px solid rgba($primary-color, 0.2);
  }

  &__titulo {
    font-size: $font-size-xlarge;
    font-weight: 700;
    color: $text-color;
    margin: 0;
    background: $primary-gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__btn-crear {
    font-weight: 600;
    background: $primary-gradient;
    color: $text-color;
    border-radius: $border-radius;
    padding: $spacing-medium $spacing-large;
    font-size: $font-size-base;
    border: none;
    cursor: pointer;
    transition: $transition;
    box-shadow: $box-shadow;
    text-transform: uppercase;
    letter-spacing: 0.5px;

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
    justify-content: space-between; // Mejor distribución del espacio
    align-items: center;
    padding: $spacing-medium $spacing-large;
    background: $card-background;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    flex-wrap: wrap;
    gap: $spacing-medium;
    border: 1px solid rgba($primary-color, 0.1);
  }

  &__info {
    color: rgba($text-color, 0.8);
    font-weight: 500;
    font-size: $font-size-small;
  }

  &__items-por-pagina {
    display: flex;
    align-items: center;
    gap: $spacing-small;

    label {
      color: rgba($text-color, 0.8);
      font-weight: 500;
      font-size: $font-size-small;
      white-space: nowrap;
    }

    select {
      padding: $spacing-small $spacing-medium;
      border-radius: $border-radius;
      border: 1px solid $color-disabled;
      background-color: $card-background;
      color: $text-color;
      font-size: $font-size-small;
      transition: $transition;
      min-width: 60px;

      &:focus {
        outline: none;
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
      }
    }
  }

  &__tabla-contenedor {
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

  &__tabla {
    width: 100%;
    border-collapse: collapse;
    font-size: $font-size-base;
    table-layout: auto; // Permite que las columnas se ajusten automáticamente

    th {
      background: $card-background;
      font-weight: 600;
      color: $primary-color;
      padding: $spacing-medium $spacing-large; // Más padding horizontal
      font-size: $font-size-base; // Tamaño de fuente más grande
      text-align: left; // Alineación a la izquierda para mejor legibilidad
      border-bottom: 2px solid #ff8c00; // Línea naranja
      border-right: 1px solid #ff8c00; // Separadores verticales naranjas
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
      position: sticky;
      top: 0;
      z-index: 10;

      &:last-child {
        border-right: none;
      }

      // Columnas específicas con anchos optimizados
      &:nth-child(1) { width: 15%; } // ID
      &:nth-child(2) { width: 25%; } // Nombre
      &:nth-child(3) { width: 15%; } // Género
      &:nth-child(4) { width: 15%; } // Plataforma
      &:nth-child(5) { width: 10%; } // PEGI
      &:nth-child(6) { width: 10%; } // Precio
      &:nth-child(7) { width: 10%; } // Acciones
    }

    td {
      padding: $spacing-medium $spacing-large; // Más padding horizontal
      font-size: $font-size-base;
      color: $primary-color;
      background-color: $card-background;
      border-bottom: 1px solid #ff8c00; // Línea naranja
      border-right: 1px solid rgba(#ff8c00, 0.3); // Separadores verticales naranjas más suaves
      transition: $transition;
      text-align: left; // Alineación a la izquierda
      vertical-align: middle;
      line-height: 1.5;

      &:last-child {
        border-right: none;
        text-align: center; // Centrar solo la columna de acciones
      }

      // Ajustes específicos por tipo de contenido
      &:nth-child(1) { // ID
        font-weight: 600;
        text-align: center;
      }

      &:nth-child(2) { // Nombre
        font-weight: 500;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &:nth-child(5) { // PEGI
        text-align: center;
      }

      &:nth-child(6) { // Precio
        text-align: right;
        font-weight: 600;
      }
    }

    tr:hover td {
      background-color: rgba($primary-color, 0.05);
      transform: scale(1.01);
    }

    tr:nth-child(even) td {
      background-color: rgba($card-background, 0.8);
    }

    // Mejor espaciado entre filas
    tr {
      height: 60px; // Altura mínima para las filas
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
  }

  .estado-vacio {
    text-align: center;
    padding: $spacing-xxl;
    color: rgba($text-color, 0.6);
    font-size: $font-size-large;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &::before {
      content: "🎮";
      display: block;
      font-size: 3rem;
      margin-bottom: $spacing-medium;
      opacity: 0.5;
    }
  }

  &__paginacion {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $spacing-small;
    padding: $spacing-medium;
    background: $card-background;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    border: 1px solid rgba($primary-color, 0.1);
    flex-wrap: wrap;

    button {
      background: $primary-gradient;
      color: $text-color;
      border: none;
      padding: $spacing-small $spacing-large;
      border-radius: $border-radius;
      font-weight: 700;
      font-size: $font-size-base;
      cursor: pointer;
      transition: $transition;
      min-width: 100px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 6px rgba($primary-color, 0.3);

      &:hover:not(.disabled) {
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px rgba($primary-color, 0.4);
      }

      &.disabled {
        background: $color-disabled;
        cursor: not-allowed;
        opacity: 0.6;
        box-shadow: none;

        &:hover {
          transform: none;
        }
      }

      &.current {
        background: $text-color;
        color: $primary-color;
        font-weight: 800;
        border: 2px solid $primary-color;
      }
    }

    .pagina-info {
      color: rgba($text-color, 0.9);
      font-weight: 500;
      font-size: $font-size-base;
      padding: 0 $spacing-medium;
      min-width: 120px;
      text-align: center;
    }
  }

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $spacing-xxl;
    color: rgba($text-color, 0.7);
    font-size: $font-size-base;
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

  @media (max-width: $desktop) {
    padding: $spacing-medium;

    &__contenedor {
      max-width: 100%;
    }

    &__header {
      padding: $spacing-large;
    }

    &__titulo {
      font-size: $font-size-large;
    }

    &__controles {
      flex-direction: column;
      text-align: center;
      gap: $spacing-medium;
      justify-content: center;
    }

    &__paginacion {
      flex-wrap: wrap;
      gap: $spacing-extra-small;

      button {
        min-width: 35px;
        height: 35px;
        font-size: $font-size-small;
      }
    }

    &__tabla-contenedor {
      font-size: $font-size-small;
    }

    &__tabla {
      th, td {
        padding: $spacing-small $spacing-medium;
      }

      th {
        font-size: $font-size-small;
      }
    }
  }

  @media (max-width: 768px) {
    &__tabla {
      th, td {
        padding: $spacing-extra-small $spacing-small;
        font-size: $font-size-small;
      }

      tr {
        height: 50px;
      }
    }
  }

  @media (max-width: 480px) {
    padding: $spacing-small;

    &__header {
      padding: $spacing-medium;
    }

    &__titulo {
      font-size: $font-size-base;
    }

    &__btn-crear {
      padding: $spacing-small $spacing-medium;
      font-size: $font-size-small;
    }

    &__tabla {
      font-size: $font-size-small;

      th, td {
        padding: $spacing-extra-small $spacing-small;
      }

      tr {
        height: 45px;
      }
    }
  }

  * {
    transition: $transition;
  }
}
</style>