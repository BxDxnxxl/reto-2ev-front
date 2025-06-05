<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useEmpresasStore } from '@/stores/empresasStore';
import type { ActualizarAcuerdoDto } from '@/stores/dtos/ActualizarAcuerdo.dto';
import FormEmpresa from '@/components/FormEmpresa.vue';
import Swal from 'sweetalert2';

const store = useEmpresasStore();
const mostrarFormulario = ref(false);

// Paginación
const currentPage = ref(1);
const itemsPerPage = ref(10);

onMounted(() => {
  store.fetchEmpresasConAfiliados();
});

// Computed para la paginación
const totalPages = computed(() => {
  return Math.ceil((store.empresasConAfiliados?.length || 0) / itemsPerPage.value);
});

const empresasPaginadas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return store.empresasConAfiliados?.slice(start, end) || [];
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

function desactivarEmpresa(id: number) {
  console.log('Desactivar empresa', id);
}

async function borrarEmpresa(id: number) {
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
    await store.deleteEmpresa(id);
    await store.fetchEmpresasConAfiliados();
    
    // Ajustar página si es necesario después de eliminar
    if (empresasPaginadas.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1;
    }
    
    Swal.fire({
      title: 'Eliminada',
      text: 'La empresa ha sido eliminada.',
      icon: 'success',
      confirmButtonColor: '#10b981'
    });
  }
}

async function guardarEmpresa(empresa: FormData) {
  await store.addEmpresa(empresa);
  await store.fetchEmpresasConAfiliados();
  mostrarFormulario.value = false;
}

async function onActualizarAcuerdo(idEmpresa: number, nuevoAcuerdo: number) {
  const { ok, mensaje } = await store.actualizarAcuerdo(idEmpresa, nuevoAcuerdo);

  if (ok) {
    Swal.fire('Actualizado', mensaje, 'success');
  } else {
    Swal.fire('Error', mensaje, 'error');
  }
}

function getAcuerdoTexto(acuerdo: number): string {
  switch(acuerdo) {
    case 0: return 'Sin acuerdo';
    case 1: return 'Plan Básico';
    case 2: return 'Plan Avanzado';
    case 3: return 'Plan Premium';
    default: return 'Sin acuerdo';
  }
}
</script>

