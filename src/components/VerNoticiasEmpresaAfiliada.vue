<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { usePublicacionesEmpresasStore } from '@/stores/publicacionesEmpresasStore';
import { useUsersStore } from '@/stores/users';
import FormPublicarNoticia from '@/components/FormPublicarNoticia.vue';
import type { PublicacionEmpresaDto } from '@/stores/dtos/PublicacionEmpresa.dto';
import { useUsuariosEmpresasStore } from '@/stores/usuariosEmpresasStore';
import Swal from 'sweetalert2';

const store = usePublicacionesEmpresasStore();
const usuariosEmpresasStore = useUsuariosEmpresasStore();
const usersStore = useUsersStore();

const mostrarFormulario = ref(false);
const publicacionEnEdicion = ref<PublicacionEmpresaDto | undefined>(undefined);

// Paginación
const currentPage = ref(1);
const itemsPerPage = ref(10);

onMounted(() => {
  store.fetchPublicaciones();
});

// Computed para la paginación
const totalPages = computed(() => {
  return Math.ceil((store.publicaciones?.length || 0) / itemsPerPage.value);
});

const publicacionesPaginadas = computed(() => {
  const publicaciones = store.publicaciones || [];
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return publicaciones.slice(start, end);
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

function cambiarItemsPorPagina(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target) return

  const value = Number(target.value)
  if (isNaN(value) || value <= 0) return

  itemsPerPage.value = value
  currentPage.value = 1 
}

function abrirFormularioNueva() {
  publicacionEnEdicion.value = undefined;
  mostrarFormulario.value = true;
}

function editarPublicacion(publicacion: PublicacionEmpresaDto) {
  publicacionEnEdicion.value = { ...publicacion };
  mostrarFormulario.value = true;
}

async function guardarPublicacion(formData: FormData) {
  try {
    const userId = usersStore.currentUser?.id;
    if (!userId) throw new Error('Usuario no logeado');

    const empresasAfiliadas = await usuariosEmpresasStore.getEmpresasDeUsuario(userId);
    if (empresasAfiliadas.length === 0) {
      throw new Error('Este usuario no está afiliado a ninguna empresa.');
    }

    formData.set("FkIdEmpresa", empresasAfiliadas[0].toString());
    formData.set("FkIdUsuario", userId.toString());

    await store.addPublicacion(formData);
    mostrarFormulario.value = false;
    
    // Ajustar página si es necesario después de agregar
    if (publicacionesPaginadas.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1;
    }
  } catch (error) {
    console.error('Error al guardar publicación:', error);
  }
}

async function borrarPublicacion(id: number) {
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
    await store.deletePublicacion(id);
    
    // Ajustar página si es necesario después de eliminar
    if (publicacionesPaginadas.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1;
    }
    
    Swal.fire({
      title: 'Eliminado',
      text: 'La publicación ha sido eliminada.',
      icon: 'success',
      confirmButtonColor: '#10b981'
    });
  }
}
</script>

