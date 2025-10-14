import { useEffect, useState, type Dispatch, type FC, type SetStateAction } from 'react'
import styles from './ProductHistoryModal.module.css'
import { productoStore } from '../../../store/productoStore'
import { useMovimiento } from '../../../hooks/useMovimiento'
import type { IMovimiento } from '../../../types/IMovimiento'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface IProductHistoryModalProps {
    setOpenModalHistory: Dispatch<SetStateAction<boolean>>
}

export const ProductHistoryModal: FC<IProductHistoryModalProps> = ({ setOpenModalHistory }) => {
    const productoActivo = productoStore((state) => state.productoActivo)
    const setProductoActivo = productoStore((state) => state.setProductoActivo)
    const { getMovimientosByProducto } = useMovimiento()
    const [movimientos, setMovimientos] = useState<IMovimiento[]>([])

    const handleGetMovimientosProducto = async () => {
        const res = await getMovimientosByProducto(productoActivo!.id!)

        if (res && res.length > 0) {
            // Ordenar por fecha descendente
            const movimientosOrdenados = res.sort(
                (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            )

            setMovimientos(movimientosOrdenados)
        }
    }

    useEffect(() => {
        handleGetMovimientosProducto()
    }, [])

    const exportToExcel = (movimientos: IMovimiento[]) => {
        // Crear array de datos
        const datos = movimientos.map((m) => ({
            Fecha: new Date(m.fecha).toLocaleDateString('es-AR'),
            Producto: m.producto?.titulo,
            Movimiento: m.tipo,
            Cantidad: m.cantidad,
            Total: `$ ${m.total}`,
            Usuario: m.usuario.nombre
        }))

        // Crear hoja de Excel
        const ws = XLSX.utils.json_to_sheet(datos);

        // Crear libo de Excel y agregar la hoja
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Movimientos: ${productoActivo?.sku}`)

        // Generar archivo Excel y descargarlo
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
        saveAs(data, `movimientos_${productoActivo?.sku}.xlsx`)
    }
    return (
        <div className='modal-overlay'>
            <div className={styles.modal}>
                <h3>Movimientos del producto: {productoActivo!.sku}</h3>
                <div className={styles.tablaContainer}>
                    <table className={styles.tabla} >
                        <thead className={styles.tablaHeader} >
                            <tr>
                                <th>Fecha</th>
                                <th>Producto</th>
                                <th>Movimiento</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                                <th>Usuario</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tablaBody} >
                            {movimientos.map((m) => (
                                <tr key={m.id}>
                                    <td>{new Date(m.fecha).toLocaleDateString('es-AR')}</td>
                                    <td>{m.producto?.titulo}</td>
                                    <td>{m.tipo}</td>
                                    <td>{m.cantidad}</td>
                                    <td>$ {m.total?.toLocaleString('es-AR')}</td>
                                    <td>{m.usuario.nombre}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {movimientos.length > 0 ? <></> : <p>No hay movimientos</p>}
                </div>
                <div className={styles.buttonsContainer}>
                    <button onClick={() => exportToExcel(movimientos)}>Descargar Excel</button>
                    <button onClick={() => { setOpenModalHistory(false); setProductoActivo(null) }}>Cerrar</button>
                </div>
            </div>
        </div>
    )
}
