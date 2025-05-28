export interface EmpresaDto {
  id: number;
  nombre: string;
  descripcion?: string;
  sede?: string;
  web?: string;
  logo?: string;
  fechaAlta: Date;
  activa: boolean;
  acuerdo: number;
  limiteDestacadasMensual?: number;
}
