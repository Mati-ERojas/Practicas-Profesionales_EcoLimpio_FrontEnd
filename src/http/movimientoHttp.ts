import type { IFiltroMovimientos } from '../types/IFiltroMovimientos';
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

export const filtrarMovimientosHttp = async (filtro: IFiltroMovimientos): Promise<IMovimiento[] | undefined> => {
    try {
        const params = new URLSearchParams();

        if (filtro.idUsuario) params.append('idUsuario', filtro.idUsuario);
        if (filtro.tipoMovimiento) params.append('tipoMovimiento', filtro.tipoMovimiento.toString());
        if (filtro.skuNombre) params.append('skuNombre', filtro.skuNombre);
        if (filtro.fechaMax) params.append('fechaMax', filtro.fechaMax);
        if (filtro.fechaMin) params.append('fechaMin', filtro.fechaMin);
        if (filtro.totalMovMax) params.append('totalMovimientoMax', filtro.totalMovMax.toString());
        if (filtro.totalMovMin) params.append('totalMovimientoMin', filtro.totalMovMin.toString());

        const response = await axiosAuth.get<IMovimiento[]>(apiUrlHttp + `/filtro-movimientos?${params}`)
        return response.data
    } catch (error) {
        console.error("Problemas en filtrarMovimientosHttp", error);
        throw error;
    }
}