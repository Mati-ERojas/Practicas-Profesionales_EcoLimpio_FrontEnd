import type { IProducto } from "./IProducto";
import type { IVenta } from "./IVenta";

export interface IDetalleVenta {
    id?: string;
    habilitado?: boolean;
    venta: IVenta;
    producto: IProducto;
    cantidad: number;
    subtotal: number;
}