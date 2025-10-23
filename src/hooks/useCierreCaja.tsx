import { CustomSwal } from "../components/UI/CustomSwal/CustomSwal"
import { createCierreCajaHttp, getCierresCajaConVentasHttp } from "../http/cierreCajaHttp"
import type { ICierreCaja } from "../types/ICierreCaja"
import type { ICierreCajaConVentas } from "../types/ICierreCajaConVentas"

export const useCierreCaja = () => {

    const createCierreCaja = async (cierreCaja: ICierreCaja): Promise<ICierreCaja | undefined> => {
        try {
            const data = await createCierreCajaHttp(cierreCaja);
            if (data) return data;
        } catch (error) {
            console.error('Error en createCierreCaja', error)
            CustomSwal.fire('Error', 'Hubo un problema al cerrar la caja', 'error')
        }
    }

    const getCierresCajaConVentas = async (): Promise<ICierreCajaConVentas[] | undefined> => {
        try {
            const data = await getCierresCajaConVentasHttp();
            if (data) return data;
        } catch (error) {
            console.error('Error en getCierresCajaConVentas', error)
        }
    }
    return {
        createCierreCaja,
        getCierresCajaConVentas
    }
}