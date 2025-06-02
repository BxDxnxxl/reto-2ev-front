export interface IdeaDto {
  id: number;
  fkIdUsuario: number;
  titulo: string;
  descripcion: string;
  plazasDisponibles: number;
  fkIdRedSocial: number;
  fkIdTipoIdea: number;
  contacto: string;
  instrucciones: string;
  fechaPublicacion: Date;
  fechaCaducidad: Date | null;
}