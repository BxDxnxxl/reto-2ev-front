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
    await ideasStore.fetchIdeasConPlazas();
    await verificarEstados();
  }
};

const toggleFormulario = () => {
  mostrarFormulario.value = !mostrarFormulario.value;
};

const cerrarModal = () => {
  mostrarFormulario.value = false;
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
  await Swal.fire({
    icon: 'info',
    title: 'Inicia sesión',
    text: 'Para realizar esta acción debes iniciar sesión.',
    confirmButtonText: 'Entendido'
  })
  return
}

if (userId === creadorId) {
  await Swal.fire({
    icon: 'warning',
    title: 'Acción no permitida',
    text: 'No puedes unirte a tu propia idea.',
    confirmButtonText: 'Ok'
  })
  return
}

if (estadoApuntado.value[idIdea]) {
  await Swal.fire({
    icon: 'info',
    title: 'Ya apuntado',
    text: 'Ya estás apuntado a esta idea.',
    confirmButtonText: 'Cerrar'
  })
  return
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
  <div class="ideas-container">
    <!-- Header con controles -->
    <div class="ideas-header">
      <div class="ideas-header__content">
        <h1 class="ideas-header__title">
          <span class="ideas-header__icon">💡</span>
          Explorar Ideas
        </h1>
        <p class="ideas-header__subtitle">Descubre proyectos increíbles y únete a la comunidad</p>
      </div>
      
      <div class="ideas-controls">
        <button class="btn-primary btn-primary--glow" @click="toggleFormulario">
          <span class="btn-icon">✨</span>
          Crear Idea
        </button>
        
        <div class="filter-container">
          <select class="filter-select" v-model="tipoSeleccionado" @change="onTipoSeleccionado">
            <option disabled value="">🔍 Filtrar por tipo</option>
            <option :value="null">🌟 Todas las ideas</option>
            <option v-for="tipo in ideasStore.tipos" :key="tipo.id" :value="tipo.id">
              {{ tipo.nombre }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Modal mejorado -->
    <Transition name="modal">
      <div v-if="mostrarFormulario" class="modal-overlay" @click="cerrarModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <div class="modal-header__content">
              <h2 class="modal-title">
                <span class="modal-icon">🚀</span>
                Crear Nueva Idea
              </h2>
              <p class="modal-subtitle">Comparte tu visión con la comunidad</p>
            </div>
            <button class="modal-close" @click="cerrarModal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <FormularioIdea @ideaPublicada="onIdeaPublicada" />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Grid de ideas -->
    <div class="ideas-grid">
      <TransitionGroup name="card" tag="div" class="ideas-grid__container">
        <div
          v-for="idea in tipoSeleccionado ? ideasStore.ideasFiltradasPorTipo : ideasStore.ideasConPlazas"
          :key="idea.id"
          class="idea-card"
          :class="{
            'idea-card--creator': usersStore.currentUser?.id === idea.fkIdUsuario,
            'idea-card--joined': estadoApuntado[idea.id],
            'idea-card--accepted': estadoAceptado[idea.id]
          }"
        >
          <!-- Indicador de estado -->
          <div class="idea-card__status" v-if="usersStore.currentUser">
            <div v-if="usersStore.currentUser.id === idea.fkIdUsuario" class="status-badge status-badge--creator">
              👑 Tu Idea
            </div>
            <div v-else-if="estadoAceptado[idea.id]" class="status-badge status-badge--accepted">
              ✅ Aceptado
            </div>
            <div v-else-if="estadoApuntado[idea.id]" class="status-badge status-badge--pending">
              ⏳ Pendiente
            </div>
          </div>

          <div class="idea-card__content">
            <!-- Header de la card -->
            <div class="idea-card__header">
              <h3 class="idea-card__title">{{ idea.titulo }}</h3>
              <div class="idea-card__type-badge">
                {{ idea.tipoIdeaNombre }}
              </div>
            </div>

            <!-- Descripción -->
            <p class="idea-card__description">{{ idea.descripcion }}</p>

            <!-- Fecha de caducidad -->
            <div class="idea-card__expiry" v-if="idea.fechaCaducidad">
              <span class="expiry-icon">⏰</span>
              Caduca el {{ new Date(idea.fechaCaducidad).toLocaleDateString() }}
            </div>

            <!-- Plazas con animación -->
            <div class="idea-card__spots">
              <div class="spots-header">
                <span class="spots-text">
                  <strong>{{ idea.plazasLibres }}</strong> de <strong>{{ idea.plazasTotales }}</strong> plazas libres
                </span>
                <span class="spots-percentage">
                  {{ Math.round((idea.plazasLibres / idea.plazasTotales) * 100) }}%
                </span>
              </div>
              
              <div class="spots-bar">
                <div class="spots-bar__track">
                  <div 
                    class="spots-bar__fill" 
                    :style="{ width: `${(idea.plazasLibres / idea.plazasTotales) * 100}%` }"
                  ></div>
                </div>
              </div>

              <div class="spots-dots">
                <div
                  v-for="index in idea.plazasTotales"
                  :key="index"
                  :class="[
                    'spot-dot',
                    index > idea.plazasLibres ? 'spot-dot--filled' : 'spot-dot--empty'
                  ]"
                  :style="{ 'animation-delay': `${index * 0.1}s` }"
                ></div>
              </div>
            </div>

            <!-- Información extra para usuarios aceptados -->
            <Transition name="expand">
              <div v-if="estadoAceptado && estadoAceptado[idea.id]" class="idea-card__extra">
                <div class="extra-section">
                  <h4 class="extra-title">📋 Instrucciones</h4>
                  <p class="extra-content">{{ idea.instrucciones }}</p>
                </div>
                <div class="extra-section">
                  <h4 class="extra-title">📞 Contacto</h4>
                  <p class="extra-content">{{ idea.contacto }}</p>
                </div>
                <div class="extra-section">
                  <h4 class="extra-title">🌐 Red Social</h4>
                  <p class="extra-content">{{ idea.redSocialNombre }}</p>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Acciones -->
          <div class="idea-card__actions">
            <template v-if="usersStore.currentUser">
              <template v-if="usersStore.currentUser.id === idea.fkIdUsuario">
                <div class="creator-badge">
                  <span class="creator-icon">👑</span>
                  Eres el creador
                </div>
              </template>
              <template v-else-if="!estadoApuntado[idea.id]">
                <button
                  class="btn-join"
                  @click="handleUnirse(idea.id, idea.fkIdUsuario)"
                >
                  <span class="btn-join__icon">🚀</span>
                  <span class="btn-join__text">¡Me Uno!</span>
                  <div class="btn-join__glow"></div>
                </button>
              </template>
              
              <!-- Botón eliminar mejorado -->
              <button
                v-if="usersStore.currentUser.id === idea.fkIdUsuario || usersStore.currentUser.roles.some(r => r.id === rolesStore.ADMIN)"
                @click="eliminarIdea(idea.id, idea.titulo)"
                class="btn-delete"
                title="Eliminar idea"
              >
                <span class="btn-delete__icon">🗑️</span>
              </button>
            </template>
            <template v-else>
              <div class="login-prompt">
                <span class="login-icon">🔒</span>
                Inicia sesión para unirte
              </div>
            </template>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/styles/variables.scss";
