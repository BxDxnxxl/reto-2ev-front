<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUsersStore } from "@/stores/users";
import type { UserDto } from "@/stores/dtos/user.dto";
import type { UserLoginDto } from "@/stores/dtos/userLogin.dto";
import PerfilAnimado from './PerfilAnimado.vue';
import type { UserUpdateDto } from "@/stores/dtos/UserUpdateDto";

const usersStore = useUsersStore();

// Estado del formulario
const editedUser = ref<UserDto>({
  username: "",
  email: "",
  contrasenia: "",
  nombre: "",
  apellido1: "",
  apellido2: "",
  profilePic: ""
});

const profilePicFile = ref<File | null>(null);
const valid = ref(false);
const isUpdating = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");
const editProfileForm = ref<any>(null);
const showPassword = ref(false);

// Reglas de validación
const passwordRules = [
  (v: string) => !v || v.length >= 8 || "Password must be at least 8 characters",
  (v: string) => !v || /[A-Z]/.test(v) || "Password must contain an uppercase letter",
  (v: string) => !v || /[a-z]/.test(v) || "Password must contain a lowercase letter",
  (v: string) => !v || /[0-9]/.test(v) || "Password must contain a number"
];

onMounted(() => {
  if (usersStore.currentUser) {
    editedUser.value = {
      ...usersStore.currentUser,
      contrasenia: ""
    };
  }
});

// Manejar subida de imagen
const handleProfilePicUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    profilePicFile.value = input.files[0];
  }
};
function getImageSrc(pic: string | File | null | undefined): string {
  if (!pic) return 'https://via.placeholder.com/100';

  if (typeof pic === 'string') return pic;
  if (pic instanceof File) return URL.createObjectURL(pic);

  return 'https://via.placeholder.com/100';
}
const updateProfile = async () => {
  if (!editProfileForm.value) return;

  const { valid: formValido } = await editProfileForm.value.validate();
  if (!formValido) return;

  isUpdating.value = true;

  try {
    const usuario = usersStore.currentUser;
    if (!usuario || !usuario.id) throw new Error("Usuario no autenticado.");

    const finalPassword = editedUser.value.contrasenia?.trim() || usuario.contrasenia || "";

    const userUpdateDto: UserUpdateDto = {
      username: editedUser.value.username,
      email: editedUser.value.email,
      contraseña: finalPassword,
      nombre: editedUser.value.nombre ?? "",
      apellido1: editedUser.value.apellido1 ?? "",
      apellido2: editedUser.value.apellido2 ?? "",
      profilePic: profilePicFile.value as File || undefined
    };

    const loginSuccess = await usersStore.updateCurrentUser(userUpdateDto);

    if (!loginSuccess) throw new Error("Error al reloguear.");

    snackbarMessage.value = "Perfil actualizado correctamente";
    snackbarColor.value = "success";
    snackbar.value = true;
    editedUser.value.contrasenia = "";

  } catch (error) {
    console.error("Error actualizando usuario:", error);
    snackbarMessage.value = "Error al actualizar perfil";
    snackbarColor.value = "error";
    snackbar.value = true;
  } finally {
    isUpdating.value = false;
  }
};
</script>

<template>
  <v-container fluid class="profile-edit-container px-0">
    <v-row justify="center" align="center" class="ma-0 h-100">
      <v-col cols="12" md="12" lg="10" xl="8">
        <v-card class="elevation-6 profile-card">
          <div class="d-flex justify-center mb-4">
            <v-avatar size="100">
              <img
                :src="getImageSrc(usersStore.currentUser?.profilePic)"
                alt="Foto de perfil"
              />
            </v-avatar>
          </div>

          
          <v-card-title class="text-h5 text-center pb-4">
            Edit Profile
          </v-card-title>

          <v-card-text>
            <v-form ref="editProfileForm" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedUser.nombre"
                    label="First Name"
                    prepend-icon="mdi-account"
                    :rules="[v => !!v || 'First name is required']"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedUser.apellido1"
                    label="First Last Name"
                    prepend-icon="mdi-account-multiple"
                    :rules="[v => !!v || 'First last name is required']"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedUser.apellido2"
                    label="Second Last Name"
                    prepend-icon="mdi-account-multiple"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedUser.username"
                    label="Username"
                    prepend-icon="mdi-account-badge"
                    :rules="[v => !!v || 'Username is required']"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="editedUser.email"
                    label="Email"
                    prepend-icon="mdi-email"
                    :rules="[ 
                      v => !!v || 'Email is required',
                      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
                    ]"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="editedUser.contrasenia"
                    label="New Password"
                    prepend-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    :rules="passwordRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-file-input
                    label="Profile Picture"
                    prepend-icon="mdi-camera"
                    accept="image/*"
                    @change="handleProfilePicUpload"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              @click="updateProfile"
              :disabled="!valid"
              :loading="isUpdating"
            >
              Update Profile
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>
<style scoped lang="scss">
@import "@/assets/styles/variables.scss";

.profile-edit-container {
  background-color: $card-background;
  color: $text-color;
  min-height: 100vh;
  padding: $spacing-large;

  display: flex;
  justify-content: center;
  align-items: center;

  .profile-card {
    background-color: $dark-color; // fondo claro para contraste con la vista oscura
    color: $dark-color;
    padding: $spacing-large;
    border-radius: calc($border-radius * 4); // borde más redondeado
    box-shadow: $box-shadow;
    width: 100%;
    max-width: 800px;

    border: 3px;
    border-color: $primary-gradient;

    .v-card-title {
      font-size: $font-size-xlarge;
      font-weight: bold;
      color: $dark-color;
      text-align: center;
    }

    .v-text-field,
    .v-file-input {
      .v-input__control {
        background-color: white !important;
        color: $dark-color !important;
        border-radius: calc($border-radius * 1.2);
        border: 1px solid $color-disabled;

        input {
          color: $dark-color !important;
          font-size: $font-size-base;
        }
      }

      .v-label {
        color: $dark-color !important;
        font-weight: 500;
        font-size: $font-size-base;
      }
    }

    .v-btn {
      background-color: $btn-color !important;
      color: white !important;
      font-weight: bold;
      border-radius: $border-radius;
      padding: $spacing-small $spacing-large;
      font-size: $font-size-base;
      transition: $transition;

      &:hover {
        background-color: darken($btn-color, 10%) !important;
      }
    }

    .v-avatar img {
      border: 2px solid $accent-color;
    }
  }

  .v-snackbar {
    font-size: $font-size-base;
    font-weight: 500;
  }
}
</style>
