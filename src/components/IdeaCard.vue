<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useIdeasStore } from "@/stores/Ideas";
import { useUsersStore } from "@/stores/users";
import { useUsuariosApuntadosStore } from "@/stores/UsuarioApuntado";
import FormularioIdea from "@/components/FormularioIdea.vue";

const ideasStore = useIdeasStore();
const usersStore = useUsersStore();
const usuariosApuntadosStore = useUsuariosApuntadosStore();

const mostrarFormulario = ref(false);
const estadoApuntado = ref<{ [key: number]: boolean }>({});
const estadoAceptado = ref<{ [key: number]: boolean }>({});

onMounted(async () => {
  await ideasStore.fetchIdeasConPlazas();
  await verificarApuntadosYAceptados();
});

const toggleFormulario = () => {
  mostrarFormulario.value = !mostrarFormulario.value;
};

const onIdeaPublicada = async () => {
  mostrarFormulario.value = false;
  await ideasStore.fetchIdeasConPlazas();
  await verificarApuntadosYAceptados();
};

const verificarApuntadosYAceptados = async () => {
  const userId = usersStore.currentUser?.id;
  if (!userId) return;

  for (const idea of ideasStore.ideasConPlazas) {
    const resultado = await usuariosApuntadosStore.verificarEstadoApuntadoYAceptado(idea.id, userId);
    estadoApuntado.value[idea.id] = resultado.apuntado;
    estadoAceptado.value[idea.id] = resultado.aceptado;
  }
};

const handleUnirse = async (idIdea: number, creadorId: number) => {
  const userId = usersStore.currentUser?.id;

  if (!userId) {
    alert("Para realizar esta acción debes iniciar sesión.");
    return;
  }

  if (userId === creadorId) {
    alert("No puedes unirte a tu propia idea.");
    return;
  }

  if (estadoApuntado.value[idIdea]) {
    alert("Ya estás apuntado a esta idea.");
    return;
  }

  await usuariosApuntadosStore.unirseAIdea(idIdea, userId);
  await ideasStore.fetchIdeasConPlazas();
  await verificarApuntadosYAceptados();
};
</script>

<template>
  <div class="ideas">
    <button class="ideas__boton" @click="toggleFormulario">
      {{ mostrarFormulario ? "Cancelar" : "➕ Añadir idea" }}
    </button>

    <FormularioIdea v-if="mostrarFormulario" @ideaPublicada="onIdeaPublicada" />

    <div class="ideas__lista">
      <div
        v-for="idea in ideasStore.ideasConPlazas"
        :key="idea.id"
        class="idea-card"
      >
        <div class="idea-card__contenido">
          <h3 class="idea-card__titulo">{{ idea.titulo }}</h3>
          <p class="idea-card__descripcion">{{ idea.descripcion }}</p>

          <p class="idea-card__plazas">
            {{ idea.plazasLibres }} de {{ idea.plazasTotales }} plazas libres
          </p>

          <div class="idea-card__barra-plazas">
            <div
              v-for="index in idea.plazasTotales"
              :key="index"
              :class="[
                'idea-card__plaza',
                index > idea.plazasLibres ? 'idea-card__plaza--ocupada' : ''
              ]"
            ></div>
          </div>
        </div>

        <div class="idea-card__acciones">
          <template v-if="usersStore.currentUser">
            <template v-if="usersStore.currentUser.id === idea.fkIdUsuario">
              <p class="idea-card__mensaje">Eres el creador</p>
            </template>
            <template v-else-if="estadoApuntado[idea.id]">
              <template v-if="estadoAceptado[idea.id]">
                <div class="idea-card__extra">
                  <p class="idea-card__instrucciones"><strong>Instrucciones:</strong> {{ idea.instrucciones }}</p>
                  <p class="idea-card__contacto"><strong>Contacto:</strong> {{ idea.contacto }}</p>
                  <p class="idea-card__red"><strong>Red Social:</strong> {{ idea.nombreRedSocial }}</p>
                </div>
              </template>
              <template v-else>
                <p class="idea-card__mensaje">Pendiente de ser aceptado</p>
              </template>
            </template>
            <template v-else>
              <button
                class="idea-card__boton"
                @click="handleUnirse(idea.id, idea.fkIdUsuario)"
              >
                ¡Me uno!
              </button>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Variables para reutilización
