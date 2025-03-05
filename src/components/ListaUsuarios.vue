<script setup lang="ts">
import { useUsersStore } from '@/stores/users'

const store = useUsersStore()

store.fetchUsuarios()

function deleteUsuario(id: number) {
  store.deleteUsuario(id)
}
</script>

<template>
  <div class="tabla-usuarios">
    <router-link to="/gestionUsuario?edit=false">
      <v-btn class="boton-agregar" color="primary"> Añadir Usuario </v-btn>
    </router-link>
    <div class="tabla-usuarios__contenedor">
      <table class="tabla-usuarios__tabla">
        <thead class="tabla-usuarios__encabezado">
          <tr>
            <th class="tabla-usuarios__celda">Acciones</th>
            <th class="tabla-usuarios__celda">Nombre</th>
            <th class="tabla-usuarios__celda">Primer Apellido</th>
            <th class="tabla-usuarios__celda">Segundo Apellido</th>
            <th class="tabla-usuarios__celda">Usuario</th>
          </tr>
        </thead>
        <tbody class="tabla-usuarios__cuerpo">
          <tr v-for="usuario in store.users" :key="usuario.id" class="tabla-usuarios__fila">
            <td class="tabla-usuarios__celda tabla-usuarios__celda--acciones">
              <router-link :to="`/gestionUsuario?edit=true&id=${usuario.id}`">
                <v-icon class="tabla-usuarios__icono tabla-usuarios__icono--editar"
                  >mdi-pencil</v-icon
                >
              </router-link>
              <v-icon
                class="tabla-usuarios__icono tabla-usuarios__icono--eliminar"
                @click="deleteUsuario(usuario.id)"
                >mdi-delete</v-icon
              >
            </td>
            <td class="tabla-usuarios__celda">{{ usuario.nombre }}</td>
            <td class="tabla-usuarios__celda">{{ usuario.apellido1 }}</td>
            <td class="tabla-usuarios__celda">{{ usuario.apellido2 }}</td>
            <td class="tabla-usuarios__celda">@{{ usuario.username }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.boton-agregar {
  width: 100%;
  margin-top: $spacing-medium;
  margin-bottom: $spacing-medium;
  display: flex;
  justify-content: center;
  
  @media (min-width: 768px) {
    width: 20%;
  }
}

.tabla-usuarios {
  padding: $spacing-medium;
  margin-top: $spacing-large; // Cambiado de 100px a variable para consistencia
  width: 100%;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  
  &__contenedor {
    width: 100%;
    overflow-x: auto;
    display: flex;
    justify-content: center;
    margin-bottom: $spacing-medium; // Añadido espacio inferior
  }
  
  &__tabla {
    width: 100%;
    border-collapse: separate; // Cambiado de collapse a separate
    border-spacing: 0 $spacing-small; // Añadido espaciado entre filas
    margin-top: $spacing-medium; // Estandarizado con variables
    font-size: 0.85rem;
    table-layout: fixed;
    text-align: center;
    
    @media (min-width: 768px) {
      font-size: 1rem;
    }
  }
  
  &__celda {
    padding: $spacing-small $spacing-medium; // Mejorado el padding horizontal
    text-align: center;
    border-bottom: 1px solid $secondary-color;
    font-size: 0.85rem;
    word-wrap: break-word;
    
    @media (min-width: 768px) {
      font-size: 1rem;
    }
  }
  
  &__encabezado {
    background: $primary-color;
    color: white;
    
    th {
      padding-top: $spacing-medium; // Mayor espacio superior en encabezado
      padding-bottom: $spacing-medium; // Mayor espacio inferior en encabezado
    }
  }
  
  &__fila {
    transition: background-color 0.2s; // Añadida transición suave
    
    &:not(:last-child) {
      margin-bottom: $spacing-small; // Espacio entre filas
    }
    
    &:hover {
      background-color: rgba($secondary-color, 0.05); // Efecto hover sutil
    }
  }
  
  &__celda--acciones {
    display: flex;
    gap: $spacing-small;
    justify-content: center;
  }
  
  &__icono {
    cursor: pointer;
    font-size: 18px;
    
    &--editar {
      color: blue;
    }
    
    &--eliminar {
      color: red;
    }
    
    &--estado {
      color: green;
    }
    
    @media (min-width: 768px) {
      font-size: 22px;
    }
  }
}
</style>