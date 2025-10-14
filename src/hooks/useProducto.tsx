import { useShallow } from "zustand/shallow"
import { productoStore } from "../store/productoStore"
import { createProductoHttp, deleteProductoHttp, getProductosHabilitadosHttp, getProductosHttp, toggleHabilitadoProductoHttp, updateImagenProductoHttp, updateProductoHttp } from "../http/productoHttp"
import type { IProducto } from "../types/IProducto"
import { CustomSwal } from "../components/UI/CustomSwal/CustomSwal"
import type { IMovimiento, TipoMovimiento } from "../types/IMovimiento"
import { usuarioStore } from "../store/usuarioStore"
import { useMovimiento } from "./useMovimiento"


export const useProducto = () => {
    const usuarioLogeado = usuarioStore((state) => state.usuarioLogeado)
    const { createMovimiento } = useMovimiento()
    const { setProductos, setProductosHabilitados, añadirProducto, actualizarProducto, eliminarProducto } = productoStore(useShallow((state) => ({
        setProductos: state.setProductos,
        setProductosHabilitados: state.setProductosHabilitados,
        añadirProducto: state.añadirProducto,
        actualizarProducto: state.actualizarProducto,
        eliminarProducto: state.eliminarProducto
    })))

    const getProductos = async (): Promise<void> => {
        try {
            const data = await getProductosHttp();
            if (data) {
                setProductos(data)
            }
        } catch (error) {
            console.error('Error en getProductos:', error)
        }
    }

    const getProductosHabilitados = async (): Promise<void> => {
        try {
            const data = await getProductosHabilitadosHttp();
            if (data) {
                setProductosHabilitados(data);
            }
        } catch (error) {
            console.error('Error en getProductosHabilitados', error)
        }
    }

    const createProducto = async (producto: IProducto): Promise<boolean> => {
        try {
            const data = await createProductoHttp(producto);
            if (data) {
                añadirProducto(data);
                CustomSwal.fire('Éxito', 'Producto creado correctamente', 'success')
                if (data.stock > 0) {
                    const movimiento: IMovimiento = {
                        tipo: 'INGRESO' as TipoMovimiento,
                        fecha: new Date().toISOString().slice(0, -1),
                        cantidad: data.stock,
                        total: data.precioCompra * data.stock,
                        usuario: usuarioLogeado!,
                        producto: data,
                    }
                    createMovimiento(movimiento)
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error en createProducto', error);
            CustomSwal.fire('Error', 'No se pudo crear el producto', 'error')
            return false;
        }
    }

    const updateProducto = async (producto: IProducto): Promise<boolean> => {
        try {
            const data = await updateProductoHttp(producto);
            if (data) {
                actualizarProducto(data);
                CustomSwal.fire('Éxito', 'Producto actualizado correctamente', 'success')
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error en updateProducto', error);
            CustomSwal.fire('Error', 'No se pudo actualizar el producto', 'error');
            return false;
        }
    }

    const updateImagenProducto = async (productoId: string, imagen: File): Promise<boolean> => {
        try {
            const data = await updateImagenProductoHttp(productoId, imagen);
            if (data) {
                actualizarProducto(data);
                CustomSwal.fire('Éxito', 'imagen actualizada correctamente', 'success')
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error en updateImagenProducto", error)
            CustomSwal.fire('Error', 'No se pudo actualizar la imagen del producto', 'error')
            return false;
        }
    }

    const deleteProducto = async (productoId: string): Promise<void> => {
        try {
            const result = await CustomSwal.fire({
                title: '¿Estás seguro?',
                text: "Esto podría generar problemas. Es recomendable solo deshabilitar.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar"
            });

            if (result.isConfirmed) {
                const success = await deleteProductoHttp(productoId);
                if (success) { eliminarProducto(productoId); }
            } else {
                return;
            }
        } catch (error) {
            CustomSwal.fire('Error', 'No se pudo eliminar el producto', 'error')
            console.error("Error en deleteProducto", error)
        }
    }

    const enableDisableProducto = async (productoId: string): Promise<void> => {
        try {
            await toggleHabilitadoProductoHttp(productoId)
            await getProductos()
        } catch (error) {
            console.error("Error al alterar el estado de la categoria: ", error)
        }
    }
    return {
        getProductos,
        getProductosHabilitados,
        createProducto,
        updateProducto,
        updateImagenProducto,
        deleteProducto,
        enableDisableProducto
    }
}