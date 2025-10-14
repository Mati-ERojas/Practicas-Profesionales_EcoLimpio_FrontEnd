import type { ICierreCaja } from "./ICierreCaja";
import type { IUsuario } from "./IUsuario";

export type Estado = "ABIERTO" | "CERRADO"
export interface IVenta {
    id?: string;
    habilitado?: boolean;
    recibo?: number;
    fecha: string;
    estado?: Estado;
    total: number;
    vendedor: IUsuario;
    cierreCaja?: ICierreCaja;
}