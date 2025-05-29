export interface EmpresasAfiliadosDTO {
  id: number;
  nombre: string;
  descripcion: string | null;
  sede: string | null;
  web: string | null;
  logo: string | null;
  fechaAlta: Date;
  activa: boolean;
  acuerdo: number;
  limiteDestacadasMensual: number | null;
  numeroAfiliados: number;
}
