export interface PublicacionEmpresaDto {
  id: number;
  FkIdEmpresa: number;
  FkIdUsuario: number;
  titulo: string;
  contenido?: string;
  imagen?: string;
  fechaPublicacion: Date;
  esDestacada: boolean;
}
