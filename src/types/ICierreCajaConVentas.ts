import type { IVentaConDetalles } from "./IVentaConDetalles";

export interface ICierreCajaConVentas {
    id?: string;
    habilitado?: boolean;
    codigoCierre: string;
    fechaHora: string;
    total: number;
    ventas: IVentaConDetalles[]
}