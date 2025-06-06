<script setup lang="ts">
import { ref, computed } from "vue";
import { useUsersStore } from "@/stores/users";
import { useRouter } from "vue-router";
import type { UserLoginDto } from "@/stores/dtos/userLogin.dto";
import type { UserDto } from "@/stores/dtos/user.dto";

const router = useRouter();
const usersStore = useUsersStore();

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
</script>

<template>
  <div class="auth">
    <div class="auth__background">
      <div class="auth__background-circle auth__background-circle--1"></div>
      <div class="auth__background-circle auth__background-circle--2"></div>
      <div class="auth__background-circle auth__background-circle--3"></div>
    </div>

    <div class="auth__card" :class="{ 'auth__card--register': isSignup }">
      <header class="auth__header">
        <div class="auth__brand">
          <div class="auth__brand-icon">
            <span>🔥</span>
          </div>
          <h1 class="auth__brand-title">Wannagames</h1>
        </div>
      </header>

      <div class="auth__forms">
        <div class="auth__form" :class="{ 'auth__form--hidden': isSignup }">
          <div class="auth__form-header">
            <h2 class="auth__form-title">Bienvenido de vuelta</h2>
            <p class="auth__form-subtitle">Inicia sesión en tu cuenta</p>
          </div>

          <form @submit.prevent="handleLogin" class="form">
            <div v-if="loginErrors.general" class="alert alert--error">
              {{ loginErrors.general }}
            </div>

            <div class="form__group">
              <label class="form__label" for="login-username">Usuario</label>
              <input 
                id="login-username"
                type="text" 
                class="form__input"
                :class="{ 'form__input--error': loginErrors.username }"
                v-model="loginData.username" 
                @input="clearLoginError('username')"
                placeholder="Ingresa tu usuario"
                required 
              />
              <div v-if="loginErrors.username" class="form__error">
                {{ loginErrors.username }}
              </div>
            </div>

            <div class="form__group">
              <label class="form__label" for="login-password">Contraseña</label>
              <input 
                id="login-password"
                type="password" 
                class="form__input"
                :class="{ 'form__input--error': loginErrors.password }"
                v-model="loginData.password" 
                @input="clearLoginError('password')"
                placeholder="Ingresa tu contraseña"
                required 
              />
              <div v-if="loginErrors.password" class="form__error">
                {{ loginErrors.password }}
              </div>
            </div>

            <button 
              type="submit" 
              class="button button--primary button--full"
              :disabled="!loginData.username || !loginData.password"
            >
              <span>Iniciar Sesión</span>
            </button>
          </form>

          <div class="auth__switch">
            <p class="auth__switch-text">¿No tienes cuenta?</p>
            <button type="button" class="auth__switch-button" @click="toggleSignup">
              Regístrate aquí
            </button>
          </div>
        </div>

        <div class="auth__form" :class="{ 'auth__form--hidden': !isSignup }">
          <div class="auth__form-header">
            <h2 class="auth__form-title">Crea tu cuenta</h2>
            <p class="auth__form-subtitle">Únete a nuestra comunidad</p>
          </div>

          <form @submit.prevent="handleRegister" class="form">
            <div v-if="registerErrors.general" class="alert alert--error">
              {{ registerErrors.general }}
            </div>

            <div class="form__group">
              <label class="form__label" for="register-username">Usuario</label>
              <input 
                id="register-username"
                type="text" 
                class="form__input"
                :class="{ 'form__input--error': registerErrors.username }"
                v-model="registerData.username" 
                @input="clearRegisterError('username')"
                placeholder="Elige un nombre de usuario"
                required 
              />
              <div v-if="registerErrors.username" class="form__error">
                {{ registerErrors.username }}
              </div>
            </div>

            <div class="form__group">
              <label class="form__label" for="register-email">Email</label>
              <input 
                id="register-email"
                type="email" 
                class="form__input"
                :class="{ 'form__input--error': registerErrors.email }"
                v-model="registerData.email" 
                @input="clearRegisterError('email')"
                placeholder="tu@email.com"
                required 
              />
              <div v-if="registerErrors.email" class="form__error">
                {{ registerErrors.email }}
              </div>
            </div>

            <div class="form__group">
              <label class="form__label" for="register-password">Contraseña</label>
              <input 
                id="register-password"
                type="password" 
                class="form__input"
                :class="{ 'form__input--error': registerErrors.contrasenia }"
                v-model="registerData.contrasenia" 
                @input="clearRegisterError('contrasenia')"
                placeholder="Crea una contraseña segura"
                required 
              />
              <div v-if="registerErrors.contrasenia" class="form__error">
                {{ registerErrors.contrasenia }}
              </div>
            </div>

            <div class="form__group">
              <label class="form__label" for="register-confirm">Confirmar Contraseña</label>
              <input 
                id="register-confirm"
                type="password" 
                class="form__input"
                :class="{ 'form__input--error': registerErrors.confirmarContrasenia }"
                v-model="registerData.confirmarContrasenia" 
                @input="clearRegisterError('confirmarContrasenia')"
                placeholder="Repite tu contraseña"
                required 
              />
              <div v-if="registerErrors.confirmarContrasenia" class="form__error">
                {{ registerErrors.confirmarContrasenia }}
              </div>
            </div>

            <button 
              type="submit" 
              class="button button--primary button--full"
              :disabled="!registerData.username || !registerData.email || !registerData.contrasenia || !registerData.confirmarContrasenia"
            >
              <span>Crear Cuenta</span>
            </button>
          </form>

          <div class="auth__switch">
            <p class="auth__switch-text">¿Ya tienes cuenta?</p>
            <button type="button" class="auth__switch-button" @click="toggleSignup">
              Inicia sesión
            </button>
          </div>
        </div>
      </div>

      <div v-if="currentUser" class="auth__success">
        <div class="alert alert--success">
          <h3 class="alert__title">¡Bienvenido!</h3>
          <p class="alert__message">Sesión iniciada correctamente</p>
          <router-link to="/" class="button button--outline button--small">
            Ir al panel principal
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";


