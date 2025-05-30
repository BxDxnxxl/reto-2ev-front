<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['guardarEmpresa']);

const empresa = ref({
  Nombre: '',
  Descripcion: '',
  Sede: '',
  Web: '',
  Logo: null as File | null,
  Acuerdo: 0,
  LimiteDestacadasMensual: 0
});

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    empresa.value.Logo = input.files[0];
  }
}

function submitForm() {
  if (!empresa.value.Logo) {
    alert("Debe seleccionar un logo.");
    return;
  }

  const formData = new FormData();
  formData.append("Nombre", empresa.value.Nombre);
  formData.append("Descripcion", empresa.value.Descripcion || "");
  formData.append("Sede", empresa.value.Sede || "");
  formData.append("Web", empresa.value.Web || "");
  formData.append("Acuerdo", empresa.value.Acuerdo.toString());
  formData.append("LimiteDestacadasMensual", empresa.value.LimiteDestacadasMensual.toString());
  formData.append("Logo", empresa.value.Logo);

  emit("guardarEmpresa", formData);
}
</script>


<template>
  <div class="form-empresa">
    <v-card class="form-empresa__card">
      <v-card-title class="form-empresa__titulo">Nueva Empresa</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="submitForm" class="form-empresa__formulario">
          <v-text-field v-model="empresa.Nombre" label="Nombre" required />
          <v-text-field v-model="empresa.Descripcion" label="Descripción" />
          <v-text-field v-model="empresa.Sede" label="Sede" />
          <v-text-field v-model="empresa.Web" label="Web" />

          <!-- El input de imagen con el campo Logo exacto -->
          <input type="file" accept="image/*" @change="handleFileUpload" required />

          <v-select
            v-model="empresa.Acuerdo"
            :items="[0, 1, 2, 3]"
            label="Tipo de acuerdo"
            required
          />
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

    // Añadir scroll cuando sea necesario
    max-height: 90vh;
    overflow-y: auto;
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