<template>
  <div class="publicaciones">
    <v-container class="publicaciones__contenedor" fluid>
      <!-- Título y botón centrados arriba -->
      <div class="publicaciones__header">
        <h2 class="publicaciones__titulo">📰 Gestión de Publicaciones</h2>
        <v-btn 
          class="publicaciones__btn-crear" 
          color="primary" 
          size="large"
          prepend-icon="mdi-plus-circle-outline"
          @click="abrirFormularioNueva"
        >
          <span class="publicaciones__btn-texto">Nueva Publicación</span>
        </v-btn>
      </div>

      <!-- Controles simples -->
      <div class="publicaciones__controles">
        <div class="publicaciones__info">
          <span class="publicaciones__info-texto">Mostrando {{ publicacionesPaginadas.length }} de {{ store.publicaciones?.length || 0 }} publicaciones</span>
        </div>
        
        <div class="publicaciones__items-por-pagina">
          <label>Mostrar:</label>
          <select 
            :value="itemsPerPage" 
            @change="cambiarItemsPorPagina"
            class="publicaciones__select-items"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <!-- Vista móvil: Cards -->
      <div class="publicaciones__cards-movil">
        <div 
          v-for="pub in publicacionesPaginadas" 
          :key="pub.id"
          class="publicaciones__card"
        >
          <div class="publicaciones__card-header">
            <h3 class="publicaciones__card-titulo">{{ pub.titulo }}</h3>
            <span 
              :class="['estado-badge', pub.esDestacada ? 'estado-badge--destacada' : 'estado-badge--normal']"
            >
              {{ pub.esDestacada ? 'Destacada' : 'Normal' }}
            </span>
          </div>
          
          <div class="publicaciones__card-info">
            <div class="publicaciones__card-item">
              <span class="publicaciones__card-label">Fecha:</span>
              <span class="publicaciones__card-value">{{ new Date(pub.fechaPublicacion).toLocaleDateString() }}</span>
            </div>
          </div>
          
          <div class="publicaciones__card-acciones">
            <v-btn 
              color="primary" 
              size="small"
              variant="outlined"
              @click="editarPublicacion(pub)"
              class="publicaciones__btn-accion"
            >
              Editar
            </v-btn>
            <v-btn 
              color="error" 
              size="small"
              variant="outlined"
              @click="borrarPublicacion(pub.id)"
              class="publicaciones__btn-accion"
            >
              Eliminar
            </v-btn>
          </div>
        </div>

        <!-- Estado vacío para móvil -->
        <div v-if="store.publicaciones?.length === 0" class="estado-vacio">
          <p>No hay publicaciones disponibles</p>
          <v-btn 
            color="primary" 
            @click="abrirFormularioNueva"
          >
            Añadir primera publicación
          </v-btn>
        </div>
      </div>

      <!-- Vista desktop: Tabla -->
      <div class="publicaciones__tabla-contenedor">
        <v-table class="publicaciones__tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pub in publicacionesPaginadas" :key="pub.id">
              <td>{{ pub.titulo }}</td>
              <td>{{ new Date(pub.fechaPublicacion).toLocaleDateString() }}</td>
              <td>
                <span 
                  :class="['estado-badge', pub.esDestacada ? 'estado-badge--destacada' : 'estado-badge--normal']"
                >
                  {{ pub.esDestacada ? 'Destacada' : 'Normal' }}
                </span>
              </td>
              <td>
                <div class="publicaciones__tabla-acciones">
                  <v-btn 
                    color="primary" 
                    size="small"
                    variant="outlined"
                    @click="editarPublicacion(pub)"
                    class="publicaciones__btn-tabla"
                  >
                    Editar
                  </v-btn>
                  <v-btn 
                    color="error" 
                    size="small"
                    variant="outlined"
                    @click="borrarPublicacion(pub.id)"
                    class="publicaciones__btn-tabla"
                  >
                    Eliminar
                  </v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>

        <!-- Estado vacío para desktop -->
        <div v-if="store.publicaciones?.length === 0" class="estado-vacio">
          <p>No hay publicaciones disponibles</p>
          <v-btn 
            color="primary" 
            @click="abrirFormularioNueva"
          >
            Añadir primera publicación
          </v-btn>
        </div>
      </div>

      <!-- Paginación simple -->
      <div class="publicaciones__paginacion" v-if="totalPages > 1">
        <v-btn 
          :disabled="currentPage === 1"
          @click="cambiarPagina(currentPage - 1)"
          size="small"
          class="publicaciones__btn-paginacion"
        >
          <span class="publicaciones__btn-pag-texto">Anterior</span>
          <span class="publicaciones__btn-pag-icono">‹</span>
        </v-btn>

        <span class="pagina-info">
          <span class="pagina-info-completa">Página {{ currentPage }} de {{ totalPages }}</span>
          <span class="pagina-info-corta">{{ currentPage }}/{{ totalPages }}</span>
        </span>

        <v-btn 
          :disabled="currentPage === totalPages"
          @click="cambiarPagina(currentPage + 1)"
          size="small"
          class="publicaciones__btn-paginacion"
        >
          <span class="publicaciones__btn-pag-texto">Siguiente</span>
          <span class="publicaciones__btn-pag-icono">›</span>
        </v-btn>
      </div>
    </v-container>

    <!-- Modal del formulario -->
    <v-dialog 
      v-model="mostrarFormulario" 
      max-width="900"
      persistent
    >
      <FormPublicarNoticia :publicacion="publicacionEnEdicion" @guardar="guardarPublicacion" />
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

