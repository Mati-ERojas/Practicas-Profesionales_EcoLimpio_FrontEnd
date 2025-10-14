import type { FC } from 'react'
import type { IProducto } from '../../../types/IProducto'
import styles from './POSSearchResults.module.css'

interface IPOSSearchResultsProps {
    productos: IProducto[];
    agregarProducto: (producto: IProducto) => void;
}

export const POSSearchResults: FC<IPOSSearchResultsProps> = ({ productos, agregarProducto }) => {

    return (
        <div className={styles.resultsContainer}>
            <div onMouseDown={(e) => e.preventDefault()} className={styles.listContainer}>
                {productos.map((p) => (
                    <div key={p.id} className={styles.productoContainer}>
                        <hr />
                        <p className={styles.productoNombre}>{p.titulo}</p>
                        <div className={styles.productoPrecioContainer}>
                            <p className={p.porcentajeOferta ? styles.productoPrecioDescuento : styles.productoPrecio}>$ {p.precioVenta.toLocaleString('es-AR')}</p>
                            {p.porcentajeOferta ? <p className={styles.productoPrecio}>$ {(p.precioVenta - (p.precioVenta * p.porcentajeOferta / 100)).toLocaleString('es-AR')}</p> : <></>}
                        </div>
                        <button className={styles.productoButton} onClick={() => agregarProducto(p)}>Agregar</button>
                    </div>
                ))
                }
                {productos.length > 0 ? <></> : <p style={{ textAlign: 'center' }}>No se encuentra el producto</p>}
            </div >
        </div>
    )
}
