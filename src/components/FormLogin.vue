<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUsersStore } from "@/stores/users";

const usersStore = useUsersStore();

const loginData = ref({ username: "", password: "" });
const registerData = ref({ username: "", email: "", password: "" });

const handleLogin = async () => {
  await usersStore.login(loginData.value);
};

const handleRegister = async () => {
  await usersStore.register(registerData.value);
};

const isSignup = ref(false);  // Variable para controlar el estado

onMounted(() => {
  const toggleBtn = document.querySelector(".toggle-btn") as HTMLElement;
  const container = document.querySelector(".form-container") as HTMLElement;

  if (toggleBtn && container) {
    toggleBtn.addEventListener("click", () => {
      isSignup.value = !isSignup.value;  // Alterna entre login y signup
    });
  }
});
</script>


<template>
  <div class="form-container" :class="{ 'is-signup': isSignup }">
    <div class="form login-form">
      <h2>Bienvenido</h2>
      <label>
        <span>Usuario</span>
        <input type="text" v-model="loginData.username" />
      </label>
      <label>
        <span>Contraseña</span>
        <input type="password" v-model="loginData.password" />
      </label>
      <button type="button" class="submit-btn" @click="handleLogin">Iniciar Sesión</button>
    </div>
    
    <div class="sub-container">
      <div class="image-container">
        <img src="@/assets/img/imagenLogin.jpg" alt="Imagen de Login" />
        <div class="image-text show-up">
          <h2>¿No estas registrado?</h2>
          <p>Registrate y conviértete en uno más de nuestra comunidad</p>
        </div>
        <div class="image-text show-in">
          <h2>¿Ya eres usuario?</h2>
          <p>Si ya estás registrado, inicia sesión y empieza a disfrutar</p>
        </div>
        
        <div class="toggle-btn">
          <span v-if="!isSignup">Registrate</span>
          <span v-if="isSignup">Inicia Sesión</span>
        </div>
      </div>

      <div class="form signup-form">
        <h2>Únete a la comunidad</h2>
        <label>
          <span>Nombre de usuario</span>
          <input type="text" v-model="registerData.username" />
        </label>
        <label>
          <span>Email</span>
          <input type="email" v-model="registerData.email" />
        </label>
        <label>
          <span>Contraseña</span>
          <input type="password" v-model="registerData.password" />
        </label>
        <button type="button" class="submit-btn" @click="handleRegister">Registrarse</button>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  background-color: #768cb6;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;  // Asegura que el contenido se mantenga centrado en la pantalla
}

input, button {
  border: none;
  outline: none;
  background: none;
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
}

$container-width: 900px;
$image-width: 260px;
$form-width: $container-width - $image-width;
$transition-time: 1.2s;

$input-width: 260px;
$button-height: 36px;

$diff-ratio: ($container-width - $image-width) / $container-width;

@mixin signupActive {
  .form-container.is-signup & {
    @content;
  }
}

.form-container {
  overflow: hidden;
  position: relative;
  width: $container-width;
  height: 550px;
  margin: 20px auto 100px;  // Añadí un margen superior de 20px
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;  // Centra el contenido tanto vertical como horizontalmente
}

.form {
  position: relative;
  width: $form-width;
  height: 100%;
  transition: transform $transition-time ease-in-out;
  padding: 50px 30px 0;  // El espaciado de la sección del formulario
}

.toggle-btn {
  position: absolute;
  bottom: 50px; 
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  cursor: pointer;
  text-align: center;
  width: 100px;

  span {
    display: block;
    color: white;
    font-size: 16px;
    text-transform: uppercase;
    transition: transform $transition-time ease-in-out;
  }
}

.sub-container {
  overflow: hidden;
  position: absolute;
  left: $form-width;
  top: 0;
  width: $container-width;
  height: 100%;
  padding-left: $image-width;
  background: #fff;
  transition: transform $transition-time ease-in-out;

  @include signupActive {
    transform: translate3d($form-width * -1, 0, 0);
  }
}

button {
  display: block;
  margin: 0 auto;
  width: $input-width;
  height: $button-height;
  border-radius: 30px;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}

.image-container {
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  width: $image-width;
  height: 100%;
  padding-top: 200px;  // Ajusté para que haya el mismo espacio entre imagen y formulario

  &:before {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: $container-width;
    height: 100%;
    background-image: url('@/assets/img/imagenLogin.jpg');
    background-size: cover;
    transition: transform $transition-time ease-in-out;
  }

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
  }

  @include signupActive {
    &:before {
      transform: translate3d($form-width, 0, 0);
    }
  }

  .image-text {
    z-index: 2;
    position: absolute;
    left: 0;
    top: 50px;
    width: 100%;
    padding: 0 20px;
    text-align: center;
    color: #fff;
    transition: transform $transition-time ease-in-out;

    h2 {
      margin-bottom: 10px;
      font-weight: normal;
    }

    p {
      font-size: 14px;
      line-height: 1.5;
    }

    &.show-up {
      @include signupActive {
        transform: translateX($image-width*2);
      }
    }

    &.show-in {
      transform: translateX($image-width * -2);

      @include signupActive {
        transform: translateX(0);
      }
    }
  }
}

h2 {
  width: 100%;
  font-size: 26px;
  text-align: center;
}

label {
  display: block;
  width: $input-width;
  margin: 25px auto 0;
  text-align: center;

  span {
    font-size: 12px;
    color: #cfcfcf;
    text-transform: uppercase;
  }
}

input {
  display: block;
  width: 100%;
  margin-top: 5px;
  padding-bottom: 5px;
  font-size: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.4);
  text-align: center;
}

.submit-btn {
  margin-top: 40px;
  margin-bottom: 20px;
  background: #f25421;
  text-transform: uppercase;
}

.login-form {
  transition-timing-function: ease-out;

  @include signupActive {
    transition-timing-function: ease-in-out;
    transition-duration: $transition-time;
    transform: translate3d($form-width, 0, 0);
  }
}

.signup-form {
  transform: translate3d($container-width * -1, 0, 0);

  @include signupActive {
    transform: translate3d(0, 0, 0);
  }
}
</style>


