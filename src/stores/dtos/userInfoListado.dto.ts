import type { RolesDto } from "@/stores/dtos/Roles.dto";
import type { UserDto } from "./user.dto";

export interface UserInfoDto extends UserDto {
  roles: RolesDto[];
}
