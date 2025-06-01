<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEmpresasStore } from '@/stores/empresasStore';
import type { ActualizarAcuerdoDto } from '@/stores/dtos/ActualizarAcuerdo.dto';
import FormEmpresa from '@/components/FormEmpresa.vue';
import Swal from 'sweetalert2';

const store = useEmpresasStore();
const mostrarFormulario = ref(false);

onMounted(() => {
  store.fetchEmpresasConAfiliados();
});

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
    confirmButtonColor: '#d33',
  });

  if (confirm.isConfirmed) {
    await store.deleteEmpresa(id);
    await store.fetchEmpresasConAfiliados();
    Swal.fire('Eliminada', 'La empresa ha sido eliminada.', 'success');
  }
}

async function guardarEmpresa(empresa: FormData) {
  await store.addEmpresa(empresa);
  await store.fetchEmpresasConAfiliados();
  mostrarFormulario.value = false;
}

async function actualizarAcuerdo(idEmpresa: number, nuevoAcuerdo: number) {
  const dto: ActualizarAcuerdoDto = {
    idEmpresa,
    nuevoAcuerdo
  };

  try {
    const res = await fetch(`http://localhost:4444/api/PublicacionesEmpresas/actualizar-acuerdo/${idEmpresa}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });

    if (!res.ok) throw new Error('Error al actualizar el acuerdo');
    const data = await res.json();
    Swal.fire('Actualizado', data.mensaje, 'success');
  } catch (error) {
    console.error('Error:', error);
    Swal.fire('Error', 'No se pudo actualizar el acuerdo.', 'error');
  }
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
              <th class="text-center">Afiliados</th>
              <th class="text-center">Activa</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="empresa in store.empresasConAfiliados" :key="empresa.id" class="empresas__fila">
              <td class="text-center">{{ empresa.nombre }}</td>
              <td class="text-center">{{ empresa.web }}</td>
              <td class="text-center">
                <select
                  v-model.number="empresa.acuerdo"
                  @change="actualizarAcuerdo(empresa.id, empresa.acuerdo)"
                  class="empresa__select-acuerdo"
                >
                  <option :value="0">Sin acuerdo</option>
                  <option :value="1">Plan Básico</option>
                  <option :value="2">Plan Avanzado</option>
                  <option :value="3">Plan Premium</option>
                </select>
              </td>
              <td class="text-center">{{ empresa.limiteDestacadasMensual }}</td>
              <td class="text-center">{{ empresa.numeroAfiliados }}</td>
              <td class="text-center">
                <v-chip
                  :color="empresa.activa ? 'success' : 'error'"
                  size="small"
                >
                  {{ empresa.activa ? 'Sí' : 'No' }}
                </v-chip>
              </td>
              <td class="text-center">
                <v-btn icon size="small" color="warning" variant="text" @click="desactivarEmpresa(empresa.id)">
                  <v-icon size="18">mdi-cancel</v-icon>
                </v-btn>
                <v-btn icon size="small" color="error" variant="text" @click="borrarEmpresa(empresa.id)">
                  <v-icon size="18">mdi-delete</v-icon>
                </v-btn>
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
@import '@/assets/styles/variables.scss';

.empresas {
  &__contenedor {
    padding: $spacing-large $spacing-medium;
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: $spacing-large;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;

    .empresas__titulo {
      font-size: $font-size-xlarge;
      font-weight: 800;
      margin: 0;
      color: $primary-color;
      background: $primary-gradient;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .empresas__btn-crear {
      font-weight: bold;
      height: 42px;
      font-size: $font-size-base;
      background: $primary-gradient;
      color: white;
      border-radius: $border-radius;
      padding: $spacing-small $spacing-medium;
      border: none;
      cursor: pointer;
      box-shadow: $box-shadow;
      transition: $transition;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px rgba($primary-color, 0.3);
      }
    }
  }

  &__tabla-contenedor {
    overflow-x: auto;
    width: 100%;
    background-color: $card-background;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    border: 1px solid $primary-color;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba($primary-color, 0.4);
      border-radius: $border-radius;
    }

    &::-webkit-scrollbar-track {
      background: rgba($primary-color, 0.05);
    }
  }

  &__tabla {
    width: 100%;
    min-width: 900px;
    border-collapse: collapse;

    th {
      background-color: $card-background;
      color: $primary-color;
      font-weight: 700;
      padding: $spacing-medium;
      font-size: $font-size-small;
      text-align: center;
      text-transform: uppercase;
      border-bottom: 2px solid $primary-color;
    }

    td {
      background-color: $card-background;
      color: $primary-color;
      font-size: $font-size-base;
      padding: $spacing-medium;
      text-align: center;
      border-bottom: 1px solid $primary-color;
    }

    tr:hover td {
      background-color: lighten($card-background, 3%);
    }
  }

  &__select-acuerdo {
    width: 100%;
    max-width: 160px;
    padding: 0.5rem 0.75rem;
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

  // Botones de acciones (editar, borrar, etc.)
  .btn-accion {
    background-color: $color-disabled;
    color: $color-disabled;
    border: none;
    padding: $spacing-extra-small $spacing-small;
    border-radius: $border-radius;
    font-size: $font-size-small;
    cursor: pointer;
    transition: $transition;

    &:hover {
      background-color: darken($color-disabled, 5%);
    }
  }
}
</style>
