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
    <router-link to="/gestionUsuario">
      <v-btn class="boton-agregar" color="primary">
          Añadir Usuario
      </v-btn>
    </router-link>
    <div class="tabla-usuarios__contenedor">
      <table class="tabla-usuarios__tabla">
        <thead class="tabla-usuarios__encabezado">
          <tr>
            <th class="tabla-usuarios__celda">Acciones</th>
            <th class="tabla-usuarios__celda">Nombre</th>
            <th class="tabla-usuarios__celda">Usuario</th>
          </tr>
        </thead>
        <tbody class="tabla-usuarios__cuerpo">
          <tr v-for="usuario in store.users" :key="usuario.id" class="tabla-usuarios__fila">
            <td class="tabla-usuarios__celda tabla-usuarios__celda--acciones">
              <router-link to="/gestionUsuario?edit=true">
                <v-icon class="tabla-usuarios__icono tabla-usuarios__icono--editar">mdi-pencil</v-icon>
              </router-link>
              <v-icon class="tabla-usuarios__icono tabla-usuarios__icono--eliminar" @click="deleteUsuario(usuario.id)">mdi-delete</v-icon>
            </td>
            <td class="tabla-usuarios__celda">{{ usuario.nombre }} {{ usuario.apellido1 }}</td>
            <td class="tabla-usuarios__celda">@{{ usuario.username }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/styles/variables.scss";

.boton-agregar {
    width: 20%;
    margin-bottom: $spacing-medium;
  }

.tabla-usuarios {
  padding: $spacing-medium;
  margin-top: 16%;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;

  &__contenedor {
    width: 100%;
    overflow-x: auto;
  }

  &__tabla {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  &__celda {
    padding: $spacing-small;
    text-align: left;
    border-bottom: 1px solid $secondary-color;
    font-size: 1rem;
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

  .tabla-usuarios__tabla {
    font-size: 0.9rem;
    width: 100%;
    table-layout: auto;
  }

  .tabla-usuarios__celda {
    padding: $spacing-extra-small;
    word-wrap: break-word;
    font-size: 0.9rem;
  }

  .tabla-usuarios__celda--acciones {
    display: flex;
    gap: $spacing-small;
    justify-content: center;
  }

  .tabla-usuarios__icono {
    font-size: 18px;
  }

  @media (min-width: 768px) {
    .tabla-usuarios__tabla {
      font-size: 1rem;
      table-layout: auto;
    }

    .tabla-usuarios__celda--acciones {
      gap: $spacing-medium;
    }

    .tabla-usuarios__celda {
      padding: $spacing-small;
    }

    .tabla-usuarios__icono {
      font-size: 22px;
    }
  }


  @media (min-width: 1024px) {
    .tabla-usuarios__tabla {
      font-size: 1rem;
      table-layout: auto;
    }

    .tabla-usuarios__celda--acciones {
      gap: $spacing-medium;
    }

    .tabla-usuarios__celda {
      padding: $spacing-medium;
    }

    .tabla-usuarios__icono {
      font-size: 24px;
    }

    .tabla-usuarios__contenedor {
      width: 100%;
      overflow-x: auto;
    }

    .tabla-usuarios__tabla {
      width: 100%;
      margin-top: 40px;
    }
  }
}
</style>




