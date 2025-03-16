<script setup lang="ts">
import { ref, computed } from "vue";
import { useUsersStore } from "@/stores/users";
import { useRouter } from "vue-router";
import type { UserLoginDto } from "@/stores/dtos/userLogin.dto";
import type { UserDto } from "@/stores/dtos/user.dto";

const router = useRouter();
const usersStore = useUsersStore();

// Datos de formularios
const loginData = ref({ 
  username: "", 
  password: "" 
});

const registerData = ref({ 
  username: "", 
  email: "", 
  contrasenia: "",
  confirmarContrasenia: ""
});

const isSignup = ref(false);

const loginErrors = ref({
  username: "",
  password: "",
  general: ""
});

const registerErrors = ref({
  username: "",
  email: "",
  contrasenia: "",
  confirmarContrasenia: "",
  general: ""
});

const currentUser = ref<UserDto | null>(null);

const isLoginValid = computed(() => {
  return !loginErrors.value.username && 
         !loginErrors.value.password && 
         loginData.value.username && 
         loginData.value.password;
});

const isRegisterValid = computed(() => {
  return !registerErrors.value.username && 
         !registerErrors.value.email && 
         !registerErrors.value.contrasenia && 
         !registerErrors.value.confirmarContrasenia && 
         registerData.value.username && 
         registerData.value.email && 
         registerData.value.contrasenia &&
         registerData.value.contrasenia === registerData.value.confirmarContrasenia;
});

function isValidEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateLogin() {
  loginErrors.value = {
    username: "",
    password: "",
    general: ""
  };
  
  if (!loginData.value.username) {
    loginErrors.value.username = "El nombre de usuario es obligatorio";
  } else if (loginData.value.username.length < 3) {
    loginErrors.value.username = "El nombre de usuario debe tener al menos 3 caracteres";
  }
  
  if (!loginData.value.password) {
    loginErrors.value.password = "La contraseña es obligatoria";
  } else if (loginData.value.password.length < 8) {
    loginErrors.value.password = "La contraseña debe tener al menos 8 caracteres";
  }
  
  return isLoginValid.value;
}

function validateRegister() {
  registerErrors.value = {
    username: "",
    email: "",
    contrasenia: "",
    confirmarContrasenia: "",
    general: ""
  };
  
  if (!registerData.value.username) {
    registerErrors.value.username = "El nombre de usuario es obligatorio";
  } else if (registerData.value.username.length < 3) {
    registerErrors.value.username = "El nombre de usuario debe tener al menos 3 caracteres";
  }
  
  if (!registerData.value.email) {
    registerErrors.value.email = "El email es obligatorio";
  } else if (!isValidEmail(registerData.value.email)) {
    registerErrors.value.email = "El formato del email no es válido";
  }
  
  if (!registerData.value.contrasenia) {
    registerErrors.value.contrasenia = "La contraseña es obligatoria";
  } else if (registerData.value.contrasenia.length < 8) {
    registerErrors.value.contrasenia = "La contraseña debe tener al menos 8 caracteres";
  }
  
  if (!registerData.value.confirmarContrasenia) {
    registerErrors.value.confirmarContrasenia = "Debe confirmar su contraseña";
  } else if (registerData.value.confirmarContrasenia !== registerData.value.contrasenia) {
    registerErrors.value.confirmarContrasenia = "Las contraseñas no coinciden";
  }
  
  return isRegisterValid.value;
}

const handleLogin = async () => {
  if (!validateLogin()) {
    return;
  }
  
  const usuarioLogin: UserLoginDto = {
    username: loginData.value.username,
    password: loginData.value.password
  };
  
  try {
    const success = await usersStore.login(usuarioLogin);
    
    if (success) {
      currentUser.value = usersStore.currentUser;
      router.push("/");
    } else {
      loginErrors.value.general = "Credenciales inválidas. Por favor, inténtelo de nuevo.";
    }
  } catch (error) {
    console.error("Error en login:", error);
    loginErrors.value.general = `Error al iniciar sesión: ${error instanceof Error ? error.message : 'Desconocido'}`;
  }
};

