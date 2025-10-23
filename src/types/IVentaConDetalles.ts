import type { IDetalleVenta } from "./IDetalleVenta";
import type { IUsuario } from "./IUsuario";
import type { Estado } from "./IVenta";

export interface IVentaConDetalles {
    id: string;
    recibo: number;
    fecha: string;
    estado: Estado;
    total: number;
    vendedor: IUsuario;
    detalles: IDetalleVenta[];
}