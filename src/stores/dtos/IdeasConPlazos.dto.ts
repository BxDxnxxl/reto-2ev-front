export interface IdeaConPlazasDto {
    id: number;
    fkIdUsuario: number;
    titulo: string;
    descripcion: string;
    plazasDisponibles: number;
    plazasLibres: number;
    fkIdRedSocial: number;
    contacto: string;
    fechaPublicacion: Date;
  }
  