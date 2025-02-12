<script setup lang="ts">
import { useUsersStore } from '@/stores/users'

const store = useUsersStore()

store.fetchUsuarios()

function deleteUsuario(id: number) {
    store.deleteUsuario(id)
}
</script>


<template>
  <v-container class="tabla-usuarios">
    <v-btn class="tabla-usuarios__boton-agregar" color="primary" @click="agregarUsuario">
      Añadir Usuario
    </v-btn>

    <div class="tabla-usuarios__contenedor">
      <v-table class="tabla-usuarios__tabla">
        <thead class="tabla-usuarios__encabezado">
          <tr>
            <th class="tabla-usuarios__celda">Acciones</th>
            <th class="tabla-usuarios__celda">Nombre</th>
            <th class="tabla-usuarios__celda">Usuario</th>
          </tr>
        </thead>
        <tbody class="tabla-usuarios__cuerpo">
          <tr v-for="usuario in store.usuarios" :key="usuario.id" class="tabla-usuarios__fila">
            <td class="tabla-usuarios__celda tabla-usuarios__celda--acciones">
              <v-icon class="tabla-usuarios__icono tabla-usuarios__icono--editar" @click="store.editarUsuario(usuario)">mdi-pencil</v-icon>
              <v-icon class="tabla-usuarios__icono tabla-usuarios__icono--eliminar" @click="store.eliminarUsuario(usuario.id)">mdi-delete</v-icon>
            </td>
            <td class="tabla-usuarios__celda">{{ usuario.nombre }} {{ usuario.apellido }}</td>
            <td class="tabla-usuarios__celda">@{{ usuario.username }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-container>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.tabla-usuarios {
  padding: $spacing-medium;
  
  &__boton-agregar {
    width: 100%;
    margin-bottom: $spacing-medium;
  }

  &__contenedor {
    overflow-x: auto;
  }

  &__tabla {
    width: 100%;
    border-collapse: collapse;
  }

  &__celda {
    padding: $spacing-small;
    text-align: left;
    border-bottom: 1px solid $secondary-color;
  }

  &__encabezado {
    background: $primary-color;
    color: white;
  }

  &__celda--acciones {
    display: flex;
    gap: $spacing-small;
    justify-content: center;
  }

  &__icono {
    cursor: pointer;
    font-size: 20px;

    &--editar { color: blue; }
    &--eliminar { color: red; }
    &--estado { color: green; }
  }
}

// 🖥 Adaptación para Desktop (min-width: 768px)
@media (min-width: 768px) {
  .tabla-usuarios {
    max-width: 800px;
    margin: auto;

    &__boton-agregar {
      width: auto;
    }

    &__celda--acciones {
      justify-content: flex-start;
    }

    &__icono {
      font-size: 24px;
    }
  }
}
</style>
