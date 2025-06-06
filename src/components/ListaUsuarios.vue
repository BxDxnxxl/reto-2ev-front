<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const store = useUsersStore()
const router = useRouter()

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)


onMounted(() => {
  store.fetchUsuarios()
})

const totalPages = computed(() => {
  return Math.ceil(store.users.length / itemsPerPage.value)
})

const usuariosPaginados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return store.users.slice(start, end)
})

function cambiarPagina(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
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

function navigateToAddUser() {
  router.push('/gestionUsuario?edit=false')
}

async function deleteUsuario(id: number) {
  const confirm = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280'
  })

  if (confirm.isConfirmed) {
    await store.deleteUsuario(id)
    
    if (usuariosPaginados.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1
    }
    
    Swal.fire({
      title: 'Eliminado',
      text: 'El usuario ha sido eliminado.',
      icon: 'success',
      confirmButtonColor: '#10b981'
    })
  }
}

function editUsuario(id: number) {
  router.push(`/gestionUsuario?edit=true&id=${id}`)
}
</script>

<template>
  <div class="usuarios">
    <v-container class="usuarios__contenedor" fluid>
      <div class="usuarios__header">
        <h2 class="usuarios__titulo">👥 Gestión de Usuarios</h2>
        <v-btn 
          class="usuarios__btn-crear" 
          color="primary" 
          size="large"
          prepend-icon="mdi-plus-circle-outline"
          @click="navigateToAddUser"
        >
          <span class="usuarios__btn-texto">Añadir Usuario</span>
        </v-btn>
      </div>

      <div class="usuarios__controles">
        <div class="usuarios__info">
          <span class="usuarios__info-texto">Mostrando {{ usuariosPaginados.length }} de {{ store.users?.length || 0 }} usuarios</span>
        </div>
        
        <div class="usuarios__items-por-pagina">
          <label>Mostrar:</label>
          <select 
            :value="itemsPerPage" 
            @change="cambiarItemsPorPagina"
            class="usuarios__select-items"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <div class="usuarios__cards-movil">
        <div 
          v-for="usuario in usuariosPaginados" 
          :key="usuario.id" 
          class="usuarios__card"
        >
          <div class="usuarios__card-header">
            <h3 class="usuarios__card-titulo">{{ usuario.nombre }} {{ usuario.apellido1 }}</h3>
          </div>
          
          <div class="usuarios__card-info">
            <div class="usuarios__card-item">
              <span class="usuarios__card-label">Nombre:</span>
              <span class="usuarios__card-value">{{ usuario.nombre }}</span>
            </div>
            
            <div class="usuarios__card-item">
              <span class="usuarios__card-label">Primer Apellido:</span>
              <span class="usuarios__card-value">{{ usuario.apellido1 }}</span>
            </div>
            
            <div class="usuarios__card-item">
              <span class="usuarios__card-label">Segundo Apellido:</span>
              <span class="usuarios__card-value">{{ usuario.apellido2 }}</span>
            </div>
            
            <div class="usuarios__card-item">
              <span class="usuarios__card-label">Usuario:</span>
              <span class="usuarios__card-value">@{{ usuario.username }}</span>
            </div>
          </div>
          
          <div class="usuarios__card-acciones">
            <v-btn
              color="primary"
              size="small"
              variant="outlined"
              @click="editUsuario(usuario.id || 0)"
              class="usuarios__btn-editar"
            >
              Editar
            </v-btn>
            <v-btn 
              color="error" 
              size="small"
              variant="outlined"
              @click="deleteUsuario(usuario.id || 0)"
              class="usuarios__btn-eliminar"
            >
              Eliminar
            </v-btn>
          </div>
        </div>

        <div v-if="store.users?.length === 0" class="estado-vacio">
          <p>No hay usuarios disponibles</p>
          <v-btn 
            color="primary" 
            @click="navigateToAddUser"
          >
            Añadir primer usuario
          </v-btn>
        </div>
      </div>

      <div class="usuarios__tabla-contenedor">
        <v-table class="usuarios__tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Primer Apellido</th>
              <th>Segundo Apellido</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuariosPaginados" :key="usuario.id">
              <td>{{ usuario.nombre }}</td>
              <td>{{ usuario.apellido1 }}</td>
              <td>{{ usuario.apellido2 }}</td>
              <td>@{{ usuario.username }}</td>
              <td>
                <v-btn
                  color="primary"
                  size="small"
                  variant="outlined"
                  @click="editUsuario(usuario.id || 0)"
                  class="usuarios__btn-tabla-editar"
                >
                  Editar
                </v-btn>
                <v-btn 
                  color="error" 
                  size="small"
                  variant="outlined"
                  @click="deleteUsuario(usuario.id || 0)"
                  class="usuarios__btn-tabla-eliminar"
                >
                  Eliminar
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <div v-if="store.users?.length === 0" class="estado-vacio">
          <p>No hay usuarios disponibles</p>
          <v-btn 
            color="primary" 
            @click="navigateToAddUser"
          >
            Añadir primer usuario
          </v-btn>
        </div>
      </div>

      <div class="usuarios__paginacion" v-if="totalPages > 1">
        <v-btn 
          :disabled="currentPage === 1"
          @click="cambiarPagina(currentPage - 1)"
          size="small"
          class="usuarios__btn-paginacion"
        >
          <span class="usuarios__btn-pag-texto">Anterior</span>
          <span class="usuarios__btn-pag-icono">‹</span>
        </v-btn>

        <span class="pagina-info">
          <span class="pagina-info-completa">Página {{ currentPage }} de {{ totalPages }}</span>
          <span class="pagina-info-corta">{{ currentPage }}/{{ totalPages }}</span>
        </span>

        <v-btn 
          :disabled="currentPage === totalPages"
          @click="cambiarPagina(currentPage + 1)"
          size="small"
          class="usuarios__btn-paginacion"
        >
          <span class="usuarios__btn-pag-texto">Siguiente</span>
          <span class="usuarios__btn-pag-icono">›</span>
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.usuarios {
  padding: 0;
  background-color: $background-color;
  color: $text-color;
  min-height: 100vh;

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

    .usuarios__btn-texto {
      display: none;
    }

    @media (min-width: 768px) {
      padding: $spacing-medium $spacing-large;
      font-size: $font-size-base;

      .usuarios__btn-texto {
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
      
      @media (max-width: 480px) {
        &::before {
          content: "{{ usuariosPaginados.length }}/{{ store.users?.length || 0 }}";
        }
      }
    }
  }

  &__items-por-pagina {
    display: flex;
    align-items: center;
    gap: $spacing-extra-small;
    flex-shrink: 0;

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

  &__cards-movil {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
    padding: 0 $spacing-small;

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

  &__btn-editar,
  &__btn-eliminar {
    min-width: 70px;
  }

  &__tabla-contenedor {
    display: none;

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
      &:nth-child(3) { width: 20%; }
      &:nth-child(4) { width: 20%; }
      &:nth-child(5) { width: 20%; text-align: center; }
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
      }

      &:nth-child(2),
      &:nth-child(3) {
        color: rgba($text-color, 0.9);
      }

      &:nth-child(4) {
        font-weight: 600;
        color: $primary-color;
      }

      &:nth-child(5) {
        text-align: center;
      }
    }

    tr {
      height: 70px;
    }
  }

  &__btn-tabla-editar,
  &__btn-tabla-eliminar {
    margin: 0 2px;
    min-width: 70px;
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

    @media (min-width: 768px) {
      padding: $spacing-xxl;
      font-size: $font-size-large;
    }

    &::before {
      content: "👥";
      display: block;
      font-size: 2rem;
      margin-bottom: $spacing-small;
      opacity: 0.5;

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

    .usuarios__btn-pag-texto {
      display: none;
    }

    .usuarios__btn-pag-icono {
      display: inline;
      font-size: $font-size-base;
    }

    @media (min-width: 768px) {
      padding: $spacing-small $spacing-large;
      font-size: $font-size-base;
      min-width: 100px;

      .usuarios__btn-pag-texto {
        display: inline;
      }

      .usuarios__btn-pag-icono {
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

    @media (min-width: 768px) {
      font-size: $font-size-base;
      padding: 0 $spacing-medium;
      min-width: 120px;
    }

    .pagina-info-completa {
      display: none;

      @media (min-width: 768px) {
        display: inline;
      }
    }

    .pagina-info-corta {
      display: inline;

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