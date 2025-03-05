import type { GeneroDto } from "@/stores/dtos/Genero.dto";
import type { PlataformaDto } from "@/stores/dtos/Plataforma.dto";

export interface VideojuegoDetalleDto {
    titulo: string;
    descripcion: string;
    anioSalida: Date;
    pegi?: number;
    caratula?: string;
    compania: string;
    generos: GeneroDto[];
    plataformas: PlataformaDto[];
    valoracionPromedio: number;
}