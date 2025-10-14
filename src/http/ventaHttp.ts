import type { IVenta } from '../types/IVenta'
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