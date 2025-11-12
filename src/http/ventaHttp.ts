import type { ICierreCaja } from '../types/ICierreCaja';
import type { IVenta } from '../types/IVenta'
import type { IVentaConDetalles } from '../types/IVentaConDetalles';
import axiosAuth from './axios.config'

const apiUrlHttp = '/ventas'

export const createVentaHttp = async (venta: IVenta): Promise<IVenta | undefined> => {
    try {
        const response = await axiosAuth.post<IVenta>(apiUrlHttp, venta);
        return response.data;
    } catch (error) {
        console.error('Problemas en createVentaHttp', error)
        throw error;
    }
}

export const getVentaConDetallesByIdHttp = async (ventaId: string): Promise<IVentaConDetalles | undefined> => {
    try {
        const response = await axiosAuth.get<IVentaConDetalles>(apiUrlHttp + `/con-detalles/${ventaId}`);
        return response.data;
    } catch (error) {
        console.error('Problemas en getVentaConDetallesByIdHttp', error)
        throw error;
    }
}

export const getVentasAbiertasHttp = async (): Promise<IVentaConDetalles[] | undefined> => {
    try {
        const response = await axiosAuth.get<IVentaConDetalles[]>(apiUrlHttp + '/abiertas');
        return response.data;
    } catch (error) {
        console.error('Problemas en getVentasAbiertasHttp', error)
        throw error;
    }
}

export const agregarCierreCajaHttp = async (ventaId: string, cierreCaja: ICierreCaja): Promise<IVenta | undefined> => {
    try {
        const response = await axiosAuth.post<IVenta>(`${apiUrlHttp}/cierres-caja/${ventaId}`, cierreCaja);
        return response.data;
    } catch (error) {
        console.error('Problemas en agregarCierreCajaHttp', error);
        throw error;
    }
}