export interface PublicacionEmpresaCreateDto {
    titulo: string;
    contenido: string;
    imagen: File | null;
    fkIdEmpresa: number;
    fkIdUsuario: number;
    esDestacada: boolean;
  }
  