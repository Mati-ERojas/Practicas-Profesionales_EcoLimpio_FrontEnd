import { useEffect, useState } from 'react'
import { useCierreCaja } from '../../../hooks/useCierreCaja'
import styles from './CashClosingHistory.module.css'
import type { ICierreCajaConVentas } from '../../../types/ICierreCajaConVentas'
import type { IDetalleVenta } from '../../../types/IDetalleVenta'

export const CashClosingHistory = () => {
    const { getCierresCajaConVentas } = useCierreCaja()
    const [cierresCaja, setCierresCaja] = useState<ICierreCajaConVentas[]>([])

    // Estado para controlar qué cierres están abiertos
    const [openIds, setOpenIds] = useState<Set<string>>(new Set())

    const handleGetCierresCaja = async () => {
    const cierres = await getCierresCajaConVentas()
    if (cierres) {
        const ordenados = [...cierres].sort(
            (a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
        )
        setCierresCaja(ordenados)
    } else {
        setCierresCaja([])
    }
}


    useEffect(() => {
        handleGetCierresCaja()
    }, [])

    const toggleOpen = (id: string) => {
        setOpenIds(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    const getPrecioUnitario = (d: IDetalleVenta) => {
            const precioUnitario = d.subtotal / d.cantidad
            return precioUnitario
    };
    return (
        <div className={styles.container}>
            {cierresCaja.map((c) => (
                <div key={c.id} className={styles.cierreContainer}>
                    <div
                        className={styles.cierreContainerHeader}
                        onClick={() => toggleOpen(c.id!)}
                    >
                        <p>
                            Cierre: {c.codigoCierre} -
                            Total: ${c.total.toLocaleString('es-AR')} -
                            Fecha: {new Date(c.fechaHora).toLocaleDateString('es-AR')} -
                            Hora: {new Date(c.fechaHora).toLocaleTimeString('es-AR', { hour12: false })}
                        </p>
                        <span className="material-symbols-outlined">
                            {openIds.has(c.id!) ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </span>
                    </div>

                    {openIds.has(c.id!) && (
                        <div className={styles.cierreContainerBody}>
                            <hr />
                            <div className={styles.tablaContainer}>
                                <table className={styles.tabla} >
                                    <thead className={styles.tablaHeader} >
                                        <tr>
                                            <th>Recibo</th>
                                            <th>Producto</th>
                                            <th>Precio unitario</th>
                                            <th>Cantidad</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className={styles.tablaBody} >
                                        {c.ventas.map((v) => v.detalles.map(d => (
                                            <tr key={d.id}>
                                                <td>{v.recibo}</td>
                                                <td>{d.producto.titulo}</td>
                                                <td style={getPrecioUnitario(d) == d.producto.precioVenta ? {} : {textDecoration:'underline', textDecorationColor:'var(--red)', textUnderlineOffset:'2px'}}>$ {getPrecioUnitario(d).toLocaleString('es-AR')}</td>
                                                <td>{d.cantidad}</td>
                                                <td>$ {d.subtotal.toLocaleString('es-AR')}</td>
                                            </tr>
                                        )))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