.publicaciones {
  padding: 0;
  background-color: $background-color;
  color: $text-color;
  min-height: 100vh;

  // Tablet y desktop
  @media (min-width: 768px) {
    padding: 0;
  }

  &__contenedor {
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
    padding: 0;

    // Desktop
    @media (min-width: 1024px) {
      max-width: 1400px;
      gap: $spacing-large;
    }
  }

  &__header {
    text-align: center;
    padding: $spacing-large $spacing-medium;
    background: $card-background;
    border-radius: 0;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
    align-items: center;
    border: none;
    margin: 0;
    width: 100%;

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-xl;
      gap: $spacing-large;
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

    .publicaciones__btn-texto {
      display: none;
    }

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-medium $spacing-large;
      font-size: $font-size-base;

      .publicaciones__btn-texto {
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
    border-radius: 0;
    box-shadow: none;
    flex-wrap: wrap;
    gap: $spacing-small;
    border: none;
    margin: 0 $spacing-small;

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-medium $spacing-large;
      gap: $spacing-medium;
      margin: 0 $spacing-medium;
      border-radius: $border-radius;
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
          content: "{{ publicacionesPaginadas.length }}/{{ store.publicaciones?.length || 0 }}";
        }
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
    padding: 0 $spacing-small;

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
    gap: $spacing-small;
    margin-top: $spacing-small;
    padding-top: $spacing-small;
    border-top: 1px solid rgba($primary-color, 0.1);
  }

  &__btn-accion {
    flex: 1;
    max-width: 120px;
  }

  // Vista desktop con tabla
  &__tabla-contenedor {
    display: none;

    // Mostrar solo en desktop
    @media (min-width: 768px) {
      display: block;
      background: $card-background;
      border-radius: $border-radius;
      box-shadow: none;
      overflow-x: auto;
      border: 1px solid rgba($primary-color, 0.2);
      margin: 0 $spacing-medium;

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
      font-weight: 700;
      color: $primary-color;
      padding: $spacing-large;
      font-size: $font-size-base;
      text-align: left;
      border-bottom: 2px solid $primary-color;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
      position: sticky;
      top: 0;
      z-index: 10;

      &:nth-child(1) { width: 40%; }
      &:nth-child(2) { width: 20%; text-align: center; }
      &:nth-child(3) { width: 20%; text-align: center; }
      &:nth-child(4) { width: 20%; text-align: center; }
    }

    td {
      padding: $spacing-large;
      font-size: $font-size-base;
      color: $text-color;
      background-color: $card-background;
      border-bottom: 1px solid rgba($primary-color, 0.2);
      text-align: left;
      vertical-align: middle;
      line-height: 1.5;

      &:nth-child(1) {
        font-weight: 600;
        color: $primary-color;
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &:nth-child(2) {
        text-align: center;
        font-weight: 600;
        color: $primary-color;
      }

      &:nth-child(3) {
        text-align: center;
      }

      &:nth-child(4) {
        text-align: center;
      }
    }

    tr {
      height: 70px;
    }
  }

  &__tabla-acciones {
    display: flex;
    justify-content: center;
    gap: $spacing-small;
  }

  &__btn-tabla {
    min-width: 80px;
  }

  .estado-badge {
    padding: $spacing-extra-small $spacing-small;
    border-radius: $border-radius;
    font-size: $font-size-small;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    border: 1px solid;
    display: inline-block;
    min-width: 80px;
    text-align: center;
    flex-shrink: 0;

    &--destacada {
      background: rgba(#10b981, 0.15);
      color: #10b981;
      border-color: rgba(#10b981, 0.3);
    }

    &--normal {
      background: rgba($primary-color, 0.15);
      color: $primary-color;
      border-color: rgba($primary-color, 0.3);
    }
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
      content: "📰";
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
    border-radius: 0;
    box-shadow: none;
    border: none;
    flex-wrap: wrap;
    margin: 0 $spacing-small;

    // Desktop
    @media (min-width: 768px) {
      gap: $spacing-small;
      padding: $spacing-medium;
      margin: 0 $spacing-medium;
      border-radius: $border-radius;
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

    .publicaciones__btn-pag-texto {
      display: none;
    }

    .publicaciones__btn-pag-icono {
      display: inline;
      font-size: $font-size-base;
    }

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-small $spacing-large;
      font-size: $font-size-base;
      min-width: 100px;

      .publicaciones__btn-pag-texto {
        display: inline;
      }

      .publicaciones__btn-pag-icono {
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
}
</style>