import type { RolesDto } from "@/stores/dtos/Roles.dto";

export interface RolAsignacionDto {
    usuarioId: number;
    rolesIds: Number[];
}