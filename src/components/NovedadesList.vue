<script setup lang="ts">
import { onMounted } from 'vue';
import { usePublicacionesEmpresasStore } from '@/stores/publicacionesEmpresasStore';
import { useUsersStore } from '@/stores/users';

const publicacionesStore = usePublicacionesEmpresasStore();
const userStore = useUsersStore();

onMounted(async () => {
  await publicacionesStore.fetchNovedades();
});
</script>

<template>
  <section class="novedades-blog">
    <h1 class="novedades-blog__titulo">Novedades del Mes</h1>

    <div
      v-for="novedad in publicacionesStore.novedades"
      :key="novedad.id"
      class="novedades-blog__card"
    >
      <div class="novedades-blog__header">
        <img
          class="novedades-blog__logo"
          :src="novedad.logoEmpresa"
          alt="Logo Empresa"
        />
        <div>
          <h2 class="novedades-blog__empresa">{{ novedad.nombreEmpresa }}</h2>
          <p class="novedades-blog__fecha">
            {{ new Date(novedad.fechaPublicacion).toLocaleDateString() }}
          </p>
        </div>
      </div>

      <h3 class="novedades-blog__titulo-noticia">{{ novedad.titulo }}</h3>
      <p class="novedades-blog__contenido">{{ novedad.contenido }}</p>

      <img
        v-if="novedad.imagen"
        :src="novedad.imagen"
        alt="Imagen Noticia"
        class="novedades-blog__imagen"
      />

      <div class="novedades-blog__footer">
        <p class="novedades-blog__contacto">
          Contacto: <strong>{{ novedad.emailAutor }}</strong>
        </p>

        <v-btn
          v-if="userStore.currentUser?.id === novedad.id"
          color="error"
          size="small"
          @click="$emit('eliminar', novedad.id)"
        >
          Borrar Noticia
        </v-btn>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.novedades-blog {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;

  &__titulo {
    font-size: 2.2rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  &__card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__logo {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 8px;
    background: #f5f5f5;
  }

  &__empresa {
    font-weight: 600;
    font-size: 1.2rem;
  }

  &__fecha {
    color: #888;
    font-size: 0.9rem;
  }

  &__titulo-noticia {
    font-size: 1.4rem;
    font-weight: bold;
  }

  &__contenido {
    font-size: 1rem;
    line-height: 1.5;
  }

  &__imagen {
    max-width: 100%;
    border-radius: 10px;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #ddd;
    padding-top: 1rem;
  }

  &__contacto {
    font-size: 0.95rem;
    color: #444;
  }

  @media (max-width: 768px) {
    &__card {
      padding: 1rem;
    }
  }
}
</style>
