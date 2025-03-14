<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useIdeasStore } from '@/stores/ideas';

const router = useRouter();
const store = useIdeasStore();

const fetchProductos = async () => {
  try {
    await store.fetchIdeas();
  } catch (err) {
    throw new Error("errrorooroor cargando");
    
  } 
};

onMounted(fetchProductos);
const formatearFechaEspañola = (fecha: string | number | Date) => {
  if (typeof fecha === 'number') {
    return fecha.toString()
  }

  const fechaObj = new Date(fecha)
  const dia = fechaObj.getDate().toString().padStart(2, '0')
  const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0')
  const anio = fechaObj.getFullYear()

  return `${dia}/${mes}/${anio}`
}
async function borrarIdea(id: number) {
  const confirmDelete = window.confirm('¿Estás seguro de eliminar este usuario?')
  if (confirmDelete) {
    await store.deleteIdea(id)
  }
}
</script>

<template>
  <v-container>
    <v-data-table
      class="elevation-1"
      fixed-header
      height="400px"
    >
      <thead>
        <tr>
          <th>Titulo</th>
          <th>Descripción</th>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Borrar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="idea in store.ideas" :key="idea.id">
          <td>{{ idea.titulo }}</td>
          <td>{{ idea.descripcion }}</td>
          <td>{{ formatearFechaEspañola(idea.fechaCreacion) }}</td>
          <td>{{ idea.tipo }}</td>
          <td>
            <v-btn icon color="primary" @click="borrarIdea(idea.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-data-table>
  </v-container>
</template>