@import "@/assets/styles/mixins.scss";

// Variables adicionales para el diseño mejorado
$glassmorphism-bg: rgba(255, 255, 255, 0.08);
$glassmorphism-border: rgba(255, 255, 255, 0.12);
$gradient-primary: linear-gradient(135deg, #f25421, #ff8c00, #ffd700);
$gradient-dark: linear-gradient(135deg, #1a1a1a, #2a2a2a);
$neon-glow: 0 0 20px rgba(242, 84, 33, 0.3);

.ideas-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(242, 84, 33, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255, 215, 0, 0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
}

// Header mejorado
.ideas-header {
  position: relative;
  z-index: 1;
  padding: $spacing-xxl $spacing-large;
  text-align: center;
  
  &__content {
    margin-bottom: $spacing-xl;
  }
  
  &__title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    background: $gradient-primary;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-medium;
    text-shadow: 0 0 30px rgba(242, 84, 33, 0.3);
  }
  
  &__icon {
    font-size: 0.8em;
    animation: pulse 2s infinite;
  }
  
  &__subtitle {
    font-size: $font-size-large;
    color: rgba($text-color, 0.7);
    margin: $spacing-medium 0 0;
    font-weight: 300;
  }
}

// Controles mejorados
.ideas-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-large;
  flex-wrap: wrap;
}

.btn-primary {
  position: relative;
  background: $gradient-primary;
  border: none;
  color: white;
  padding: $spacing-medium $spacing-xl;
  border-radius: 50px;
  font-weight: 700;
  font-size: $font-size-base;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  &--glow {
    box-shadow: $neon-glow;
    
    &:hover {
      box-shadow: 0 0 30px rgba(242, 84, 33, 0.5);
      transform: translateY(-2px) scale(1.05);
    }
  }
  
  .btn-icon {
    margin-right: $spacing-small;
    font-size: 1.2em;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
}

.filter-container {
  position: relative;
}

.filter-select {
  appearance: none;
  background: $glassmorphism-bg;
  backdrop-filter: blur(20px);
  border: 1px solid $glassmorphism-border;
  border-radius: 25px;
  padding: $spacing-medium $spacing-xl;
  color: $text-color;
  font-size: $font-size-base;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  
  &:hover {
    border-color: rgba(242, 84, 33, 0.5);
    box-shadow: 0 0 15px rgba(242, 84, 33, 0.2);
  }
  
  &:focus {
    outline: none;
    border-color: $accent-color;
    box-shadow: 0 0 20px rgba(242, 84, 33, 0.3);
  }
}

// Modal mejorado
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: $spacing-medium;
}

