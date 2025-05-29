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
.videojuegos {
  padding: 2rem;

  &__contenedor {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__header {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  &__titulo {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0;
  }

  &__btn-crear {
    font-weight: 600;
  }

  &__controles {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__info {
    color: #4a5568;
    font-weight: 500;
  }

  &__items-por-pagina {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    label {
      color: #4a5568;
      font-weight: 500;
    }
  }

  &__select-items {
    padding: 0.25rem 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    background: white;
  }

  &__tabla-contenedor {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  &__tabla {
    th {
      background: #f8fafc;
      font-weight: 600;
      color: #1a202c;
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    tr:hover {
      background: #f8fafc;
    }
  }

  .pegi-badge {
    background: #e2e8f0;
    color: #4a5568;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .estado-vacio {
    text-align: center;
    padding: 3rem;
    color: #718096;
  }

  &__paginacion {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .pagina-info {
    color: #4a5568;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    padding: 1rem;

    &__header {
      padding: 1.5rem;
    }

    &__titulo {
      font-size: 1.5rem;
    }

    &__controles {
      flex-direction: column;
      text-align: center;
    }

    &__tabla-contenedor {
      overflow-x: auto;
    }

    &__paginacion {
      flex-wrap: wrap;
    }
  }
}
</style>