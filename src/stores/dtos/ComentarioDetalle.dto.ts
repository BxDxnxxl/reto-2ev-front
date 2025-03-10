import type { ComentarioDto } from "@/stores/dtos/Comentario.dto";
export interface ComentarioDetalleDto extends ComentarioDto {
  usuarioNombre: string;
}