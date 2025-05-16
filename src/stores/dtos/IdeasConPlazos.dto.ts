export interface IdeaConPlazasDto {
  id: number;
  fkIdUsuario: number;
  titulo: string;
  descripcion: string;
  plazasDisponibles: number;
  plazasLibres: number;
  plazasTotales: number;
  fkIdRedSocial: number;
  redSocialNombre: string;
  contacto: string;
  instrucciones: string;
  fechaPublicacion: Date;
}
