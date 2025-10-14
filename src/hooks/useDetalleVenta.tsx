import { createDetalleVentaHttp } from "../http/detalleVentaHttp"
import type { IDetalleVenta } from "../types/IDetalleVenta"

export const useDetalleVenta = () => {
    const createDetalleVenta = async (detalleVenta: IDetalleVenta): Promise<boolean> => {
        try {
            const data = await createDetalleVentaHttp(detalleVenta);
            if (data) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error en createDetalleVenta', error)
            return false;
        }
    }

    return {
        createDetalleVenta
    }
}