.modal-content {
  background: $glassmorphism-bg;
  backdrop-filter: blur(30px);
  border: 1px solid $glassmorphism-border;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(242, 84, 33, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: $spacing-xl;
  border-bottom: 1px solid $glassmorphism-border;
  
  &__content {
    flex: 1;
  }
}

.modal-title {
  font-size: $font-size-xlarge;
  font-weight: 700;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  display: flex;
  align-items: center;
  gap: $spacing-small;
}

.modal-icon {
  font-size: 1.2em;
}

.modal-subtitle {
  color: rgba($text-color, 0.7);
  font-size: $font-size-small;
  margin: $spacing-small 0 0;
}

.modal-close {
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: $text-color;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  
  &:hover {
    background: rgba(220, 38, 38, 0.8);
    transform: scale(1.1);
  }
}

// Grid de ideas
.ideas-grid {
  position: relative;
  z-index: 1;
  padding: 0 $spacing-large $spacing-xxl;
  
  &__container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: $spacing-xl;
    max-width: 1400px;
    margin: 0 auto;
  }
}

// Cards mejoradas
.idea-card {
  position: relative;
  background: $glassmorphism-bg;
  backdrop-filter: blur(20px);
  border: 1px solid $glassmorphism-border;
  border-radius: 20px;
  padding: $spacing-xl;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: $gradient-primary;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 20px 40px -8px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(242, 84, 33, 0.2);
    border-color: rgba(242, 84, 33, 0.3);
    
    &::before {
      opacity: 1;
    }
  }
  
  &--creator {
    border-color: rgba(255, 215, 0, 0.4);
    
    &::before {
      background: linear-gradient(90deg, #ffd700, #ffed4e);
      opacity: 1;
    }
  }
  
  &--accepted {
    border-color: rgba(16, 185, 129, 0.4);
    
    &::before {
      background: linear-gradient(90deg, #10b981, #34d399);
      opacity: 1;
    }
  }
  
  &--joined {
    border-color: rgba(250, 204, 21, 0.4);
    
    &::before {
      background: linear-gradient(90deg, #facc15, #fde047);
      opacity: 1;
    }
  }
}

.idea-card__status {
  position: absolute;
  top: $spacing-medium;
  right: $spacing-medium;
  z-index: 2;
}

.status-badge {
  padding: $spacing-small $spacing-medium;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &--creator {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #1a1a1a;
  }
  
  &--accepted {
    background: linear-gradient(135deg, #10b981, #34d399);
    color: white;
  }
  
  &--pending {
    background: linear-gradient(135deg, #facc15, #fde047);
    color: #1a1a1a;
  }
}

.idea-card__content {
  position: relative;
  z-index: 1;
}

.idea-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $spacing-medium;
  margin-bottom: $spacing-large;
}

.idea-card__title {
  font-size: $font-size-xlarge;
  font-weight: 700;
  color: $text-color;
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.idea-card__type-badge {
  background: rgba(242, 84, 33, 0.2);
  color: #ff8c00;
  padding: $spacing-small $spacing-medium;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid rgba(242, 84, 33, 0.3);
}

.idea-card__description {
  color: rgba($text-color, 0.8);
  line-height: 1.6;
  margin: 0 0 $spacing-large;
  font-size: $font-size-base;
}

.idea-card__expiry {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  background: rgba(250, 204, 21, 0.1);
  color: #facc15;
  padding: $spacing-small $spacing-medium;
  border-radius: 10px;
  font-size: $font-size-small;
  font-weight: 600;
  margin-bottom: $spacing-large;
  border: 1px solid rgba(250, 204, 21, 0.2);
}

.expiry-icon {
  font-size: 1.1em;
}

// Plazas mejoradas
.idea-card__spots {
  margin-bottom: $spacing-large;
}

.spots-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-small;
}

.spots-text {
  color: $text-color;
  font-size: $font-size-small;
  
  strong {
    color: $accent-color;
    font-weight: 700;
  }
}

.spots-percentage {
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: $font-size-small;
}

.spots-bar {
  margin-bottom: $spacing-medium;
  
  &__track {
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
  }
  
  &__fill {
    height: 100%;
    background: $gradient-primary;
    border-radius: 10px;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 2s infinite;
    }
  }
}

.spots-dots {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.spot-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: all 0.3s ease;
  animation: fadeInDot 0.5s ease forwards;
  
  &--empty {
    background: rgba(242, 84, 33, 0.3);
    border: 2px solid rgba(242, 84, 33, 0.5);
  }
  
  &--filled {
    background: rgba(148, 163, 184, 0.3);
    border: 2px solid rgba(148, 163, 184, 0.5);
  }
}

// Información extra
.idea-card__extra {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: $spacing-large;
  margin-bottom: $spacing-large;
}

.extra-section {
  margin-bottom: $spacing-medium;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.extra-title {
  font-size: $font-size-small;
  font-weight: 700;
  color: $accent-color;
  margin: 0 0 $spacing-small;
  display: flex;
  align-items: center;
  gap: $spacing-small;
}

.extra-content {
  color: rgba($text-color, 0.9);
  margin: 0;
  font-size: $font-size-small;
  line-height: 1.5;
}

// Acciones
.idea-card__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-medium;
  margin-top: $spacing-large;
  padding-top: $spacing-large;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.creator-badge {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  color: #ffd700;
  font-weight: 600;
  font-size: $font-size-small;
}

.creator-icon {
  font-size: 1.2em;
  animation: glow 2s ease-in-out infinite alternate;
}

.btn-join {
  position: relative;
  background: $gradient-primary;
  border: none;
  color: white;
  padding: $spacing-medium $spacing-xl;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: $spacing-small;
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 10px 25px rgba(242, 84, 33, 0.4);
  }
  
  &:active {
    transform: translateY(0) scale(1);
  }
  
  &__icon {
    font-size: 1.1em;
    transition: transform 0.3s ease;
  }
  
  &__text {
    font-size: $font-size-base;
  }
  
  &__glow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.6s;
  }
  
  &:hover &__icon {
    transform: scale(1.2);
  }
  
  &:hover &__glow {
    left: 100%;
  }
}

.btn-delete {
  position: relative;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #ef4444;
  padding: $spacing-medium;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(220, 38, 38, 0.8);
    color: white;
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
  }
  
  &__icon {
    font-size: 1.1em;
    transition: transform 0.3s ease;
  }
  
  &:hover &__icon {
    transform: scale(1.2);
  }
}

