export interface UserUpdateDto {
  username: string;
  email: string;
  contraseña: string;
  nombre?: string;
  apellido1?: string;
  apellido2?: string;
  profilePic: File | null;
}
