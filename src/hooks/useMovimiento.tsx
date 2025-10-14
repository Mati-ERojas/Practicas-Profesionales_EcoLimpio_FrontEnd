import { createMovimientoHttp, getMovimientosByProductoHttp, getMovimientosByUsuarioHttp } from "../http/movimientoHttp";
import type { IMovimiento } from "../types/IMovimiento";


export const useMovimiento = () => {

    const getMovimientosByUsuario = async (usuarioId: string) => {
        try {
            const data = await getMovimientosByUsuarioHttp(usuarioId);
            return data;
        } catch (error) {
            console.error("Error en getMovimientosByUsuario", error)
        }
    }

    const getMovimientosByProducto = async (productoId: string) => {
        try {
            const data = await getMovimientosByProductoHttp(productoId);
            return data;
        } catch (error) {
            console.error("Error en getMovimientosByProducto", error)
        }
    }

    const createMovimiento = async (movimiento: IMovimiento): Promise<boolean | undefined> => {
        try {
            const data = await createMovimientoHttp(movimiento);
            if (!data) {
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error en createMovimiento", error)
            return false;
        }
    }

    return {
        getMovimientosByUsuario,
        getMovimientosByProducto,
        createMovimiento
    }
}