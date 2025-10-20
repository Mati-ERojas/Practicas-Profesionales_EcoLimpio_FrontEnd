import type { TipoMovimiento } from "./IMovimiento";

export interface IFiltroMovimientos {
    idUsuario?: string | null;
    tipoMovimiento?: TipoMovimiento | string | null;
    skuNombre?: string | null;
    totalMovMax?: number | null;
    totalMovMin?: number | null;
    fechaMin?: string | null;
    fechaMax?: string | null;
}