import { useShallow } from 'zustand/shallow'
import { carritoStore } from '../../../store/carritoStore'
import styles from './ShoppingCartDropdown.module.css'
import type { ICarritoItem } from '../../../types/ICarritoItem'
import type { IProducto } from '../../../types/IProducto'
import { useEffect, useState } from 'react'
import { mediaStore } from '../../../store/mediaStore'

export const ShoppingCartDropdown = () => {
    const isMobile = mediaStore((state) => state.isMobile)

    const { carrito, setCarrito, actualizarItem, eliminarItem } = carritoStore(useShallow((state) => ({
        carrito: state.carrito,
        setCarrito: state.setCarrito,
        actualizarItem: state.actualizarItem,
        eliminarItem: state.eliminarItem
    })))

    const calculateTotal = () => carrito.reduce((acc, item) => acc + item.subtotal, 0);

    const calculateSubtotal = (producto: IProducto, cantidad: number): number => {
        if (producto.porcentajeOferta) {
            return ((producto.precioVenta - (producto.precioVenta * producto.porcentajeOferta / 100)) * cantidad)
        } else {
            return producto.precioVenta * cantidad
        }
    }

    const handleChangeCantidad = (item: ICarritoItem, nuevaCantidad: number) => {
        if (nuevaCantidad < 1) nuevaCantidad = 1;
        if (nuevaCantidad > item.producto.stock) nuevaCantidad = item.producto.stock;
        const itemActualizado: ICarritoItem = {
            id: item.id,
            cantidad: nuevaCantidad,
            producto: item.producto,
            subtotal: calculateSubtotal(item.producto, nuevaCantidad)
        }
        actualizarItem(itemActualizado);
    };

    const [erase, setErase] = useState(false)

    useEffect(() => {
        if (!erase) return;
        const timeout = setTimeout(() => {
            setErase(false);
        }, 500);
        return () => clearTimeout(timeout);
    }, [erase]);

    const handleSendToWhatsapp = () => {
        const fecha = new Date().toLocaleDateString('es-AR');
        const items = [...carrito];
        const numero = "5492616452668";

        let mensaje = `📋 *Pedido - ${fecha}*\n\n`;

        mensaje += `🛒 *Productos:*\n`;
        items.forEach((item) => {
            mensaje += `\n*${item.producto.titulo}* (SKU: ${item.producto.sku})\n`;
            mensaje += `Cantidad: ${item.cantidad}\n`;
            mensaje += `Precio unitario: $${(item.subtotal / item.cantidad).toLocaleString('es-AR')}\n`;
            mensaje += `*Subtotal: $${item.subtotal.toLocaleString('es-AR')}*\n`;
            mensaje += `─────────────────\n`;
        });

        mensaje += `\n💰 *TOTAL DEL PEDIDO:* $${(
            items.reduce((total, item) => total + item.subtotal, 0)
        ).toLocaleString('es-AR')}\n\n`;

        mensaje += `¡Gracias por tu compra! 🛍️`;

        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

        window.open(url, "_blank");
    };

    return (
        <div className={styles.dropdownContainer}>
            <h3>Mis Compras</h3>
            <div className={styles.itemsList}>
                {carrito.map((item) => (
                    <div className={styles.itemContainer}>
                        <div className={styles.item}>
                            <div className={styles.productInfo}>
                                <p>{item.producto.titulo}</p>
                                <p>(SKU: {item.producto.sku})</p>
                            </div>
                            <div className={styles.inputContainer}>
                                <span style={{ userSelect: 'none' }} className={styles.inputButton} onClick={() => handleChangeCantidad(item, item.cantidad - 1)}>-</span>
                                <input
                                    type='number'
                                    value={item.cantidad}
                                    min={1}
                                    max={item.producto.stock}
                                    style={{ pointerEvents: 'none' }}
                                />
                                <span style={{ userSelect: 'none' }} className={styles.inputButton} onClick={() => handleChangeCantidad(item, item.cantidad + 1)}>+</span>
                            </div>
                            <p style={{ position: 'absolute', left: '60%' }} className={styles.pSubtotal}>Subtotal: ${item.subtotal.toLocaleString('es-AR')}</p>
                            <p
                                className={styles.deleteButton}
                                style={isMobile ? { position: 'absolute', left: '85%', color: 'var(--red)', userSelect: 'none' } : { position: 'absolute', left: '90%', color: 'var(--red)', userSelect: 'none' }}
                                onClick={() => eliminarItem(item.id)}
                            >Eliminar</p>
                        </div>
                        <hr />
                    </div>
                ))}
                {!(carrito.length >= 1) &&
                    <p>¡No hay productos en el carrito!</p>
                }
            </div>
            <div className={styles.bigHr} />
            <p style={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'end' }}>TOTAL: $ {calculateTotal().toLocaleString('es-AR')}</p>
            <div className={styles.buttonsContainer}>
                <button style={{ width: '100%', fontSize: '14px' }} disabled={!(carrito.length >= 1)} onClick={() => handleSendToWhatsapp()}>Enviar por whatsapp</button>
                <button onClick={() => {
                    setErase(true);
                    setCarrito([])
                }}>
                    <span className={`material-icons ${erase ? styles.erase : ''}`} style={{ fontSize: '20px' }}>replay</span>
                </button>
            </div>
        </div >
    )
}
