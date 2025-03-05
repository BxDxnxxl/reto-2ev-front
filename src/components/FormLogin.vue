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
  } else if (loginData.value.password.length < 6) {
    loginErrors.value.password = "La contraseña debe tener al menos 6 caracteres";
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
  } else if (registerData.value.contrasenia.length < 6) {
    registerErrors.value.contrasenia = "La contraseña debe tener al menos 6 caracteres";
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
  <div class="form-container" :class="{ 'is-signup': isSignup }">

    <form class="form login-form" @submit.prevent="handleLogin">
      <h2>Bienvenido</h2>
      
      <div v-if="loginErrors.general" class="error-message general-error">
        {{ loginErrors.general }}
      </div>
      
      <label>
        <span>Usuario</span>
        <input 
          type="text" 
          v-model="loginData.username" 
          @input="clearLoginError('username')"
          required 
        />
        <div v-if="loginErrors.username" class="error-message">
          {{ loginErrors.username }}
        </div>
      </label>
      
      <label>
        <span>Contraseña</span>
        <input 
          type="password" 
          v-model="loginData.password" 
          @input="clearLoginError('password')"
          required 
        />
        <div v-if="loginErrors.password" class="error-message">
          {{ loginErrors.password }}
        </div>
      </label>
      
      <button type="submit" class="submit-btn" :disabled="!loginData.username || !loginData.password">
        Iniciar Sesión
      </button>
      
      <div v-if="currentUser" class="success-message">
        <p>Sesión iniciada correctamente</p>
        <router-link to="/" class="dashboard-link">Ir al panel principal</router-link>
      </div>
    </form>

    <div class="sub-container">
      <div class="image-container">
        <img src="@/assets/img/imagenLogin.jpg" alt="Imagen de Login" />
        <div class="image-text show-up">
          <h2>¿No estás registrado?</h2>
          <p>Regístrate y conviértete en uno más de nuestra comunidad</p>
        </div>
        <div class="image-text show-in">
          <h2>¿Ya eres usuario?</h2>
          <p>Si ya estás registrado, inicia sesión y empieza a disfrutar</p>
        </div>
        <button type="button" class="toggle-btn" @click="toggleSignup">
          <span v-if="!isSignup">Regístrate</span>
          <span v-else>Inicia Sesión</span>
        </button>
      </div>

      <form class="form signup-form" @submit.prevent="handleRegister">
        <h2>Únete a la comunidad</h2>
        
        <div v-if="registerErrors.general" class="error-message general-error">
          {{ registerErrors.general }}
        </div>
        
        <label>
          <span>Nombre de usuario</span>
          <input 
            type="text" 
            v-model="registerData.username" 
            @input="clearRegisterError('username')"
            required 
          />
          <div v-if="registerErrors.username" class="error-message">
            {{ registerErrors.username }}
          </div>
        </label>
        
        <label>
          <span>Email</span>
          <input 
            type="email" 
            v-model="registerData.email" 
            @input="clearRegisterError('email')"
            required 
          />
          <div v-if="registerErrors.email" class="error-message">
            {{ registerErrors.email }}
          </div>
        </label>
        
        <label>
          <span>Contraseña</span>
          <input 
            type="password" 
            v-model="registerData.contrasenia" 
            @input="clearRegisterError('contrasenia')"
            required 
          />
          <div v-if="registerErrors.contrasenia" class="error-message">
            {{ registerErrors.contrasenia }}
          </div>
        </label>
        
        <label>
          <span>Confirmar Contraseña</span>
          <input 
            type="password" 
            v-model="registerData.confirmarContrasenia" 
            @input="clearRegisterError('confirmarContrasenia')"
            required 
          />
          <div v-if="registerErrors.confirmarContrasenia" class="error-message">
            {{ registerErrors.confirmarContrasenia }}
          </div>
        </label>
        
        <button 
          type="submit" 
          class="submit-btn" 
          :disabled="!registerData.username || !registerData.email || !registerData.contrasenia || !registerData.confirmarContrasenia"
        >
          Registrarse
        </button>
      </form>
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
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
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
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.form {
  position: relative;
  width: $form-width;
  height: 100%;
  transition: transform $transition-time ease-in-out;
  padding: 50px 30px 0;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.image-container {
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  width: $image-width;
  height: 100%;
  padding-top: 100px;

  &:before {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/img/imagenLogin.jpg');
    background-size: auto 100%;
    background-position: center;
    background-repeat: no-repeat;
    transition: transform $transition-time ease-in-out;
  }

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
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
        transform: translateX($image-width * 2);
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

.error-message {
  font-size: 12px;
  color: #f25421;
  margin-top: 5px;
  text-align: center;
}

.general-error {
  margin: 15px auto;
  width: $input-width;
  padding: 8px;
  background-color: rgba(242, 84, 33, 0.1);
  border-radius: 4px;
}

.success-message {
  margin: 15px auto;
  width: $input-width;
  padding: 8px;
  background-color: rgba(75, 181, 67, 0.1);
  border-radius: 4px;
  text-align: center;
  color: #4bb543;
}

.dashboard-link {
  display: block;
  margin-top: 10px;
  color: #f25421;
  text-decoration: none;
  font-weight: bold;
  
  &:hover {
    text-decoration: underline;
  }
}
</style>