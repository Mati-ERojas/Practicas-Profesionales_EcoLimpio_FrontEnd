import { create } from "zustand";
import type { ICarritoItem } from "../types/ICarritoItem";


interface ICarritoStore {
    carrito: ICarritoItem[];
    setCarrito: (carrito: ICarritoItem[]) => void;
    añadirItem: (carritoItem: ICarritoItem) => void;
    actualizarItem: (carritoItemActualizado: ICarritoItem) => void;
    eliminarItem: (carritoItemId: string) => void;
}

export const carritoStore = create<ICarritoStore>((set) => ({
    carrito: [],
    setCarrito: (carritoIn) => {
        set(() => ({ carrito: carritoIn }))
    },
    añadirItem: (carritoItemIn) => {
        set((state) => ({ carrito: [...state.carrito, carritoItemIn] }))
    },
    actualizarItem: (carritoItemActualizado) => {
        set((state) => ({ carrito: state.carrito.map((cItem) => cItem.id === carritoItemActualizado.id ? { ...carritoItemActualizado } : cItem) }))
    },
    eliminarItem: (idCarritoItem) => {
        set((state => ({ carrito: state.carrito.filter((cItem) => cItem.id !== idCarritoItem) })))
    }
}))