<template>
  <div class="empresas">
    <v-container class="empresas__contenedor" fluid>
      <!-- Título y botón centrados arriba -->
      <div class="empresas__header">
        <h2 class="empresas__titulo">🏢 Gestión de Empresas</h2>
        <v-btn 
          class="empresas__btn-crear" 
          color="primary" 
          size="large"
          prepend-icon="mdi-plus-circle-outline"
          @click="mostrarFormulario = true"
        >
          <span class="empresas__btn-texto">Añadir Empresa</span>
        </v-btn>
      </div>

      <!-- Controles simples -->
      <div class="empresas__controles">
        <div class="empresas__info">
          <span class="empresas__info-texto">Mostrando {{ empresasPaginadas.length }} de {{ store.empresasConAfiliados?.length || 0 }} empresas</span>
        </div>
        
        <div class="empresas__items-por-pagina">
          <label>Mostrar:</label>
          <select 
            :value="itemsPerPage" 
            @change="cambiarItemsPorPagina"
            class="empresas__select-items"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <!-- Vista móvil: Cards -->
      <div class="empresas__cards-movil">
        <div 
          v-for="empresa in empresasPaginadas" 
          :key="empresa.id" 
          class="empresas__card"
        >
          <div class="empresas__card-header">
            <h3 class="empresas__card-titulo">{{ empresa.nombre }}</h3>
            <v-chip
              :color="empresa.activa ? 'success' : 'error'"
              size="small"
              class="empresas__card-estado"
            >
              {{ empresa.activa ? 'Activa' : 'Inactiva' }}
            </v-chip>
          </div>
          
          <div class="empresas__card-info">
            <div class="empresas__card-item">
              <span class="empresas__card-label">Web:</span>
              <span class="empresas__card-value">{{ empresa.web }}</span>
            </div>
            
            <div class="empresas__card-item">
              <span class="empresas__card-label">Acuerdo:</span>
              <select
                v-model.number="empresa.acuerdo"
                @change="onActualizarAcuerdo(empresa.id, empresa.acuerdo)"
                class="empresas__select-acuerdo"
              >
                <option :value="0">Sin acuerdo</option>
                <option :value="1">Plan Básico</option>
                <option :value="2">Plan Avanzado</option>
                <option :value="3">Plan Premium</option>
              </select>
            </div>
            
            <div class="empresas__card-item">
              <span class="empresas__card-label">Destacadas Mensuales:</span>
              <span class="empresas__card-value">{{ empresa.limiteDestacadasMensual }}</span>
            </div>
            
            <div class="empresas__card-item">
              <span class="empresas__card-label">Afiliados:</span>
              <span class="empresas__card-value">{{ empresa.numeroAfiliados }}</span>
            </div>
          </div>
          
          <div class="empresas__card-acciones">
            <v-btn 
              color="warning" 
              size="small"
              variant="outlined"
              @click="desactivarEmpresa(empresa.id)"
              class="empresas__btn-desactivar"
            >
              Desactivar
            </v-btn>
            <v-btn 
              color="error" 
              size="small"
              variant="outlined"
              @click="borrarEmpresa(empresa.id)"
              class="empresas__btn-eliminar"
            >
              Eliminar
            </v-btn>
          </div>
        </div>

        <!-- Estado vacío para móvil -->
        <div v-if="store.empresasConAfiliados?.length === 0" class="estado-vacio">
          <p>No hay empresas disponibles</p>
          <v-btn 
            color="primary" 
            @click="mostrarFormulario = true"
          >
            Añadir primera empresa
          </v-btn>
        </div>
      </div>

      <!-- Vista desktop: Tabla -->
      <div class="empresas__tabla-contenedor">
        <v-table class="empresas__tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Web</th>
              <th>Acuerdo</th>
              <th>Destacadas</th>
              <th>Afiliados</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="empresa in empresasPaginadas" :key="empresa.id">
              <td>{{ empresa.nombre }}</td>
              <td>{{ empresa.web }}</td>
              <td>
                <select
                  v-model.number="empresa.acuerdo"
                  @change="onActualizarAcuerdo(empresa.id, empresa.acuerdo)"
                  class="empresas__select-acuerdo-tabla"
                >
                  <option :value="0">Sin acuerdo</option>
                  <option :value="1">Plan Básico</option>
                  <option :value="2">Plan Avanzado</option>
                  <option :value="3">Plan Premium</option>
                </select>
              </td>
              <td>{{ empresa.limiteDestacadasMensual }}</td>
              <td>{{ empresa.numeroAfiliados }}</td>
              <td>
                <v-chip
                  :color="empresa.activa ? 'success' : 'error'"
                  size="small"
                >
                  {{ empresa.activa ? 'Activa' : 'Inactiva' }}
                </v-chip>
              </td>
              <td>
                <div class="empresas__acciones-tabla">
                  <v-btn 
                    color="warning" 
                    size="small"
                    variant="outlined"
                    @click="desactivarEmpresa(empresa.id)"
                  >
                    Desactivar
                  </v-btn>
                  <v-btn 
                    color="error" 
                    size="small"
                    variant="outlined"
                    @click="borrarEmpresa(empresa.id)"
                  >
                    Eliminar
                  </v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>

        <!-- Estado vacío para desktop -->
        <div v-if="store.empresasConAfiliados?.length === 0" class="estado-vacio">
          <p>No hay empresas disponibles</p>
          <v-btn 
            color="primary" 
            @click="mostrarFormulario = true"
          >
            Añadir primera empresa
          </v-btn>
        </div>
      </div>

      <!-- Paginación simple -->
      <div class="empresas__paginacion" v-if="totalPages > 1">
        <v-btn 
          :disabled="currentPage === 1"
          @click="cambiarPagina(currentPage - 1)"
          size="small"
          class="empresas__btn-paginacion"
        >
          <span class="empresas__btn-pag-texto">Anterior</span>
          <span class="empresas__btn-pag-icono">‹</span>
        </v-btn>

        <span class="pagina-info">
          <span class="pagina-info-completa">Página {{ currentPage }} de {{ totalPages }}</span>
          <span class="pagina-info-corta">{{ currentPage }}/{{ totalPages }}</span>
        </span>

        <v-btn 
          :disabled="currentPage === totalPages"
          @click="cambiarPagina(currentPage + 1)"
          size="small"
          class="empresas__btn-paginacion"
        >
          <span class="empresas__btn-pag-texto">Siguiente</span>
          <span class="empresas__btn-pag-icono">›</span>
        </v-btn>
      </div>
    </v-container>

    <!-- Modal del formulario -->
    <v-dialog 
      v-model="mostrarFormulario" 
      max-width="900"
      persistent
    >
      <FormEmpresa @guardarEmpresa="guardarEmpresa" />
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

