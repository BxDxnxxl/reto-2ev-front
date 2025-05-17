export interface PublicacionEmpresaDto {
  id: number;
  idEmpresa: number;
  titulo: string;
  contenido?: string;
  imagen?: string;
  fechaPublicacion: Date;
  esDestacada: boolean;
}