$auth-mobile-padding: 1rem;
$auth-tablet-padding: 1.5rem;
$auth-desktop-padding: 2rem;
$auth-card-width-mobile: 100%;
$auth-card-width-tablet: 28rem;
$auth-card-width-desktop: 30rem;

@mixin respond-to($breakpoint) {
  @if $breakpoint == tablet {
    @media (min-width: 768px) { @content; }
  }
  @if $breakpoint == desktop {
    @media (min-width: 1024px) { @content; }
  }
}

.auth {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $auth-mobile-padding;
  background: $background-color;
  position: relative;
  overflow: hidden;

  @include respond-to(tablet) {
    padding: $auth-tablet-padding;
  }

  @include respond-to(desktop) {
    padding: $auth-desktop-padding;
  }

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }


  &__background-circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba($primary-color, 0.1), rgba($primary-color, 0.05));
    backdrop-filter: blur(10px);
    

    &--1 {
      width: 150px;
      height: 150px;
      top: -75px;
      right: -75px;
      animation: float 6s ease-in-out infinite;

      @include respond-to(tablet) {
        width: 250px;
        height: 250px;
        top: -125px;
        right: -125px;
      }

      @include respond-to(desktop) {
        width: 300px;
        height: 300px;
        top: -150px;
        right: -150px;
      }
    }
    

    &--2 {
      width: 100px;
      height: 100px;
      bottom: -50px;
      left: -50px;
      animation: float 8s ease-in-out infinite reverse;

      @include respond-to(tablet) {
        width: 150px;
        height: 150px;
        bottom: -75px;
        left: -75px;
      }

      @include respond-to(desktop) {
        width: 200px;
        height: 200px;
        bottom: -100px;
        left: -100px;
      }
    }

    &--3 {
      width: 80px;
      height: 80px;
      top: 50%;
      left: -40px;
      animation: float 7s ease-in-out infinite;

      @include respond-to(tablet) {
        width: 120px;
        height: 120px;
        left: -60px;
      }

      @include respond-to(desktop) {
        width: 150px;
        height: 150px;
        left: -75px;
      }
    }
  }


  &__card {
    background: $card-background;
    border-radius: $border-radius * 2;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    width: $auth-card-width-mobile;
    max-width: $auth-card-width-tablet;
    position: relative;
    z-index: 1;
    overflow: hidden;
    backdrop-filter: blur(10px);
    border: 1px solid rgba($text-color, 0.1);

    @include respond-to(tablet) {
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
      max-width: $auth-card-width-desktop;
    }

    @include respond-to(desktop) {
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
  }


  &__header {
    padding: 1.5rem 1rem 1rem;
    text-align: center;
    background: linear-gradient(135deg, rgba($primary-color, 0.1), rgba($primary-color, 0.05));

    @include respond-to(tablet) {
      padding: 2rem 1.5rem 1.5rem;
    }

    @include respond-to(desktop) {
      padding: 2.5rem 2rem 2rem;
    }
  }

  
  &__brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;

    @include respond-to(tablet) {
      gap: 1rem;
    }
  }


  &__brand-icon {
    width: 40px;
    height: 40px;
    background: $primary-gradient;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 6px 12px rgba($primary-color, 0.3);

    @include respond-to(tablet) {
      width: 45px;
      height: 45px;
      font-size: 22px;
    }

    @include respond-to(desktop) {
      width: 50px;
      height: 50px;
      font-size: 24px;
      box-shadow: 0 8px 16px rgba($primary-color, 0.3);
    }
  }


  &__brand-title {
    font-family: $font-family-title;
    font-size: 1.5rem;
    font-weight: 700;
    background: $primary-gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;

    @include respond-to(tablet) {
      font-size: 1.625rem;
    }

    @include respond-to(desktop) {
      font-size: 1.75rem;
    }
  }


  &__forms {
    position: relative;
  }


  &__form {
    padding: 1.5rem 1rem;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

    @include respond-to(tablet) {
      padding: 2rem 1.5rem;
    }

    @include respond-to(desktop) {
      padding: 2.5rem 2rem;
    }
    

    &--hidden {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      opacity: 0;
      transform: translateX(100%);
      pointer-events: none;
    }
  }


  &__form-header {
    text-align: center;
    margin-bottom: 1.5rem;

    @include respond-to(tablet) {
      margin-bottom: 2rem;
    }
  }


  &__form-title {
    font-family: $font-family-title;
    font-size: 1.375rem;
    font-weight: 600;
    color: $text-color;
    margin: 0 0 0.5rem;

    @include respond-to(tablet) {
      font-size: 1.5rem;
    }

    @include respond-to(desktop) {
      font-size: $font-size-xlarge;
    }
  }

  &__form-subtitle {
    color: rgba($text-color, 0.7);
    font-size: 0.875rem;
    margin: 0;

    @include respond-to(tablet) {
      font-size: $font-size-base;
    }
  }


  &__switch {
    text-align: center;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba($text-color, 0.1);

    @include respond-to(tablet) {
      margin-top: 2rem;
      padding-top: 1.5rem;
    }
  }


  &__switch-text {
    color: rgba($text-color, 0.7);
    margin: 0 0 0.5rem;
    font-size: 0.8125rem;

    @include respond-to(tablet) {
      font-size: $font-size-small;
    }
  }


  &__switch-button {
    background: none;
    border: none;
    color: $primary-color;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;
    font-size: 0.8125rem;

    @include respond-to(tablet) {
      font-size: $font-size-small;
    }
    
    &:hover {
      color: lighten($primary-color, 10%);
      transform: translateY(-1px);
    }
  }


  &__success {
    padding: 1.5rem 1rem;

    @include respond-to(tablet) {
      padding: 2rem 1.5rem;
    }

    @include respond-to(desktop) {
      padding: 2rem;
    }
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @include respond-to(tablet) {
    gap: 1.25rem;
  }

  @include respond-to(desktop) {
    gap: 1.5rem;
  }


  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }


  &__label {
    font-size: 0.75rem;
    font-weight: 600;
    color: $text-color;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @include respond-to(tablet) {
      font-size: $font-size-small;
    }
  }


  &__input {
    padding: 0.875rem;
    background: rgba($text-color, 0.05);
    border: 2px solid rgba($text-color, 0.1);
    border-radius: $border-radius;
    color: $text-color;
    font-size: 0.875rem;
    transition: $transition;

    @include respond-to(tablet) {
      padding: 1rem;
      font-size: $font-size-base;
    }
    
    &:focus {
      outline: none;
      border-color: $primary-color;
      background: rgba($primary-color, 0.05);
      box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
    }
    
    &::placeholder {
      color: rgba($text-color, 0.5);
    }
    

    &--error {
      border-color: $color-error;
      background: rgba($color-error, 0.05);
    }
  }


  &__error {
    font-size: 0.75rem;
    color: $color-error;
    font-weight: 500;
  }
}

