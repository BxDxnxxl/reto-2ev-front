<script setup lang = "ts">
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router';
const route = useRoute()

route.query.edit
</script>
<template>
    <Header />
</template>
<style>
</style>