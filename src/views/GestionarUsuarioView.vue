<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router'
import FormularioUsuario from '@/components/FormularioUsuario.vue'

const route = useRoute()

//pillamos la url que nos llega del listado en base al botón que le hayamos dado
//se establece el id del usuario para poder usarlo en caso de ir a editar
const editMode = route.query.edit === 'true' ? true : false
const userId = route.query.id ? Number(route.query.id) : null
</script>

<template>
  <Header />

  <div class="gestion-usuario">
    <h2>{{ editMode ? 'Editar Usuario' : 'Añadir Usuario' }}</h2>
    <FormularioUsuario :editMode="editMode" :userId="userId" />
  </div>
</template>

<style scoped lang="scss">

</style>
