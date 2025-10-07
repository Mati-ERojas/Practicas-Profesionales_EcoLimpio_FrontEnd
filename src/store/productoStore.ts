import { create } from "zustand";
import type { IProducto } from "../types/IProducto";


interface IProductoStore {
    productos: IProducto[];
    productosHabilitados: IProducto[];
    productoActivo: IProducto | null;
    setProductos: (productos: IProducto[]) => void;
    setProductosHabilitados: (productos: IProducto[]) => void;
    setProductoActivo: (producto: IProducto | null) => void;
    añadirProducto: (productoNuevo: IProducto) => void;
    actualizarProducto: (productoActualizado: IProducto) => void;
    eliminarProducto: (idProducto: string) => void;
}

export const productoStore = create<IProductoStore>((set) => ({
    productos: [],
    productosHabilitados: [],
    productoActivo: null,
    setProductos: (productosIn) => {
        set(() => ({ productos: productosIn }))
    },
    setProductosHabilitados: (productosIn) => {
        set(() => ({ productosHabilitados: productosIn }))
    },
    setProductoActivo: (productoActivoIn) => {
        set(() => ({ productoActivo: productoActivoIn }))
    },
    añadirProducto: (productoNuevo) => {
        set((state) => ({ productos: [...state.productos, productoNuevo] }))
    },
    actualizarProducto: (productoActualizado) => {
        set((state) => ({ productos: state.productos.map((producto) => producto.id === productoActualizado.id ? { ...productoActualizado } : producto) }))
    },
    eliminarProducto: (idProducto) => {
        set((state) => ({ productos: state.productos.filter((producto) => producto.id !== idProducto) }))
    }
}))