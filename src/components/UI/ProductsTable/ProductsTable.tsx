import { useState, type Dispatch, type FC, type SetStateAction } from 'react';
import styles from './ProductsTable.module.css'
import type { IProducto } from '../../../types/IProducto';
import { productoStore } from '../../../store/productoStore';
import { useProducto } from '../../../hooks/useProducto';
import { EditImageModal } from '../EditImageModal/EditImageModal';
import { EditStockModal } from '../EditStockModal/EditStockModal';
import { ProductHistoryModal } from '../ProductHistoryModal/ProductHistoryModal';

interface IProductsTableProps {
    productos: IProducto[]
    setOpenModalProducto: Dispatch<SetStateAction<boolean>>
}
export const ProductsTable: FC<IProductsTableProps> = ({ productos, setOpenModalProducto }) => {
    const { deleteProducto, enableDisableProducto } = useProducto()
    const setProductoActivo = productoStore((state) => state.setProductoActivo)
    const [openModalImage, setOpenModalImage] = useState(false)
    const [openModalStock, setOpenModalStock] = useState(false)
    const [openModalHistory, setOpenModalHistory] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8; //filas por página
    const totalPages = Math.ceil(productos.length / rowsPerPage);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = productos.slice(indexOfFirstRow, indexOfLastRow);

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

    const handleEditProduct = (producto: IProducto) => {
        setProductoActivo(producto);
        setOpenModalProducto(true);
    }
    const handleEditImage = (producto: IProducto) => {
        setProductoActivo(producto);
        setOpenModalImage(true);
    }
    const handleEditStock = (producto: IProducto) => {
        setProductoActivo(producto);
        setOpenModalStock(true);
    }
    const handleOpenHistory = (producto: IProducto) => {
        setProductoActivo(producto);
        setOpenModalHistory(true)
    }
    return (
        <div className={styles.container}>
            <table className={styles.tabla} >
                <thead className={styles.tablaHeader} >
                    <tr>
                        <th>Producto</th>
                        <th>SKU</th>
                        <th>Marca</th>
                        <th>Rubro</th>
                        <th>Precio venta</th>
                        <th>Precio compra</th>
                        <th>Stock</th>
                        <th>Oferta</th>
                        <th>Habilitado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody className={styles.tablaBody} >
                    {currentRows.map((p) => (
                        <tr key={p.id}>
                            <td>{p.titulo}</td>
                            <td>{p.sku}</td>
                            <td>{p.marca}</td>
                            <td>{p.categoria.nombre}</td>
                            <td>$ {p.precioVenta}</td>
                            <td>$ {p.precioCompra}</td>
                            <td className={styles.hoverableColumns}>{p.stock}<span className="material-icons" style={{ fontSize: '15px' }} onClick={() => handleEditStock(p)} >
                                edit
                            </span></td>
                            <td>{p.porcentajeOferta ? `${p.porcentajeOferta} %` : '-'}</td>
                            <td className={styles.hoverableColumns}>
                                {p.habilitado ? <span className="material-symbols-outlined" onClick={() => enableDisableProducto(p.id!)}>
                                    check_box
                                </span> : <span className="material-symbols-outlined" onClick={() => enableDisableProducto(p.id!)}>
                                    check_box_outline_blank
                                </span>}
                            </td>
                            <td>
                                <div className={styles.tdAcciones} >
                                    <span className="material-icons" onClick={() => handleEditProduct(p)} >
                                        edit
                                    </span>
                                    <div className={styles.imageIconDiv} onClick={() => handleEditImage(p)} >
                                        <span className="material-icons">
                                            image
                                        </span>
                                        <div className={styles.imageAlert + " " + (p.publicId ? styles.hidden : "")} >
                                            <p>!</p>
                                        </div>
                                    </div>
                                    <span className="material-icons" onClick={() => deleteProducto(p.id!)} >
                                        delete
                                    </span>
                                    <span className="material-icons" onClick={() => handleOpenHistory(p)} >
                                        history
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {productos.length > 0 ?
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
                <p className={styles.tituloSinProductos}>
                    No hay productos
                </p>
            }
            {openModalImage && <EditImageModal setOpenModalImage={setOpenModalImage} />}
            {openModalStock && <EditStockModal setOpenModalStock={setOpenModalStock} />}
            {openModalHistory && <ProductHistoryModal setOpenModalHistory={setOpenModalHistory} />}
        </div >
    )
}
