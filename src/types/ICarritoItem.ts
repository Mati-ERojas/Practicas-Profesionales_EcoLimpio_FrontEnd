import type { IProducto } from "./IProducto";

export interface ICarritoItem {
    id: string;
    producto: IProducto;
    cantidad: number;
    subtotal: number;
}