import { useShallow } from "zustand/shallow";
import { carritoStore } from "../store/carritoStore";
import type { ICarritoItem } from "../types/ICarritoItem";
import { useState, useEffect } from "react";

export const useCarrito = () => {
    const [mensajeNotificacion, setMensajeNotificacion] = useState<string | null>(null);
    const [color, setColor] = useState<string>("");

    useEffect(() => {
        if (!mensajeNotificacion) return;
        const timeout = setTimeout(() => {
            setMensajeNotificacion(null);
        }, 3500);
        return () => clearTimeout(timeout);
    }, [mensajeNotificacion]);

    const { añadirCarritoItem, carrito } = carritoStore(
        useShallow((state) => ({
            añadirCarritoItem: state.añadirItem,
            carrito: state.carrito,
        }))
    );

    const añadirItem = (item: ICarritoItem) => {
        const isItemAlreadyIn = carrito.some(
            (cItem) => cItem.producto.id === item.producto.id
        );

        if (isItemAlreadyIn) {
            setColor("--red");
            setMensajeNotificacion("El producto ya está en el carrito");
            return;
        }

        añadirCarritoItem(item);
        setColor("--green");
        setMensajeNotificacion("Producto agregado al carrito");
    };

    return {
        añadirItem,
        mensajeNotificacion,
        color,
    };
};
