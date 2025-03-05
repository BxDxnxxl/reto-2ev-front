<script setup lang="ts">
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRouter } from 'vue-router'

const store = useUsersStore()
const router = useRouter()

// Fetch users on component mount
onMounted(() => {
  store.fetchUsuarios()
})

// Navigate to add user page
function navigateToAddUser() {
  router.push('/gestionUsuario?edit=false')
}

// Delete user with confirmation
async function deleteUsuario(id: number) {
  const confirmDelete = window.confirm('¿Estás seguro de eliminar este usuario?')
  if (confirmDelete) {
    await store.deleteUsuario(id)
  }
}

// Navigate to edit user page
function editUsuario(id: number) {
  router.push(`/gestionUsuario?edit=true&id=${id}`)
}
</script>

<template>
  <div class="tabla-usuarios">
    <v-btn 
      class="boton-agregar" 
      color="primary" 
      @click="navigateToAddUser"
    >
      Añadir Usuario
    </v-btn>
    
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
          <tr 
            v-for="usuario in store.users" 
            :key="usuario.id" 
            class="tabla-usuarios__fila"
          >
            <td class="tabla-usuarios__celda tabla-usuarios__celda--acciones">
              <v-icon 
                class="tabla-usuarios__icono tabla-usuarios__icono--editar"
                @click="editUsuario(usuario.id || 0)"
              >
                mdi-pencil
              </v-icon>
              <v-icon 
                class="tabla-usuarios__icono tabla-usuarios__icono--eliminar"
                @click="deleteUsuario(usuario.id || 0)"
              >
                mdi-delete
              </v-icon>
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
  margin-top: $spacing-large;
  width: 100%;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  
  &__contenedor {
    width: 100%;
    overflow-x: auto;
    display: flex;
    justify-content: center;
    margin-bottom: $spacing-medium;
  }
  
  &__tabla {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 $spacing-small;
    margin-top: $spacing-medium;
    font-size: 0.85rem;
    table-layout: fixed;
    text-align: center;
    
    @media (min-width: 768px) {
      font-size: 1rem;
    }
  }
  
  &__celda {
    padding: $spacing-small $spacing-medium;
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
      padding-top: $spacing-medium;
      padding-bottom: $spacing-medium;
    }
  }
  
  &__fila {
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba($secondary-color, 0.05);
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
    
    @media (min-width: 768px) {
      font-size: 22px;
    }
  }
}
</style>