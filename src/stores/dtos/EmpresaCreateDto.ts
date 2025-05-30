export interface EmpresaCreateDto {
    nombre: string;
    descripcion?: string;
    sede?: string;
    web?: string;
    logo: File;
    acuerdo: number;
    limiteDestacadasMensual?: number;
  }