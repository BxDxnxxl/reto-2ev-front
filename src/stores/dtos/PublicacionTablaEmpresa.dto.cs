export interface PublicacionTablaEmpresaDto {
  id: number;
  titulo: string;
  contenido?: string;
  fechaPublicacion: Date;
  esDestacada: boolean;
}
