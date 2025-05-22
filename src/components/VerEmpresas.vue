<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEmpresasStore } from '@/stores/empresasStore';
import FormEmpresa from '@/components/FormEmpresa.vue';

const store = useEmpresasStore();
const mostrarFormulario = ref(false);

onMounted(() => {
  store.fetchEmpresas();
});

function desactivarEmpresa(id: number) {
  console.log('Desactivar empresa', id);
}

async function borrarEmpresa(id: number) {
  const confirmDelete = window.confirm('¿Estás seguro de eliminar esta empresa?');
  if (confirmDelete) {
    await store.deleteEmpresa(id);
    await store.fetchEmpresas();
  }
}

async function guardarEmpresa(empresa: any) {
  await store.addEmpresa(empresa);
  await store.fetchEmpresas();
  mostrarFormulario.value = false;
}
</script>

<template>
  <div class="empresas">
    <v-container class="empresas__contenedor" fluid>
      <div class="empresas__header">
        <h2 class="empresas__titulo">Gestión de Empresas</h2>
        <v-btn 
          class="empresas__btn-crear" 
          color="primary" 
          elevation="2"
          prepend-icon="mdi-plus-circle-outline"
          @click="mostrarFormulario = true"
        >
          Añadir Empresa
        </v-btn>
      </div>

      <div class="empresas__tabla-contenedor">
        <v-table class="empresas__tabla" density="comfortable">
          <thead>
            <tr>
              <th class="text-center">Nombre</th>
              <th class="text-center">Web</th>
              <th class="text-center">Acuerdo</th>
              <th class="text-center">Destacadas Mensuales</th>
              <th class="text-center">Activa</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="empresa in store.empresas" :key="empresa.id" class="empresas__fila">
              <td class="text-center empresas__celda">{{ empresa.nombre }}</td>
              <td class="text-center empresas__celda">{{ empresa.web }}</td>
              <td class="text-center empresas__celda">{{ empresa.acuerdo }}</td>
              <td class="text-center empresas__celda">{{ empresa.limiteDestacadasMensual }}</td>
              <td class="text-center empresas__celda">
                <v-chip
                  :color="empresa.activa ? 'success' : 'error'"
                  size="small"
                  class="empresas__chip"
                >
                  {{ empresa.activa ? 'Sí' : 'No' }}
                </v-chip>
              </td>
              <td class="text-center empresas__acciones">
                <v-tooltip location="top" text="Desactivar">
                  <template v-slot:activator="{ props }">
                    <v-btn 
                      icon 
                      v-bind="props"
                      class="empresas__btn-accion" 
                      color="warning" 
                      variant="text"
                      @click="desactivarEmpresa(empresa.id)"
                    >
                      <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip location="top" text="Eliminar">
                  <template v-slot:activator="{ props }">
                    <v-btn 
                      icon 
                      v-bind="props"
                      class="empresas__btn-accion" 
                      color="error" 
                      variant="text"
                      @click="borrarEmpresa(empresa.id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-container>

    <v-dialog v-model="mostrarFormulario" max-width="600">
      <FormEmpresa @guardarEmpresa="guardarEmpresa" />
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.empresas {
  // Variables reutilizables
  $breakpoint-tablet: 768px;
  $breakpoint-desktop: 1024px;
  $color-primary: #1976d2;
  $color-background: #f9fafb;
  $color-border: #e5e7eb;
  $color-text: #374151;
  $color-text-secondary: #6b7280;
  $shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  $shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  $shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  $radius-sm: 0.375rem;
  $radius-md: 0.5rem;
  $radius-lg: 0.75rem;

  color: $color-text;
  width: 100%;
  height: 100%;

  &__contenedor {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @media (min-width: $breakpoint-tablet) {
      max-width: 100%;
    }

    @media (min-width: $breakpoint-desktop) {
      max-width: 100%;
    }
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;

    @media (min-width: $breakpoint-tablet) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
  }

  &__titulo {
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-text;
    margin: 0;
    line-height: 1.2;

    @media (min-width: $breakpoint-tablet) {
      font-size: 1.875rem;
    }
  }

  &__btn-crear {
    align-self: stretch;
    height: 48px;
    font-weight: 600;
    letter-spacing: 0.025em;
    border-radius: $radius-md;
    font-size: 1rem;

    @media (min-width: $breakpoint-tablet) {
      align-self: auto;
      min-width: 180px;
    }
  }

  &__tabla-contenedor {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  }
  
  &__tabla {
    width: 100%;
    min-width: 768px;
    border-collapse: collapse;
    border: none;
    font-size: 0.875rem;

    @media (min-width: $breakpoint-tablet) {
      font-size: 1rem;
    }

    th {
      background-color: #f3f4f6;
      color: $color-text;
      font-weight: 600;
      padding: 1rem;
      white-space: nowrap;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;

      @media (min-width: $breakpoint-tablet) {
        padding: 1.25rem 1rem;
        font-size: 0.9375rem;
      }
    }

    td {
      padding: 0.75rem 0.5rem;
      border-bottom: 1px solid $color-border;
      color: $color-text-secondary;
      vertical-align: middle;
      white-space: nowrap;

      @media (min-width: $breakpoint-tablet) {
        padding: 1rem;
      }
    }
  }

  &__fila {
    transition: background-color 0.2s;

    &:hover {
      background-color: #f9fafb;
    }

    &:last-child td {
      border-bottom: none;
    }
  }

  &__celda {
    font-size: 0.875rem;

    @media (min-width: $breakpoint-tablet) {
      font-size: 1rem;
    }
  }

  &__chip {
    min-width: 64px;
  }

  &__acciones {
    display: flex;
    justify-content: center;
    gap: 0.25rem;

    @media (min-width: $breakpoint-tablet) {
      gap: 0.5rem;
    }
  }

  &__btn-accion {
    height: 36px;
    width: 36px;

    @media (min-width: $breakpoint-tablet) {
      height: 40px;
      width: 40px;
    }
  }
}
</style>