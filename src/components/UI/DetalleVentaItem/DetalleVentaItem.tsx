import type { FC } from 'react'
import type { IDetalleVenta } from '../../../types/IDetalleVenta'
import styles from './DetalleVentaItem.module.css'

interface IDetalleVentaItemProps {
    detalle: IDetalleVenta
    index: number
    onCantidadChange: (index: number, nuevaCantidad: number) => void
    onEliminar: (index: number) => void;
}

export const DetalleVentaItem: FC<IDetalleVentaItemProps> = ({
    detalle,
    index,
    onCantidadChange,
    onEliminar,
}) => {
    const { producto, cantidad, subtotal } = detalle

    return (
        <div className={styles.container}>
            <div className={styles.detalleItem}>
                <div className={styles.detalleInfo}>
                    <p className={styles.detalleNombre}>{producto.titulo}</p>
                    <div className={styles.precioContainer}>
                        <p className={styles.precioUnitario}>Precio unitario:</p>
                        <p className={producto.porcentajeOferta ? styles.productoPrecioDescuento : styles.productoPrecio}>$ {producto.precioVenta.toLocaleString('es-AR')}</p>
                        {producto.porcentajeOferta ? <p className={styles.productoPrecio}>$ {(producto.precioVenta - (producto.precioVenta * producto.porcentajeOferta / 100)).toLocaleString('es-AR')}</p> : <></>}
                    </div>
                </div>
                <div className={styles.detalleDynamicInfo}>
                    <input
                        type='number'
                        min='1'
                        max={producto.stock}
                        value={cantidad}
                        onChange={(e) => {
                            let nuevaCantidad = Number(e.target.value)
                            if (isNaN(nuevaCantidad) || nuevaCantidad < 1) nuevaCantidad = 1
                            onCantidadChange(index, nuevaCantidad)
                        }}

                        className={styles.inputCantidad}
                    />
                    <p>$ {subtotal.toLocaleString('es-AR')}</p>
                </div>
                <button
                    type='button'
                    onClick={() => onEliminar(index)}
                    className={styles.removeButton}
                >
                    <span className="material-symbols-outlined">
                        delete
                    </span>
                </button>
            </div>
            <hr />
        </div>
    )
}
