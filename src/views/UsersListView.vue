<script setup lang="ts">
import { useUsersStore } from '@/stores/users'
import { onMounted } from 'vue'

const store = useUsersStore()
store.findAll() 

</script>
<template>
    <h1>Listado de usuarios</h1>
    <div v-for="user in store.users">
        {{ users.name }} {{ users.surname }}
    </div>
</template>
<style>
</style>