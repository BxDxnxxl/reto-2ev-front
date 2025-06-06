export interface GameCreateDto {
    titulo: string;
    descripcion?: string;
    anioSalida: string;
    pegi?: number;
    caratula: File;
    fkIdCompania: number;
  }
  