.empresas {
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

    .empresas__btn-texto {
      display: none;
    }

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-medium $spacing-large;
      font-size: $font-size-base;

      .empresas__btn-texto {
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
  }

  &__select-items {
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

  &__btn-desactivar,
  &__btn-eliminar {
    min-width: 80px;
  }

  &__select-acuerdo {
    width: 100%;
    max-width: none;
    padding: 0.6rem 0.8rem;
    font-size: $font-size-small;
    border: 1px solid $color-disabled;
    border-radius: $border-radius;
    background-color: white;
    color: $primary-color;
    transition: $transition;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
    }

    option {
      color: $dark-color;
    }
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

      &:nth-child(1) { width: 20%; }
      &:nth-child(2) { width: 20%; }
      &:nth-child(3) { width: 15%; text-align: center; }
      &:nth-child(4) { width: 10%; text-align: center; }
      &:nth-child(5) { width: 10%; text-align: center; }
      &:nth-child(6) { width: 10%; text-align: center; }
      &:nth-child(7) { width: 15%; text-align: center; }
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
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &:nth-child(2) {
        color: rgba($text-color, 0.9);
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &:nth-child(3) {
        text-align: center;
      }

      &:nth-child(4) {
        text-align: center;
        font-weight: 600;
        color: $primary-color;
      }

      &:nth-child(5) {
        text-align: center;
        font-weight: 600;
        color: $primary-color;
      }

      &:nth-child(6) {
        text-align: center;
      }

      &:nth-child(7) {
        text-align: center;
      }
    }

    tr {
      height: 70px;
    }
  }

  &__select-acuerdo-tabla {
    padding: $spacing-extra-small $spacing-small;
    font-size: $font-size-small;
    border: 1px solid $color-disabled;
    border-radius: $border-radius;
    background-color: white;
    color: $primary-color;
    transition: $transition;
    width: 100%;
    max-width: 140px;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
    }

    option {
      color: $dark-color;
    }
  }

  &__acciones-tabla {
    display: flex;
    gap: $spacing-extra-small;
    justify-content: center;
    flex-wrap: wrap;
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
      content: "🏢";
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

    .empresas__btn-pag-texto {
      display: none;
    }

    .empresas__btn-pag-icono {
      display: inline;
      font-size: $font-size-base;
    }

    // Desktop
    @media (min-width: 768px) {
      padding: $spacing-small $spacing-large;
      font-size: $font-size-base;
      min-width: 100px;

      .empresas__btn-pag-texto {
        display: inline;
      }

      .empresas__btn-pag-icono {
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
}
</style>