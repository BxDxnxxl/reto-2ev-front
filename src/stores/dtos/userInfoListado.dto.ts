import type { RolesDto } from "@/stores/dtos/Roles.dto";

export interface UserInfoDto {
  id: number;
  username: string;
  Email: string;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  roles: RolesDto[];
  }