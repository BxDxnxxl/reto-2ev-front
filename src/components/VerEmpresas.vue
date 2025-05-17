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
        <v-btn class="empresas__btn-crear" color="primary" @click="mostrarFormulario = true">
          Añadir Empresa
        </v-btn>
      </div>

      <v-table class="empresas__tabla" density="comfortable">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Web</th>
            <th>Acuerdo</th>
            <th>Activa</th>
            <th>Destacadas Mensuales</th>
            <th>Acciones</th>
            <th class="empresas__col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="empresa in store.empresas" :key="empresa.id">
            <td>{{ empresa.nombre }}</td>
            <td>{{ empresa.web }}</td>
            <td>{{ empresa.acuerdo }}</td>
            <td>{{ empresa.limiteDestacadasMensual }}</td>
            <td>{{ empresa.acuerdo }}</td>
            <td>{{ empresa.activa ? 'Sí' : 'No' }}</td>
            <td class="empresas__acciones">
              <v-btn icon size="x-small" @click="desactivarEmpresa(empresa.id)">
                <v-icon size="18">mdi-cancel</v-icon>
              </v-btn>
              <v-btn icon size="x-small" @click="borrarEmpresa(empresa.id)">
                <v-icon size="18" color="red">mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>

    <v-dialog v-model="mostrarFormulario" max-width="600">
      <FormEmpresa @guardarEmpresa="guardarEmpresa" />
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.empresas {
  &__contenedor {
    padding: 2rem 1rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    .empresas__titulo {
      font-size: 1.8rem;
      font-weight: bold;
      margin: 0;
    }

    .empresas__btn-crear {
      margin-top: 0.5rem;

      @media (min-width: 768px) {
        margin-top: 0;
      }
    }
  }

  &__tabla {
  width: 100%;
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  text-align: center;

  th {
    background-color: #f8f8f8;
    font-weight: 600;
    padding: 1.2rem;
    text-align: center;
  }

  td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e5e5;
    text-align: center; // ✅ centra contenido
  }

  tr:nth-child(even) {
    background-color: #fcfcfc;
  }

  @media (max-width: 768px) {
    th,
    td {
      font-size: 0.9rem;
      padding: 0.6rem 1rem;
    }
  }
}

}
</style>