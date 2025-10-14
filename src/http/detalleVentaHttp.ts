import type { IDetalleVenta } from '../types/IDetalleVenta'
import axiosAuth from './axios.config'

const apiUrlHttp = '/detalles-ventas'

export const createDetalleVentaHttp = async (detalleVenta: IDetalleVenta): Promise<IDetalleVenta | undefined> => {
    try {
        const response = await axiosAuth.post<IDetalleVenta>(apiUrlHttp, detalleVenta);
        return response.data;
    } catch (error) {
        console.error('Problemas en createDetalleVentaHttp', error);
        throw error;
    }
}
