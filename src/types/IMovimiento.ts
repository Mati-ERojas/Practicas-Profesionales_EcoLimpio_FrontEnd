import type { IProducto } from "./IProducto";
import type { IUsuario } from "./IUsuario";

export type TipoMovimiento = "VENTA" | "AJUSTE" | "DECOMISO" | "ROBO" | "ROTURA" | "VENCIMIENTO" | "CIERRECAJA"
export interface IMovimiento {
    id?: string;
    habilitado?: boolean;
    fecha: string;
    tipo: TipoMovimiento;
    cantidad?: number;
    total?: number;
    usuario: IUsuario;
    producto?: IProducto;
}