.login-prompt {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  color: rgba($text-color, 0.6);
  font-size: $font-size-small;
  font-style: italic;
}

.login-icon {
  font-size: 1.1em;
}

// Animaciones
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes glow {
  0% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  100% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes fadeInDot {
  0% { 
    opacity: 0; 
    transform: scale(0.5); 
  }
  100% { 
    opacity: 1; 
    transform: scale(1); 
  }
}

// Transiciones
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.card-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.card-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.card-move {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

// Responsive design
@media (max-width: $laptop) {
  .ideas-grid__container {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: $spacing-large;
  }
  
  .ideas-header {
    padding: $spacing-xl $spacing-medium;
    
    &__title {
      font-size: clamp(2rem, 4vw, 3rem);
    }
  }
  
  .ideas-controls {
    flex-direction: column;
    gap: $spacing-medium;
  }
  
  .filter-select {
    min-width: auto;
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: $desktop) {
  .ideas-grid__container {
    grid-template-columns: 1fr;
    gap: $spacing-medium;
  }
  
  .idea-card {
    padding: $spacing-large;
  }
  
  .ideas-header {
    padding: $spacing-large $spacing-medium;
  }
  
  .modal-content {
    margin: $spacing-medium;
    max-height: calc(100vh - #{$spacing-large});
  }
  
  .modal-header {
    padding: $spacing-large;
  }
}

@media (max-width: 480px) {
  .idea-card__header {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-small;
  }
  
  .idea-card__type-badge {
    align-self: flex-start;
  }
  
  .spots-dots {
    justify-content: center;
  }
  
  .idea-card__actions {
    flex-direction: column;
    gap: $spacing-small;
    align-items: stretch;
  }
  
  .btn-join {
    justify-content: center;
  }
}

// Mejoras de accesibilidad
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// Tema oscuro mejorado
@media (prefers-color-scheme: dark) {
  .ideas-container {
    background: linear-gradient(135deg, #000000 0%, #111111 50%, #000000 100%);
  }
  
  .idea-card {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.08);
  }
  
  .modal-content {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

// Estados de focus mejorados para accesibilidad
.btn-primary:focus,
.btn-join:focus,
.btn-delete:focus,
.filter-select:focus,
.modal-close:focus {
  outline: 2px solid $accent-color;
  outline-offset: 2px;
}

// Hover states para dispositivos táctiles
@media (hover: hover) {
  .idea-card:hover {
    transform: translateY(-8px) scale(1.02);
  }
}

@media (hover: none) {
  .idea-card:active {
    transform: scale(0.98);
  }
}
</style>