const handleRegister = async () => {
  if (!validateRegister()) {
    return;
  }
  
  try {
    const success = await usersStore.register({
      username: registerData.value.username,
      email: registerData.value.email,
      Contrasenia: registerData.value.contrasenia
    });
    
    if (success) {

      isSignup.value = false;
      registerData.value = { username: "", email: "", contrasenia: "", confirmarContrasenia: "" };
 
      loginErrors.value.general = "Registro exitoso. Por favor, inicie sesión.";
    } else {
      registerErrors.value.general = "No se pudo completar el registro. Por favor, inténtelo de nuevo.";
    }
  } catch (error) {
    console.error("Error en registro:", error);
    registerErrors.value.general = `Error al registrarse: ${error instanceof Error ? error.message : 'Desconocido'}`;
  }
};

const toggleSignup = () => {
  isSignup.value = !isSignup.value;
  
  if (isSignup.value) {
    loginData.value = { username: "", password: "" };
    loginErrors.value = { username: "", password: "", general: "" };
  } else {
    registerData.value = { username: "", email: "", contrasenia: "", confirmarContrasenia: "" };
    registerErrors.value = { username: "", email: "", contrasenia: "", confirmarContrasenia: "", general: "" };
  }
};

const clearLoginError = (field: keyof typeof loginErrors.value) => {
  loginErrors.value[field] = "";
};

const clearRegisterError = (field: keyof typeof registerErrors.value) => {
  registerErrors.value[field] = "";
};

const innerHeight = ref<number>(window.innerHeight);
</script>
<template>
  <main class="auth" :style="{ height: innerHeight ? innerHeight + 'px' : '100%' }">
    <div class="auth__container" :class="{ 'auth__container--signup': isSignup }">

      <!-- Formulario de Login -->
      <form class="auth__form auth__form--login" @submit.prevent="handleLogin">
        <h2 class="auth__title">Bienvenido</h2>
        
        <div v-if="loginErrors.general" class="auth__error auth__error--general">
          {{ loginErrors.general }}
        </div>
        
        <label class="auth__field">
          <span class="auth__label">Usuario</span>
          <input 
            class="auth__input"
            type="text" 
            v-model="loginData.username" 
            @input="clearLoginError('username')"
            required 
          />
          <div v-if="loginErrors.username" class="auth__error">
            {{ loginErrors.username }}
          </div>
        </label>
        
        <label class="auth__field">
          <span class="auth__label">Contraseña</span>
          <input 
            class="auth__input"
            type="password" 
            v-model="loginData.password" 
            @input="clearLoginError('password')"
            required 
          />
          <div v-if="loginErrors.password" class="auth__error">
            {{ loginErrors.password }}
          </div>
        </label>
        
        <button 
          type="submit" 
          class="auth__button" 
          :disabled="!loginData.username || !loginData.password"
        >
          Iniciar Sesión
        </button>
        
        <div v-if="currentUser" class="auth__success">
          <p class="auth__success-message">Sesión iniciada correctamente</p>
          <router-link to="/" class="auth__link">Ir al panel principal</router-link>
        </div>
      </form>

      <!-- Contenedor secundario -->
      <div class="auth__secondary">
        <div class="auth__image-container">
          <img class="auth__image" src="@/assets/img/imagenLogin.jpg" alt="Imagen de Login" />
          <div class="auth__prompt auth__prompt--signup">
            <h2 class="auth__prompt-title">¿No estás registrado?</h2>
            <p class="auth__prompt-text">Regístrate y conviértete en uno más de nuestra comunidad</p>
          </div>
          <div class="auth__prompt auth__prompt--login">
            <h2 class="auth__prompt-title">¿Ya eres usuario?</h2>
            <p class="auth__prompt-text">Si ya estás registrado, inicia sesión y empieza a disfrutar</p>
          </div>
          <button type="button" class="auth__toggle" @click="toggleSignup">
            <span v-if="!isSignup">Regístrate</span>
            <span v-else>Inicia Sesión</span>
          </button>
        </div>

        <!-- Formulario de Registro -->
        <form class="auth__form auth__form--signup" @submit.prevent="handleRegister">
          <h2 class="auth__title">Únete a la comunidad</h2>
          
          <div v-if="registerErrors.general" class="auth__error auth__error--general">
            {{ registerErrors.general }}
          </div>
          
          <label class="auth__field">
            <span class="auth__label">Nombre de usuario</span>
            <input 
              class="auth__input"
              type="text" 
              v-model="registerData.username" 
              @input="clearRegisterError('username')"
              required 
            />
            <div v-if="registerErrors.username" class="auth__error">
              {{ registerErrors.username }}
            </div>
          </label>
          
          <label class="auth__field">
            <span class="auth__label">Email</span>
            <input 
              class="auth__input"
              type="email" 
              v-model="registerData.email" 
              @input="clearRegisterError('email')"
              required 
            />
            <div v-if="registerErrors.email" class="auth__error">
              {{ registerErrors.email }}
            </div>
          </label>
          
          <label class="auth__field">
            <span class="auth__label">Contraseña</span>
            <input 
              class="auth__input"
              type="password" 
              v-model="registerData.contrasenia" 
              @input="clearRegisterError('contrasenia')"
              required 
            />
            <div v-if="registerErrors.contrasenia" class="auth__error">
              {{ registerErrors.contrasenia }}
            </div>
          </label>
          
          <label class="auth__field">
            <span class="auth__label">Confirmar Contraseña</span>
            <input 
              class="auth__input"
              type="password" 
              v-model="registerData.confirmarContrasenia" 
              @input="clearRegisterError('confirmarContrasenia')"
              required 
            />
            <div v-if="registerErrors.confirmarContrasenia" class="auth__error">
              {{ registerErrors.confirmarContrasenia }}
            </div>
          </label>
          
          <button 
            type="submit" 
            class="auth__button" 
            :disabled="!registerData.username || !registerData.email || !registerData.contrasenia || !registerData.confirmarContrasenia"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

