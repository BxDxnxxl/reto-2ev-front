import type { RolesDto } from "@/stores/dtos/Roles.dto";

export interface UserInfoDto {
  id: number;
  username: string;
  email: string;
  contrasenia?: string;
  nombre?: string;
  apellido1?: string;
  apellido2?: string;
  profilePic?: string;
  roles: RolesDto[];
}
