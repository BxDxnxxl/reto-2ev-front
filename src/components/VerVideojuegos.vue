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

function toggleDestacado(videojuego: any) {
  videojuego.destacado = !videojuego.destacado;
  console.log('Toggle destacado videojuego', videojuego.id, videojuego.destacado);
  // Aquí podrías hacer una llamada al backend para actualizar el estado
}

async function borrarVideojuego(id: number) {
  const confirm = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
  });

  if (confirm.isConfirmed) {
    await store.deleteVideojuego(id);
    await store.fetchVideojuegos();
    
    // Ajustar página si es necesario después de eliminar
    if (videojuegosPaginados.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1;
    }
    
    Swal.fire('Eliminado', 'El videojuego ha sido eliminado.', 'success');
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
      <div class="videojuegos__header">
        <h2 class="videojuegos__titulo">Gestión de Videojuegos</h2>
        <v-btn 
          class="videojuegos__btn-crear" 
          color="primary" 
          elevation="2"
          prepend-icon="mdi-plus-circle-outline"
          @click="mostrarFormulario = true"
        >
          Añadir Videojuego
        </v-btn>
      </div>

      <!-- Controles de paginación superior -->
      <div class="videojuegos__controles">
        <div class="videojuegos__info">
          Mostrando {{ ((currentPage - 1) * itemsPerPage) + 1 }} - {{ Math.min(currentPage * itemsPerPage, store.games?.length || 0) }} 
          de {{ store.games?.length || 0 }} videojuegos
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

      <div class="videojuegos__tabla-contenedor">
        <v-table class="videojuegos__tabla" density="comfortable">
          <thead><tr>
          <th>Título</th>
          <th>Descripción</th>
          <th>Año de salida</th>
          <th>PEGI</th>
          <th>Acciones</th></tr>
          </thead>
          <tbody><tr v-for="v in store.games" :key="v.id">
          <td>{{ v.titulo }}</td>
          <td>{{ v.descripcion }}</td>
          <td>{{ v.anioSalida }}</td>
          <td>{{ v.pegi }}</td>
          <td>
            <button class="ver-empresas__boton--eliminar" @click="store.deleteVideojuego(v.id)">
              Eliminar
            </button>
          </td></tr>
          </tbody>
        </v-table>
      </div>

      <!-- Paginación -->
      <div class="videojuegos__paginacion" v-if="totalPages > 1">
        <v-btn 
          icon 
          size="small" 
          variant="text"
          :disabled="currentPage === 1"
          @click="cambiarPagina(currentPage - 1)"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <template v-for="page in paginasVisibles" :key="page">
          <span v-if="page === '...'" class="videojuegos__paginacion-puntos">...</span>
          <v-btn 
            v-else
            size="small"
            :variant="page === currentPage ? 'elevated' : 'text'"
            :color="page === currentPage ? 'primary' : 'default'"
            @click="cambiarPagina(page)"
            class="videojuegos__paginacion-btn"
          >
            {{ page }}
          </v-btn>
        </template>

        <v-btn 
          icon 
          size="small" 
          variant="text"
          :disabled="currentPage === totalPages"
          @click="cambiarPagina(currentPage + 1)"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </v-container>

    <v-dialog v-model="mostrarFormulario" max-width="600">
      <FormVideojuego @guardarVideojuego="guardarVideojuego" />
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.videojuegos {
  $color-text: #374151;
  $color-text-secondary: #6b7280;
  $color-border: #e5e7eb;

  &__contenedor {
    padding: 2rem 1rem;
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;

    .videojuegos__titulo {
      font-size: 1.8rem;
      font-weight: bold;
      margin: 0;
    }

    .videojuegos__btn-crear {
      font-weight: bold;
      height: 42px;
      font-size: 0.95rem;
    }
  }

  &__controles {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 8px;
    border: 1px solid $color-border;
  }

  &__info {
    font-size: 0.9rem;
    color: $color-text-secondary;
    font-weight: 500;
  }

  &__items-por-pagina {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: $color-text-secondary;

    label {
      font-weight: 500;
    }
  }

  &__select-items {
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
    border: 1px solid $color-border;
    border-radius: 6px;
    background-color: #ffffff;
    color: $color-text-secondary;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #3b82f6;
    }
  }

  &__tabla-contenedor {
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  &__tabla {
    width: 100%;
    min-width: 1200px;
    border-collapse: collapse;

    th {
      background-color: #f3f4f6;
      font-weight: 600;
      padding: 1rem;
      color: $color-text;
      text-align: center;
    }

    td {
      padding: 0.9rem;
      color: $color-text-secondary;
      text-align: center;
      border-bottom: 1px solid $color-border;
    }

    tr:hover {
      background-color: #f9fafb;
    }
  }

  &__titulo-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  &__desarrollador {
    font-size: 0.8rem;
    color: $color-text-secondary;
    opacity: 0.8;
  }

  &__plataforma-text {
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }

  &__precio {
    font-weight: 600;
    color: #059669;
  }

  &__rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  &__rating-text {
    font-size: 0.8rem;
    color: $color-text-secondary;
  }

  &__paginacion {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    flex-wrap: wrap;
  }

  &__paginacion-btn {
    min-width: 40px;
    height: 40px;
  }

  &__paginacion-puntos {
    color: $color-text-secondary;
    font-weight: 500;
    padding: 0 0.5rem;
  }

  @media (max-width: 768px) {
    &__controles {
      flex-direction: column;
      align-items: stretch;
      
      .videojuegos__info {
        text-align: center;
      }
      
      .videojuegos__items-por-pagina {
        justify-content: center;
      }
    }
    
    &__paginacion {
      gap: 0.25rem;
      
      .videojuegos__paginacion-btn {
        min-width: 36px;
        height: 36px;
        font-size: 0.85rem;
      }
    }

    &__tabla {
      min-width: 1000px;
    }
  }
}
</style>