$transition-time: 1.2s;
$primary-color: #f25421;
$success-color: #4bb543;
$input-width-mobile: 100%;
$input-width-desktop: 260px;
$button-height: 36px;
$container-width-desktop: 900px;
$image-width-desktop: 260px;
$form-width-desktop: $container-width-desktop - $image-width-desktop;
$label-color: #767676;

@mixin mobile {
  @media screen and (max-width: 767px) {
    @content;
  }
}

@mixin desktop {
  @media screen and (min-width: 768px) {
    @content;
  }
}

@mixin signup-active {
  .auth__container--signup & {
    @content;
  }
}

.auth {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  background-color: #fff;

  input, button {
    border: none;
    outline: none;
    background: none;
    font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  }
}

.auth__container {
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 100%;
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-shadow: none;
  z-index: 1;
  
  @include desktop {
    width: $container-width-desktop;
    height: 550px;
    min-height: auto;
    flex-direction: row;
    justify-content: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  &--signup {
    .auth__secondary {
      @include desktop {
        transform: translate3d($form-width-desktop * -1, 0, 0);
      }
    }
  }
}

.auth__form {
  position: relative;
  width: 100%;
  padding: 0;
  transition: transform $transition-time ease-in-out;
  z-index: 2;
  
  @include desktop {
    width: $form-width-desktop;
    height: 100%;
    padding: 10px 20px 0 20px;
  }
  
  &--login {
    transition-timing-function: ease-out;
    
    @include signup-active {
      transition-timing-function: ease-in-out;
      transition-duration: $transition-time;
      transform: translate3d(100%, 0, 0);
      
      @include mobile {
        display: none;
      }
      
      @include desktop {
        display: block;
        transform: translate3d($form-width-desktop, 0, 0);
      }
    }
  }
  
  &--signup {
    display: none;
    
    @include signup-active {
      display: block;
      transform: translate3d(0, 0, 0);
    }
    
    @include desktop {
      transform: translate3d($container-width-desktop * -1, 0, 0);
      
      @include signup-active {
        transform: translate3d(0, 0, 0);
      }
    }
  }
}

.auth__title {
  width: 100%;
  font-size: 22px;
  text-align: center;
  margin-bottom: 20px;
  
  @include desktop {
    font-size: 26px;
  }
}

.auth__field {
  display: block;
  width: $input-width-mobile;
  max-width: 300px;
  margin: 25px auto 0;
  text-align: center;
  
  @include desktop {
    width: $input-width-desktop;
  }
}

.auth__label {
  font-size: 12px;
  color: $label-color;
  text-transform: uppercase;
  display: block;
  margin-bottom: 5px;
}

.auth__input {
  display: block;
  width: 100%;
  margin-top: 5px;
  padding-bottom: 0;
  font-size: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.4);
  text-align: center;
}

