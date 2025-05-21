<script setup lang="ts">
import { ref } from 'vue';
import type { EmpresaDto } from '@/stores/dtos/Empresa.dto';

const emit = defineEmits(['guardarEmpresa']);

const empresa = ref<EmpresaDto>({
  id: 0,
  nombre: '',
  descripcion: '',
  sede: '',
  web: '',
  logo: '',
  fechaAlta: new Date(),
  activa: true,
  acuerdo: 0,
  limiteDestacadasMensual: 0
});

function submitForm() {
  emit('guardarEmpresa', empresa.value);
}
</script>

<template>
  <div class="form-empresa">
    <v-card class="form-empresa__card">
      <v-card-title class="form-empresa__titulo">Nueva Empresa</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="submitForm" class="form-empresa__formulario">
          <v-text-field v-model="empresa.nombre" label="Nombre" required />
          <v-text-field v-model="empresa.descripcion" label="Descripción" />
          <v-text-field v-model="empresa.sede" label="Sede" />
          <v-text-field v-model="empresa.web" label="Web" />
          <v-text-field v-model="empresa.logo" label="Logo (URL)" />

          <v-select
            v-model="empresa.acuerdo"
            :items="[0, 1, 2, 3]"
            label="Tipo de acuerdo"
            required
          />

          <v-checkbox v-model="empresa.activa" label="Activa" />

          <v-btn type="submit" color="success" class="form-empresa__btn">
            GUARDAR
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.form-empresa {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 1rem;

  &__card {
    width: 100%;
    max-width: 720px;
    background-color: #fff;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &__titulo {
    font-size: 1.25rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1rem;
  }

  &__formulario {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__btn {
    align-self: center;
    margin-top: 1rem;
    font-weight: bold;
  }

  @media (max-width: 767px) {
    &__card {
      padding: 1rem;
    }
  }
}
</style>
