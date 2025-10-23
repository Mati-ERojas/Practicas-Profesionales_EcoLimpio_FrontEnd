import { type FC, useState, useMemo } from "react";
import styles from "./CashClosingTable.module.css";
import type { IVentaConDetalles } from "../../../types/IVentaConDetalles";

interface ICashClosingTableProps {
    ventas: IVentaConDetalles[];
}

export const CashClosingTable: FC<ICashClosingTableProps> = ({ ventas }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Aplanamos las ventas: convertimos [{venta, detalles[]}] → [{detalle, venta}]
    const allDetalles = useMemo(() => {
        return ventas
            .flatMap((v) =>
                v.detalles.map((d) => ({
                    ...d,
                    venta: v,
                }))
            )
            .sort((a, b) => {
                const reciboA = a.venta.recibo ?? 0;
                const reciboB = b.venta.recibo ?? 0;
                return reciboA - reciboB;
            });
    }, [ventas]);


    const totalPages = Math.ceil(allDetalles.length / rowsPerPage);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = allDetalles.slice(indexOfFirstRow, indexOfLastRow);
    // Genera los botones con puntos suspensivos
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 3;

        if (totalPages <= 6) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > maxVisible) pages.push("...");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - maxVisible + 1) pages.push("...");

            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className={styles.container}>
            <table className={styles.tabla}>
                <thead className={styles.tablaHeader}>
                    <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Recibo</th>
                        <th>Producto</th>
                        <th>Precio unitario</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody className={styles.tablaBody}>
                    {currentRows.map((item, i) => {
                        const { venta, producto, cantidad, subtotal } = item;
                        const fecha = new Date(venta.fecha);
                        return (
                            <tr key={i}>
                                <td>{fecha.toLocaleDateString('es-AR')}</td>
                                <td>{fecha.toLocaleTimeString('es-AR', { hour12: false, hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{venta.recibo}</td>
                                <td>{producto.titulo}</td>
                                <td>$ {producto.porcentajeOferta ? (producto.precioVenta - (producto.precioVenta * (producto.porcentajeOferta / 100))).toLocaleString('es-AR') : producto.precioVenta.toLocaleString('es-AR')}</td>
                                <td>{cantidad}</td>
                                <td>$ {subtotal.toLocaleString('es-AR')}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {allDetalles.length > 0 ? (
                <div className={styles.buttonsContainer}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Anterior
                    </button>

                    {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                            <span key={index}>...</span>
                        ) : (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(page as number)}
                                className={page === currentPage ? styles.activePage : ""}
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
            ) : (
                <p className={styles.tituloSinVentas}>No hay ventas sin cerrar</p>
            )}
        </div>
    );
};