.auth__button {
  display: block;
  margin: 40px auto 20px;
  width: 100%;
  max-width: 300px;
  height: $button-height;
  border-radius: 30px;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  background: #f25421 !important;
  text-transform: uppercase;
  
  @include desktop {
    width: $input-width-desktop;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.auth__secondary {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  background: #fff;
  transition: transform $transition-time ease-in-out;
  order: -1;
  margin-bottom: 0;
  
  @include desktop {
    position: absolute;
    left: $form-width-desktop;
    top: 0;
    width: $container-width-desktop;
    height: 100%;
    padding-left: $image-width-desktop;
    order: 0;
  }
}

.auth__image-container {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 200px;
  padding-top: 40px;
  
  @include desktop {
    position: absolute;
    left: 0;
    top: 0;
    width: $image-width-desktop;
    height: 100%;
    padding-top: 100px;
  }
  
  &:before {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/img/imagenLogin.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: transform $transition-time ease-in-out;
    
    @include desktop {
      background-size: auto 100%;
      
      @include signup-active {
        transform: translate3d($form-width-desktop, 0, 0);
      }
    }
  }
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/img/imagenLogin.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}

.auth__image {
  display: none;
}

.auth__toggle {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  cursor: pointer;
  text-align: center;
  width: 100px;
  
  @include desktop {
    bottom: 50px;
  }
  
  span {
    display: block;
    color: white;
    font-size: 16px;
    text-transform: uppercase;
    transition: transform $transition-time ease-in-out;
  }
}

.auth__prompt {
  z-index: 2;
  position: absolute;
  left: 0;
  top: 50px;
  width: 100%;
  padding: 0 20px;
  text-align: center;
  color: #fff;
  transition: transform $transition-time ease-in-out;
  
  @include mobile {
    display: none;
    
    .auth__container--signup & {
      &--login {
        display: block;
      }
    }
    
    .auth__container:not(.auth__container--signup) & {
      &--signup {
        display: block;
      }
    }
  }
  
  &--signup {
    @include signup-active {
      @include desktop {
        transform: translateX($image-width-desktop * 2);
      }
    }
  }
  
  &--login {
    @include desktop {
      transform: translateX($image-width-desktop * -2);
    }
    
    @include signup-active {
      transform: translateX(0);
    }
  }
}

.auth__prompt-title {
  margin-bottom: 10px;
  font-weight: normal;
  font-size: 20px;
  
  @include desktop {
    font-size: 22px;
  }
}

.auth__prompt-text {
  font-size: 14px;
  line-height: 1.5;
}

.auth__error {
  font-size: 12px;
  color: $primary-color;
  margin-top: 5px;
  text-align: center;
  
  &--general {
    margin: 15px auto;
    width: 100%;
    max-width: 300px;
    padding: 8px;
    background-color: rgba($primary-color, 0.1);
    border-radius: 4px;
    
    @include desktop {
      width: $input-width-desktop;
    }
  }
}

.auth__success {
  margin: 15px auto;
  width: 100%;
  max-width: 300px;
  padding: 8px;
  background-color: rgba($success-color, 0.1);
  border-radius: 4px;
  text-align: center;
  color: $success-color;
  
  @include desktop {
    width: $input-width-desktop;
  }
}

.auth__success-message {
  margin-bottom: 10px;
}

.auth__link {
  display: block;
  margin-top: 10px;
  color: $primary-color;
  text-decoration: none;
  font-weight: bold;
  
  &:hover {
    text-decoration: underline;
  }
}
</style>