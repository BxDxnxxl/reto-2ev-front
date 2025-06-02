<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useIdeasStore } from "@/stores/Ideas";
import { useUsersStore } from "@/stores/users";
import { useUsuariosApuntadosStore } from "@/stores/UsuarioApuntado";
import FormularioIdea from "@/components/FormularioIdea.vue";
import Swal from "sweetalert2";
import { useRolesStore } from "@/stores/roles";

const rolesStore = useRolesStore();

const ideasStore = useIdeasStore();
const usersStore = useUsersStore();
const usuariosApuntadosStore = useUsuariosApuntadosStore();

const mostrarFormulario = ref(false);
const estadoApuntado = ref<{ [key: number]: boolean }>({});
const estadoAceptado = ref<{ [key: number]: boolean }>({});
const tipoSeleccionado = ref<number | null>(null);

onMounted(async () => {
  await ideasStore.fetchIdeasConPlazas();
  await verificarEstados();
  await ideasStore.fetchTiposIdeas();
});

const onTipoSeleccionado = async () => {
  if (tipoSeleccionado.value) {
    await ideasStore.fetchIdeasPorTipo(tipoSeleccionado.value);
    await verificarEstados();
  } else {
    await ideasStore.fetchIdeasConPlazas(); // Mostrar todas las ideas si no hay filtro
    await verificarEstados();
  }
};

const toggleFormulario = () => {
  mostrarFormulario.value = !mostrarFormulario.value;
};

const onIdeaPublicada = async () => {
  mostrarFormulario.value = false;
  await ideasStore.fetchIdeasConPlazas();
  await verificarEstados();
};

const verificarEstados = async () => {
  const userId = usersStore.currentUser?.id;
  if (!userId) return;

  for (const idea of ideasStore.ideasConPlazas) {
    const apuntado = await usuariosApuntadosStore.verificarSiUsuarioApuntado(idea.id, userId);
    const estado = await usuariosApuntadosStore.verificarEstadoApuntadoYAceptado(idea.id, userId);

    estadoApuntado.value[idea.id] = apuntado;
    estadoAceptado.value[idea.id] = estado.aceptado;
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
  await verificarEstados();
};

const eliminarIdea = async (idIdea: number, tituloIdea: string) => {
  try {
    const usuariosIds = await ideasStore.deleteIdea(idIdea);

    await Swal.fire({
      icon: "success",
      title: "Idea borrada",
      text: `Idea "${tituloIdea}" borrada correctamente.`,
      timer: 2000,
      showConfirmButton: false,
    });

    for (const idUsuario of usuariosIds) {
      const usuario = await usersStore.fetchUsuarioById(idUsuario);
      if (usuario && usuario.email) {
        const asunto = encodeURIComponent(`La idea "${tituloIdea}" ha sido eliminada`);
        const cuerpo = encodeURIComponent(
          `Hola ${usuario.nombre},\n\n` +
          `La idea "${tituloIdea}" a la que estabas apuntado ha sido eliminada.\n` +
          `Este correo ha sido enviado por wannagamessv@gmail.com.\n\n` +
          `Saludos.`
        );
        const mailtoLink = `mailto:${usuario.email}?subject=${asunto}&body=${cuerpo}`;
        window.open(mailtoLink, "_blank");
      } else {
        console.warn(`No se encontró email para el usuario con id ${idUsuario}`);
      }
    }

    // Recarga las ideas
    await ideasStore.fetchIdeasConPlazas();
  } catch (error) {
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error al borrar la idea.",
    });
    console.error(error);
  }
};

</script>

<template>
  <div class="ideas">
    <button class="ideas__boton" @click="toggleFormulario">
      {{ mostrarFormulario ? "Cancelar" : "➕ Añadir idea" }}
    </button>
    <select class="ideas__select" v-model="tipoSeleccionado" @change="onTipoSeleccionado">
      <option disabled value="">Filtrar por tipo de idea</option>
      <option :value="null">Todas las ideas</option>
      <option v-for="tipo in ideasStore.tipos" :key="tipo.id" :value="tipo.id">
        {{ tipo.nombre }}
      </option>
    </select>
    <FormularioIdea v-if="mostrarFormulario" @ideaPublicada="onIdeaPublicada" />

    <div class="ideas__lista">
      <div
        v-for="idea in tipoSeleccionado ? ideasStore.ideasFiltradasPorTipo : ideasStore.ideasConPlazas"
        :key="idea.id"
        class="idea-card"
      >
        <div class="idea-card__contenido">
          <h3 class="idea-card__titulo">{{ idea.titulo }}</h3>
          <p class="idea-card__tipo">Tipo: <strong>{{ idea.tipoIdeaNombre }}</strong></p>
          <p class="idea-card__descripcion">Descripción: {{ idea.descripcion }}</p>

          <p class="idea-card__fecha-caducidad" v-if="idea.fechaCaducidad">
            Caduca el: {{ new Date(idea.fechaCaducidad).toLocaleDateString() }}
          </p>

          <!-- Contenedor fijo para plazas -->
          <div class="idea-card__plazas-container">
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

          <div v-if="usersStore.currentUser">
            <template v-if="estadoAceptado[idea.id]">
              <div class="idea-card__extra">
                <p><strong>Instrucciones:</strong> {{ idea.instrucciones }}</p>
                <p><strong>Contacto:</strong> {{ idea.contacto }}</p>
                <p><strong>Red Social:</strong> {{ idea.redSocialNombre }}</p>
              </div>
            </template>
            <template v-else-if="estadoApuntado[idea.id]">
              <p class="idea-card__pendiente">Pendiente de ser aceptado</p>
            </template>
          </div>
        </div>

        <div class="idea-card__acciones">
          <template v-if="usersStore.currentUser">
            <template v-if="usersStore.currentUser.id === idea.fkIdUsuario">
              <p class="idea-card__mensaje">Eres el creador</p>
            </template>
            <template v-else-if="estadoApuntado[idea.id]">
              <p class="idea-card__mensaje">Ya estás apuntado</p>
            </template>
            <template v-else>
              <button
                class="idea-card__boton"
                @click="handleUnirse(idea.id, idea.fkIdUsuario)"
              >
                ¡Me uno!
              </button>
            </template>
            <!-- Botón borrar solo para propietario o admin -->
            <button
              v-if="usersStore.currentUser.id === idea.fkIdUsuario || usersStore.currentUser.roles.some(r => r.id === rolesStore.ADMIN)"
              @click="eliminarIdea(idea.id, idea.titulo)"
              class="idea-card__boton-borrar"
              title="Borrar idea"
            >
              Borrar idea
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@/assets/styles/variables.scss";
@import "@/assets/styles/mixins.scss";

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

