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
      prepend-icon="mdi-plus"
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
              <v-btn
                icon
                density="comfortable"
                color="primary"
                variant="text"
                class="tabla-usuarios__boton"
                @click="editUsuario(usuario.id || 0)"
              >
                <v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top">Editar</v-tooltip>
              </v-btn>
              <v-btn
                icon
                density="comfortable"
                color="error"
                variant="text"
                class="tabla-usuarios__boton"
                @click="deleteUsuario(usuario.id || 0)"
              >
                <v-icon>mdi-delete</v-icon>
                <v-tooltip activator="parent" location="top">Eliminar</v-tooltip>
              </v-btn>
            </td>
            <td class="tabla-usuarios__celda">{{ usuario.nombre }}</td>
            <td class="tabla-usuarios__celda">{{ usuario.apellido1 }}</td>
            <td class="tabla-usuarios__celda">{{ usuario.apellido2 }}</td>
            <td class="tabla-usuarios__celda">@{{ usuario.username }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Vista móvil alternativa -->
    <div class="tabla-usuarios__mobile">
      <v-card
        v-for="usuario in store.users"
        :key="usuario.id"
        variant="outlined"
        class="tabla-usuarios__card mb-4"
      >
        <div class="tabla-usuarios__card-header">
          <span class="tabla-usuarios__nombre">{{ usuario.nombre }} {{ usuario.apellido1 }}</span>
          <div class="tabla-usuarios__card-actions">
            <v-btn
              icon
              size="small"
              color="primary"
              variant="text"
              @click="editUsuario(usuario.id || 0)"
            >
              <v-icon size="small">mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              color="error"
              variant="text"
              @click="deleteUsuario(usuario.id || 0)"
            >
              <v-icon size="small">mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
        <v-divider></v-divider>
        <div class="tabla-usuarios__card-content">
          <div class="tabla-usuarios__card-item">
            <span class="tabla-usuarios__label">Nombre:</span>
            <span>{{ usuario.nombre }}</span>
          </div>
          <div class="tabla-usuarios__card-item">
            <span class="tabla-usuarios__label">Primer Apellido:</span>
            <span>{{ usuario.apellido1 }}</span>
          </div>
          <div class="tabla-usuarios__card-item">
            <span class="tabla-usuarios__label">Segundo Apellido:</span>
            <span>{{ usuario.apellido2 }}</span>
          </div>
          <div class="tabla-usuarios__card-item">
            <span class="tabla-usuarios__label">Usuario:</span>
            <span>@{{ usuario.username }}</span>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.tabla-usuarios {
  padding: $spacing-medium;
  width: 100%;
  max-width: 1200px;
  margin: $spacing-large auto;
  
  // Botón para agregar usuario
  .boton-agregar {
    margin-bottom: $spacing-large;
    display: block;
    width: 100%;
    
    @media (min-width: 768px) {
      width: auto;
      margin-left: 0;
    }
  }

  // Contenedor de la tabla
  &__contenedor {
    width: 100%;
    overflow-x: auto;
    display: none; // Ocultar en móvil
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    @media (min-width: 768px) {
      display: block; // Mostrar en desktop
    }
  }

  // Tabla principal
  &__tabla {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 0.9rem;
  }

  // Encabezado
  &__encabezado {
    background: $primary-color;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    th {
      padding: $spacing-medium;
      font-weight: 500;
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }

  // Celdas
  &__celda {
    padding: $spacing-medium;
    text-align: center;
    border-bottom: 1px solid rgba($secondary-color, 0.2);
    vertical-align: middle;
    word-wrap: break-word;
    min-width: 120px;
    
    &--acciones {
      display: flex;
      justify-content: center;
      gap: $spacing-small;
      min-width: 100px;
    }
  }

  // Filas
  &__fila {
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba($secondary-color, 0.05);
    }
    
    &:last-child .tabla-usuarios__celda {
      border-bottom: none;
    }
  }
  
  // Botones de acciones
  &__boton {
    margin: 0 2px;
  }
  
  // Vista móvil
  &__mobile {
    display: block;
    
    @media (min-width: 768px) {
      display: none;
    }
  }
  
  // Tarjetas móviles
  &__card {
    border-radius: 8px;
    overflow: hidden;
    
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-medium;
      background-color: rgba($primary-color, 0.05);
    }
    
    &-actions {
      display: flex;
      gap: $spacing-small;
    }
    
    &-content {
      padding: $spacing-medium;
    }
    
    &-item {
      padding: $spacing-small 0;
      display: flex;
      flex-direction: column;
      
      &:not(:last-child) {
        border-bottom: 1px solid rgba($secondary-color, 0.1);
        margin-bottom: $spacing-small;
      }
    }
  }
  
  &__nombre {
    font-weight: 500;
    font-size: 1rem;
  }
  
  &__label {
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 4px;
  }
}
</style>