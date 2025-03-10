<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useUsersStore } from "@/stores/users";
import type { UserDto } from "@/stores/dtos/user.dto";
import PerfilAnimado from './PerfilAnimado.vue';

const usersStore = useUsersStore();
console.log(usersStore.currentUser)
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

const valid = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");
const editProfileForm = ref<any>(null);
const showPassword = ref(false);
const isUpdating = ref(false);

// Reglas de validación para la contraseña
const passwordRules = [
  (v: string) => !v || v.length >= 8 || "Password must be at least 8 characters",
  (v: string) => !v || /[A-Z]/.test(v) || "Password must contain an uppercase letter",
  (v: string) => !v || /[a-z]/.test(v) || "Password must contain a lowercase letter",
  (v: string) => !v || /[0-9]/.test(v) || "Password must contain a number"
];

// Cargar datos del usuario al montar el componente
onMounted(() => {
  if (usersStore.currentUser) {
    editedUser.value = { 
      ...usersStore.currentUser, 
      contrasenia: "" 
    };
  }
});

// Manejar subida de imagen de perfil
const handleProfilePicUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      editedUser.value.profilePic = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const updateProfile = async () => {
  if (!editProfileForm.value) return;

  const { valid } = await editProfileForm.value.validate();
  if (!valid) return;

  try {
    if (usersStore.currentUser?.id) {
      const userToUpdate: UserDto = {
        ...editedUser.value,
        contrasenia: editedUser.value.contrasenia && editedUser.value.contrasenia.trim() !== "" 
          ? editedUser.value.contrasenia 
          : usersStore.currentUser.contrasenia
      };

      const updatedUser = await usersStore.updateCurrentUser(userToUpdate);

      if (updatedUser) {
        snackbarMessage.value = "Profile updated successfully!";
        snackbarColor.value = "success";
        snackbar.value = true;

        editedUser.value.contrasenia = "";
      } else {
        throw new Error("Failed to update profile");
      }
    }
  } catch (error) {
  }
};
</script>

<template>
  <v-container fluid class="profile-edit-container px-0">
    <v-row justify="center" align="center" class="ma-0 h-100">
      <v-col cols="12" md="12" lg="10" xl="8">
        <v-card class="elevation-6 profile-card">
          <div class="d-flex justify-center mb-4">
            <PerfilAnimado />
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

<style scoped>
.profile-edit-container {
  background: none;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.profile-card {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .profile-card {
    margin: 0;
    border-radius: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>