.ideas {
  padding: $spacing-large $spacing-medium;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  &__boton {
    @include button-reset;
    background-color: $btn-color;
    color: $text-color;
    border-radius: $border-radius;
    padding: $spacing-medium $spacing-large;
    font-size: $font-size-base;
    font-weight: 600;
    margin-bottom: $spacing-large;
    box-shadow: $box-shadow;
    transition: $transition;

    &:hover {
      background-color: darken($btn-color, 8%);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }
   &__select {
    padding: $spacing-medium $spacing-large;
    border: 1px solid lighten($secondary-color, 40%);
    border-radius: $border-radius;
    font-size: $font-size-base;
    font-family: inherit;
    background-color: $btn-color;
    color: $text-color;
    transition: $transition;
    outline: none;
    margin-bottom: $spacing-large;
    margin-left: $spacing-large;

    &:focus {
      border-color: $accent-color;
      box-shadow: 0 0 0 2px rgba($accent-color, 0.3);
    }
  }

  &__lista {
    @include flex-column;
    gap: $spacing-large;

    @media (min-width: $desktop) {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: $spacing-large;
    }

    @media (min-width: $laptop) {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: $spacing-large * 1.25;
    }
  }
}

.idea-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: $background-color;
  border-radius: $border-radius;
  border: 1px solid lighten($dark-color, 30%);
  padding: $spacing-large;
  box-shadow: $box-shadow;
  transition: $transition;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  &__contenido {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  &__titulo {
    font-size: $font-size-xlarge;
    font-weight: 700;
    color: $text-color;
    margin: 0;
    line-height: 1.3;
    position: relative;
    padding-bottom: $spacing-medium;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 2.5rem;
      background-color: $accent-color;
    }
  }

  &__descripcion {
    font-size: $font-size-base;
    line-height: 1.5;
    color: lighten($text-color, 25%);
    margin: 0;
    flex-grow: 1;
  }

   &__fecha-caducidad {
    font-size: 0.85rem;
    font-weight: 600;
    color: #d97706;
    background-color: #fef3c7;
    padding: 0.3rem 0.75rem;
    border-radius: 6px;
    margin-top: 0.75rem;
    width: fit-content;
    user-select: none;
  }

  &__plazas-container {
    margin-top: $spacing-medium;
    margin-bottom: $spacing-medium;
  }

  &__plazas {
    font-size: $font-size-small;
    font-weight: 600;
    color: $btn-color;
    margin: 0 0 $spacing-small;
  }

  &__barra-plazas {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__plaza {
    height: 8px;
    flex: 1;
    min-width: 16px;
    background-color: lighten($btn-color, 25%);
    border-radius: 4px;
    transition: $transition;

    &--ocupada {
      background-color: $color-disabled;
    }
  }

   &__acciones {
    padding-top: $spacing-large;
    border-top: 1px solid lighten($dark-color, 40%);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.75rem; // espacio entre botones
  }

  &__mensaje {
    font-size: $font-size-small;
    font-weight: 600;
    color: $color-success;
    margin: 0;
    padding: $spacing-small 0;
  }

  &__boton {
    @include button-reset;
    background-color: $btn-color;
    color: $text-color;
    padding: $spacing-medium $spacing-large;
    border-radius: $border-radius;
    font-weight: 600;
    font-size: $font-size-base;
    transition: $transition;

    &:hover {
      background-color: darken($btn-color, 8%);
    }

    &:focus {
      box-shadow: 0 0 0 3px rgba($btn-color, 0.3);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  &__boton-borrar {
    @include button-reset;
    background-color: #dc2626; // rojo fuerte (Tailwind red-600)
    color: white;
    padding: $spacing-medium $spacing-large;
    border-radius: $border-radius;
    font-weight: 600;
    font-size: $font-size-base;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #b91c1c; // rojo más oscuro (Tailwind red-700)
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.5);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  &__extra {
    margin-top: $spacing-medium;
    background: lighten($background-color, 10%);
    padding: $spacing-medium;
    border-left: 4px solid $accent-color;
    border-radius: $border-radius;
    font-size: $font-size-small;

    p {
      margin: 0.3rem 0;
      color: $text-color;

      strong {
        color: $accent-color;
      }
    }
  }

  &__pendiente {
    font-size: $font-size-small;
    color: $color-warning;
    font-weight: 600;
    background: #fef9c3;
    border-left: 4px solid $color-warning;
    padding: $spacing-medium $spacing-large;
    border-radius: $border-radius;
    margin-top: $spacing-medium;
  }

}
</style>
