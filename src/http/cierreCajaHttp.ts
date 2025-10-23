
import type { ICierreCaja } from '../types/ICierreCaja'
import type { ICierreCajaConVentas } from '../types/ICierreCajaConVentas'
import axiosAuth from './axios.config'

const apiUrlHttp = '/cierres-caja'

export const createCierreCajaHttp = async (cierreCaja: ICierreCaja): Promise<ICierreCaja | undefined> => {
    try {
        const response = await axiosAuth.post<ICierreCaja>(apiUrlHttp, cierreCaja);
        return response.data;
    } catch (error) {
        console.error('Problemas en createCierreCajaHttp', error);
        throw error;
    }
}

export const getCierresCajaConVentasHttp = async (): Promise<ICierreCajaConVentas[] | undefined> => {
    try {
        const response = await axiosAuth.get(apiUrlHttp + '/con-ventas');
        return response.data;
    } catch (error) {
        console.error('Problemas en getCierresCajaConVentasHttp', error);
        throw error;
    }
}