import type { IMovimiento } from '../types/IMovimiento'
import axiosAuth from './axios.config'

const apiUrlHttp = '/movimientos'

export const getMovimientosByUsuarioHttp = async (usuarioId: string): Promise<IMovimiento[] | undefined> => {
    try {
        const response = await axiosAuth.get<IMovimiento[]>(`${apiUrlHttp}/usuarios/${usuarioId}`);
        return response.data;
    } catch (error) {
        console.error("Problemas en getMovimientosByUsuarioHttp", error)
        throw error;
    }
}

export const getMovimientosByProductoHttp = async (productoId: string): Promise<IMovimiento[] | undefined> => {
    try {
        const response = await axiosAuth.get<IMovimiento[]>(`${apiUrlHttp}/productos/${productoId}`);
        return response.data;
    } catch (error) {
        console.error("Problemas en getMovimientosByProductoHttp", error)
        throw error;
    }
}

export const createMovimientoHttp = async (movimiento: IMovimiento): Promise<IMovimiento | undefined> => {
    try {
        const response = await axiosAuth.post<IMovimiento>(apiUrlHttp, movimiento);
        return response.data;
    } catch (error) {
        console.error("Problemas en createMovimientoHttp", error);
        throw error;
    }
}