.button {
  padding: 0.875rem 1rem;
  border: none;
  border-radius: $border-radius;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @include respond-to(tablet) {
    padding: 1rem 1.5rem;
    font-size: $font-size-base;
  }
  
 
  &--primary {
    background: $primary-gradient;
    color: $text-color;
    box-shadow: 0 3px 12px rgba($primary-color, 0.3);

    @include respond-to(desktop) {
      box-shadow: 0 4px 15px rgba($primary-color, 0.3);
    }
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($primary-color, 0.4);

      @include respond-to(desktop) {
        box-shadow: 0 8px 25px rgba($primary-color, 0.4);
      }
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }
  
  
  &--outline {
    background: transparent;
    color: $primary-color;
    border: 2px solid $primary-color;
    
    &:hover {
      background: $primary-color;
      color: $text-color;
    }
  }
  

  &--full {
    width: 100%;
  }
  

  &--small {
    padding: 0.5rem 0.875rem;
    font-size: 0.75rem;

    @include respond-to(tablet) {
      padding: 0.625rem 1rem;
      font-size: $font-size-small;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
}

.alert {
  padding: 0.875rem;
  border-radius: $border-radius;
  margin-bottom: 1rem;

  @include respond-to(tablet) {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  

  &--error {
    background: rgba($color-error, 0.1);
    border: 1px solid rgba($color-error, 0.3);
    color: $color-error;
  }
  

  &--success {
    background: rgba($color-success, 0.1);
    border: 1px solid rgba($color-success, 0.3);
    color: $color-success;
    text-align: center;
  }
  

  &__title {
    margin: 0 0 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;

    @include respond-to(tablet) {
      font-size: $font-size-large;
    }
  }
  

  &__message {
    margin: 0 0 0.875rem;

    @include respond-to(tablet) {
      margin: 0 0 1rem;
    }
  }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-20px) rotate(180deg); 
  }
}
</style>