<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePublicacionesEmpresasStore } from '@/stores/publicacionesEmpresasStore';
import { useUsersStore } from '@/stores/users';
import FormPublicarNoticia from '@/components/FormPublicarNoticia.vue';
import type { PublicacionEmpresaDto } from '@/stores/dtos/PublicacionEmpresa.dto';
import { useUsuariosEmpresasStore } from '@/stores/usuariosEmpresasStore';

const store = usePublicacionesEmpresasStore();
const usuariosEmpresasStore = useUsuariosEmpresasStore();
const usersStore = useUsersStore();

const mostrarFormulario = ref(false);
const publicacionEnEdicion = ref<PublicacionEmpresaDto | undefined>(undefined);

onMounted(() => {
  store.fetchPublicaciones();
});

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
  } catch (error) {
    console.error('Error al guardar publicación:', error);
  }
}

async function borrarPublicacion(id: number) {
  const confirmar = confirm('¿Estás seguro de eliminar esta publicación?');
  if (confirmar) {
    await store.deletePublicacion(id);
  }
}
</script>


<template>
  <div class="publicaciones">
    <div class="publicaciones__header">
      <h2 class="publicaciones__title">Publicaciones de Empresas</h2>
      <v-btn 
        class="publicaciones__btn-new" 
        color="primary" 
        @click="abrirFormularioNueva" 
        prepend-icon="mdi-plus-circle-outline"
      >
        <span class="publicaciones__btn-text">Nueva Publicación</span>
      </v-btn>
    </div>

    <!-- Vista móvil: Cards -->
    <div class="publicaciones__cards">
      <div 
        v-for="pub in store.publicaciones" 
        :key="pub.id"
        class="publicaciones__card"
      >
        <div class="publicaciones__card-header">
          <h3 class="publicaciones__card-title">{{ pub.titulo }}</h3>
          <v-chip 
            :color="pub.esDestacada ? 'success' : 'default'" 
            size="small"
            class="publicaciones__card-chip"
          >
            {{ pub.esDestacada ? 'Destacada' : 'Normal' }}
          </v-chip>
        </div>
        
        <div class="publicaciones__card-date">
          <v-icon size="small" class="publicaciones__card-icon">mdi-calendar</v-icon>
          {{ new Date(pub.fechaPublicacion).toLocaleDateString() }}
        </div>
        
        <div class="publicaciones__card-actions">
          <v-btn 
            size="small" 
            color="primary" 
            variant="outlined"
            @click="editarPublicacion(pub)"
            class="publicaciones__action-btn"
          >
            <v-icon size="small">mdi-pencil</v-icon>
            Editar
          </v-btn>
          <v-btn 
            size="small" 
            color="error" 
            variant="outlined"
            @click="borrarPublicacion(pub.id)"
            class="publicaciones__action-btn"
          >
            <v-icon size="small">mdi-delete</v-icon>
            Eliminar
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Vista desktop: Tabla -->
    <div class="publicaciones__table-container">
      <v-table class="publicaciones__table" density="comfortable">
        <thead>
          <tr class="publicaciones__table-header">
            <th class="publicaciones__table-th">Título</th>
            <th class="publicaciones__table-th">Fecha</th>
            <th class="publicaciones__table-th">Estado</th>
            <th class="publicaciones__table-th publicaciones__table-th--actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="pub in store.publicaciones" 
            :key="pub.id"
            class="publicaciones__table-row"
          >
            <td class="publicaciones__table-td publicaciones__table-td--title">
              {{ pub.titulo }}
            </td>
            <td class="publicaciones__table-td">
              {{ new Date(pub.fechaPublicacion).toLocaleDateString() }}
            </td>
            <td class="publicaciones__table-td">
              <v-chip 
                :color="pub.esDestacada ? 'success' : 'default'" 
                size="small"
              >
                {{ pub.esDestacada ? 'Destacada' : 'Normal' }}
              </v-chip>
            </td>
            <td class="publicaciones__table-td publicaciones__table-td--actions">
              <div class="publicaciones__table-actions">
                <v-btn 
                  icon 
                  size="small" 
                  color="primary" 
                  variant="text"
                  @click="editarPublicacion(pub)"
                  class="publicaciones__table-btn"
                >
                  <v-icon size="small">mdi-pencil</v-icon>
                </v-btn>
                <v-btn 
                  icon 
                  size="small" 
                  color="error" 
                  variant="text"
                  @click="borrarPublicacion(pub.id)"
                  class="publicaciones__table-btn"
                >
                  <v-icon size="small">mdi-delete</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <v-dialog v-model="mostrarFormulario" max-width="700">
      <FormPublicarNoticia :publicacion="publicacionEnEdicion" @guardar="guardarPublicacion" />
    </v-dialog>
  </div>
