import { useState, type FC } from 'react'
import type { IMovimiento } from '../../../types/IMovimiento'
import styles from './MovementsTable.module.css'

interface IMovementsTableProps {
    movimientos: IMovimiento[]
}

export const MovementsTable: FC<IMovementsTableProps> = ({ movimientos }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8; //filas por página
    const totalPages = Math.ceil(movimientos.length / rowsPerPage);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = movimientos.slice(indexOfFirstRow, indexOfLastRow);

    // Función para generar botones con "..."
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 3; // cantidad de páginas visibles a la izquierda/derecha

        if (totalPages <= 6) {
            // caso simple: mostrar todas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1); // siempre mostrar la primera

            if (currentPage > maxVisible) {
                pages.push("..."); // puntos suspensivos a la izquierda
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - maxVisible + 1) {
                pages.push("..."); // puntos suspensivos a la derecha
            }

            pages.push(totalPages); // siempre mostrar la última
        }

        return pages;
    };

    const getPrecioUnitario = (m: IMovimiento) => {
        if (m.tipo === 'CIERRECAJA') return '-';
        if (!m.producto) return '-';
        if (m.tipo !== 'VENTA') return `$ ${m.producto.precioCompra.toLocaleString('es-AR')}`;
        if (m.producto.porcentajeOferta) {
            const precioUnitario = m.total! / Math.abs(m.cantidad!)
            return `$ ${precioUnitario.toLocaleString('es-AR')}`;
        }
        return `$ ${m.producto.precioVenta.toLocaleString('es-AR')}`;
    };

    return (
        <div className={styles.container}>
            <table className={styles.tabla} >
                <thead className={styles.tablaHeader} >
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>SKU</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody className={styles.tablaBody} >
                    {currentRows.map((m) => (
                        <tr key={m.id}>
                            <td>{new Date(m.fecha).toLocaleDateString('es-AR')}</td>
                            <td>{m.tipo}</td>
                            <td>{m.producto ? m.producto.sku : '-'}</td>
                            <td>{m.producto ? m.producto.titulo : '-'}</td>
                            <td>{m.cantidad ? m.cantidad : '-'}</td>
                            <td>{getPrecioUnitario(m)}</td>
                            <td>{m.total ? `$ ${m.total.toLocaleString('es-AR')}` : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {movimientos.length > 0 ?
                < div className={styles.buttonsContainer} >
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Anterior
                    </button>

                    {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                            <span key={index} >
                                . . .
                            </span>
                        ) : (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(page as number)}
                                className={page === currentPage ? styles.activePage : ''}
                            >
                                {page}
                            </button>
                        )
                    )}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Siguiente
                    </button>
                </div>
                :
                <p className={styles.tituloSinMovimientos}>
                    No hay movimientos
                </p>
            }
        </div>
    )
}