$color-primary: #1e40af; // Azul más oscuro y serio
$color-primary-light: #3b82f6; // Variante más clara
$color-light: #f8fafc; // Fondo claro
$color-dark: #1e293b; // Texto oscuro
$color-gray: #64748b; // Gris medio para textos secundarios
$color-gray-light: #e2e8f0; // Gris claro para bordes y elementos secundarios
$color-success: #10b981; // Verde para mensajes positivos
$color-disabled: #94a3b8; // Gris para elementos deshabilitados
$border-radius: 8px;
$box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
$transition: all 0.2s ease-in-out;

// Mixins para reutilización
@mixin flex-column {
  display: flex;
  flex-direction: column;
}

@mixin button-reset {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  margin: 0;
}

// Estilos principales del componente
.ideas {
  padding: 1.25rem 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  
  &__boton {
    @include button-reset;
    background-color: $color-primary;
    color: white;
    border-radius: $border-radius;
    padding: 0.75rem 1.25rem;
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    box-shadow: $box-shadow;
    transition: $transition;
    
    &:hover {
      background-color: darken($color-primary, 8%);
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  &__lista {
    @include flex-column;
    gap: 1.25rem;
    
    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    
    @media (min-width: 1024px) {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }
  }
}

.idea-card {
  @include flex-column;
  background-color: $color-light;
  border-radius: $border-radius;
  border: 1px solid $color-gray-light;
  padding: 1.5rem;
  box-shadow: $box-shadow;
  transition: $transition;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  &__contenido {
    @include flex-column;
    gap: 0.75rem;
    flex: 1;
  }
  
  &__titulo {
    font-size: 1.25rem;
    font-weight: 700;
    color: $color-dark;
    margin: 0;
    line-height: 1.3;
    position: relative;
    padding-bottom: 0.75rem;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 2.5rem;
      background-color: $color-primary-light;
    }
  }
  
  &__descripcion {
    font-size: 0.95rem;
    line-height: 1.5;
    color: $color-gray;
    margin: 0;
    flex-grow: 1;
  }
  
  &__plazas {
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-primary;
    margin: 0.5rem 0 0.25rem;
  }
  
  &__barra-plazas {
    display: flex;
    gap: 6px;
    margin-top: 0.5rem;
    flex-wrap: wrap;
  }
  
  &__plaza {
    height: 8px;
    flex: 1;
    min-width: 16px;
    background-color: lighten($color-primary-light, 30%);
    border-radius: 4px;
    transition: $transition;
    
    &--ocupada {
      background-color: $color-disabled;
    }
  }
  
  &__acciones {
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid $color-gray-light;
    display: flex;
    justify-content: flex-end;
  }
  
  &__mensaje {
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-success;
    margin: 0;
    padding: 0.5rem 0;
  }
  
  &__boton {
    @include button-reset;
    background-color: $color-primary;
    color: white;
    padding: 0.75rem 1.25rem;
    border-radius: $border-radius;
    font-weight: 600;
    font-size: 0.9rem;
    transition: $transition;
    
    &:hover {
      background-color: darken($color-primary, 8%);
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.3);
    }
    
    &:active {
      transform: scale(0.98);
    }
  }
  .idea-card__extra {
  margin-top: 1rem;
  background: #f0f4ff;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.9rem;

  p {
    margin: 0.3rem 0;
  }
}

  // Adaptación responsive
  @media (min-width: 768px) {
    height: 100%; // Para asegurar que todas las cards tengan la misma altura
    
    &__acciones {
      justify-content: flex-end;
    }
  }
}
</style>