import { useEffect, useState } from 'react'
import styles from './ProductManagementScreen.module.css'
import { ProductsTable } from '../../UI/ProductsTable/ProductsTable'
import { ManageCategoriasModal } from '../../UI/ManageCategoriasModal/ManageCategoriasModal'
import type { IProducto } from '../../../types/IProducto'
import { productoStore } from '../../../store/productoStore'
import { useProducto } from '../../../hooks/useProducto'
import { ProductFormModal } from '../../UI/ProductFormModal/ProductFormModal'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const ProductManagementScreen = () => {
    const productos = productoStore((state) => state.productos)
    const setProductoActivo = productoStore((state) => state.setProductoActivo)
    const { getProductos } = useProducto();
    const [tableProducts, setTableProducts] = useState<IProducto[]>([])
    const [search, setSearch] = useState('')
    const [openModalCategorias, setOpenModalCategorias] = useState(false)
    const [openModalProducto, setOpenModalProducto] = useState(false)

    useEffect(() => {
        getProductos()
    }, [])
    useEffect(() => {
        handleSearch()
    }, [search])
    const handleSearch = () => {
        if (search) {
            const searchLower = search.toLowerCase();
            const productosFiltrados = productos.filter((p) =>
                p.titulo.toLowerCase().includes(searchLower) ||
                p.sku.includes(searchLower) ||
                p.marca.toLowerCase().includes(searchLower) ||
                p.categoria.nombre.toLowerCase().includes(searchLower)
            );
            setTableProducts(productosFiltrados)
        } else {
            setTableProducts([])
        }
    }
    const exportToExcel = (productos: IProducto[]) => {
        // Crear array de datos
        const datos = productos.map((p) => ({
            Producto: p.titulo,
            SKU: p.sku,
            Marca: p.marca,
            Rubro: p.categoria.nombre,
            Precio_venta: `$ ${p.precioVenta}`,
            Precio_compra: `$ ${p.precioCompra}`,
            Stock: p.stock,
            Oferta: p.porcentajeOferta ? `${p.porcentajeOferta} %` : '-',
            Habilitado: p.habilitado ? '✅' : 'X'
        }))

        // Crear hoja de Excel
        const ws = XLSX.utils.json_to_sheet(datos);

        // Crear libo de Excel y agregar la hoja
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Inventario')

        // Generar archivo Excel y descargarlo
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
        saveAs(data, `Inventario_ecolimpio.xlsx`)
    }
    return (
        <div className={styles.background} >
            <div className={styles.header} >
                <h2>Gestión de productos</h2>
            </div>
            <div className={styles.content} >
                <div className={styles.contentHeader} >
                    <div className={styles.buttonSectionLeft} >
                        <button onClick={() => setOpenModalCategorias(true)} >Administrar categorias</button>
                        <button onClick={() => { setOpenModalProducto(true); setProductoActivo(null) }} >Crear producto</button>
                    </div>
                    <input type='text'
                        name='search'
                        placeholder='Buscar producto'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        autoComplete='off'
                        className={styles.searchInput}
                    />
                    <div className={styles.buttonSectionRight} >
                        <button onClick={() => exportToExcel(productos)} >Descargar Excel</button>
                    </div>
                </div>
                <div className={styles.tableSection} >
                    <ProductsTable productos={tableProducts.length > 0 ? tableProducts : productos} setOpenModalProducto={setOpenModalProducto} />
                </div>
            </div>
            {openModalCategorias && <ManageCategoriasModal setOpenModalCategorias={setOpenModalCategorias} />}
            {openModalProducto && <ProductFormModal setOpenModalProducto={setOpenModalProducto} />}
        </div >
    )
}
