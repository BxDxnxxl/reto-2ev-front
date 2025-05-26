export interface NovedadesDto {
    id: number;
    titulo: string;
    contenido?: string;
    fechaPublicacion: Date;
    esDestacada: boolean;
    imagen: string;
    nombreEmpresa: string;
    logoEmpresa: string;
    emailAutor: string;
    acuerdoEmpresa: number;
    idUsuario: number;
  }
  