</template>
<style scoped lang="scss">
.publicaciones {
  // Variables SCSS
  $color-primary: #1976d2;
  $color-surface: #ffffff;
  $color-background: #f5f5f5;
  $color-text-primary: #212121;
  $color-text-secondary: #757575;
  $color-border: #e0e0e0;
  $color-shadow: rgba(0, 0, 0, 0.12);
  
  $border-radius: 8px;
  $spacing-xs: 0.5rem;
  $spacing-sm: 0.75rem;
  $spacing-md: 1rem;
  $spacing-lg: 1.5rem;
  $spacing-xl: 2rem;
  
  $breakpoint-tablet: 768px;
  
  padding: $spacing-md;
  max-width: 100%;
  margin: 0 auto;
  
  @media (min-width: $breakpoint-tablet) {
    padding: $spacing-xl;
  }

  // Header
  &__header {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    
    @media (min-width: $breakpoint-tablet) {
      margin-bottom: $spacing-xl;
    }
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: $color-text-primary;
    margin: 0;
    text-align: center;
    
    @media (min-width: $breakpoint-tablet) {
      font-size: 1.5rem;
    }
  }

  &__btn-new {
    align-self: center;
    width: fit-content;
    
    @media (min-width: $breakpoint-tablet) {
      align-self: center;
    }
  }

  &__btn-text {
    @media (max-width: $breakpoint-tablet - 1px) {
      display: none;
    }
  }

  // Cards para móvil
  &__cards {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    
    @media (min-width: $breakpoint-tablet) {
      display: none;
    }
  }

  &__card {
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $border-radius;
    padding: $spacing-md;
    box-shadow: 0 2px 4px $color-shadow;
  }

  &__card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
  }

  &__card-title {
    font-size: 1rem;
    font-weight: 500;
    color: $color-text-primary;
    margin: 0;
    flex: 1;
    line-height: 1.4;
  }

  &__card-chip {
    flex-shrink: 0;
  }

  &__card-date {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    color: $color-text-secondary;
    font-size: 0.875rem;
    margin-bottom: $spacing-md;
  }

  &__card-icon {
    color: $color-text-secondary;
  }

  &__card-actions {
    display: flex;
    gap: $spacing-xs;
    justify-content: flex-end;
  }

  &__action-btn {
    min-width: auto;
    flex: 1;
    max-width: 120px;
  }

  // Tabla para desktop
  &__table-container {
    display: none;
    
    @media (min-width: $breakpoint-tablet) {
      display: block;
      background: $color-surface;
      border-radius: $border-radius;
      box-shadow: 0 2px 8px $color-shadow;
      overflow: hidden;
    }
  }

  &__table {
    width: 100%;
    
    .v-table__wrapper {
      border-radius: $border-radius;
    }
  }

  &__table-header {
    background-color: #fafafa;
  }

  &__table-th {
    padding: $spacing-md $spacing-lg;
    font-weight: 600;
    color: $color-text-primary;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid $color-border;
    
    &--actions {
      text-align: center;
      width: 120px;
    }
  }

  &__table-row {
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: #fafafa;
    }
  }

  &__table-td {
    padding: $spacing-md $spacing-lg;
    color: $color-text-secondary;
    font-size: 0.9rem;
    border-bottom: 1px solid $color-border;
    vertical-align: middle;
    
    &--title {
      font-weight: 500;
      color: $color-text-primary;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    &--actions {
      text-align: center;
    }
  }

  &__table-actions {
    display: flex;
    justify-content: center;
    gap: $spacing-xs;
  }

  &__table-btn {
    width: 32px;
    height: 32px;
    min-width: 32px;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid $color-border;
    
    &:hover {
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>