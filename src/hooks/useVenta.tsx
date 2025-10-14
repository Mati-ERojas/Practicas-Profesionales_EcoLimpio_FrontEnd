import { CustomSwal } from "../components/UI/CustomSwal/CustomSwal";
import { createVentaHttp } from "../http/ventaHttp"
import type { IVenta } from "../types/IVenta"


export const useVenta = () => {
    const createVenta = async (venta: IVenta): Promise<IVenta | undefined> => {
        try {
            const data = await createVentaHttp(venta);
            if (data) {
                return data;
            }
        } catch (error) {
            console.error('Error en createVenta', error)
            CustomSwal.fire('Error', 'Hubo un problema al procesar la venta', 'error')
        }
    }

    return {
        createVenta
    }
}