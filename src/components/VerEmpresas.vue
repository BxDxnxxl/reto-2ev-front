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

async function guardarEmpresa(empresa: any) {
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
.empresas {
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

    .empresas__titulo {
      font-size: 1.8rem;
      font-weight: bold;
      margin: 0;
    }

    .empresas__btn-crear {
      font-weight: bold;
      height: 42px;
      font-size: 0.95rem;
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
    min-width: 900px;
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

  &__select-acuerdo {
    width: 100%;
    max-width: 160px;
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

    option {
      color: $color-text;
    }
  }
}
</style>
