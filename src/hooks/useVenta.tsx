import { CustomSwal } from "../components/UI/CustomSwal/CustomSwal";
import { agregarCierreCajaHttp, createVentaHttp, getVentaConDetallesByIdHttp, getVentasAbiertasHttp } from "../http/ventaHttp"
import type { ICierreCaja } from "../types/ICierreCaja";
import type { IVenta } from "../types/IVenta"
import type { IVentaConDetalles } from "../types/IVentaConDetalles";


export const useVenta = () => {
    const createVenta = async (venta: IVenta): Promise<IVenta | undefined> => {
        try {
            const data = await createVentaHttp(venta);
            if (data) {
                return data;
            }
        } catch (error) {
            console.error('Error en createVenta', error);
            CustomSwal.fire('Error', 'Hubo un problema al procesar la venta', 'error');
        }
    }

    const getVentaConDetallesById = async (ventaId: string): Promise<IVentaConDetalles | undefined> => {
        try {
            const data = await getVentaConDetallesByIdHttp(ventaId);
            if (data) {
                return data;
            }
        } catch (error) {
            console.error('Error en getVentasConDetallesById', error);
        }
    }

    const getVentasAbiertas = async (): Promise<IVentaConDetalles[] | undefined> => {
        try {
            const data = await getVentasAbiertasHttp();
            if (data) {
                return data;
            }
        } catch (error) {
            console.error('Error en getVentasAbiertas', error);
        }
    }

    const agregarCierreCaja = async (ventaId: string, cierreCaja: ICierreCaja): Promise<boolean | undefined> => {
        try {
            const data = await agregarCierreCajaHttp(ventaId, cierreCaja);
            if (data) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error en agregarCierreCaja', error);
            return false;
        }
    }
    return {
        createVenta,
        getVentaConDetallesById,
        getVentasAbiertas,
        agregarCierreCaja
    }
}