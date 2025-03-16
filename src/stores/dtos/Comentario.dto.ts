export interface ComentarioDto {
    id: number;
    fkIdUsuario: number;
    fkIdVideojuego: number;
    titulo: string;
    texto: string;
    fecha: Date;
    valoracion: number;
    likes: number;
    dislikes: number;
  }
  