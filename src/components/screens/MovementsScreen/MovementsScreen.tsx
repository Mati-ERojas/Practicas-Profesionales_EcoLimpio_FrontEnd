import { useEffect, useState } from 'react'
import { MovementsTable } from '../../UI/MovementsTable/MovementsTable'
import styles from './MovementsScreen.module.css'
import type { IMovimiento, TipoMovimiento } from '../../../types/IMovimiento'
import { useMovimiento } from '../../../hooks/useMovimiento'
import { usuarioStore } from '../../../store/usuarioStore'
import { useFormik } from 'formik'
import type { IFiltroMovimientos } from '../../../types/IFiltroMovimientos'
import { useUsuario } from '../../../hooks/useUsuario'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import type { IUsuario } from '../../../types/IUsuario'

export const MovementsScreen = () => {
    const [firstRender, setFirstRender] = useState(true)

    const usuarios = usuarioStore((state) => state.usuarios)
    const { getUsuarios, getUsuarioById } = useUsuario()
    const [usuarioFiltrado, setUsuarioFiltrado] = useState<IUsuario | null>(null)

    const { filtrarMovimientos } = useMovimiento()
    const [movimientos, setMovimientos] = useState<IMovimiento[]>([])

    const exportToExcel = (movimientos: IMovimiento[]) => {
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
        // Crear array de datos
        const datos = movimientos.map((m) => ({
            Fecha: new Date(m.fecha).toLocaleDateString('es-AR'),
            Tipo: m.tipo,
            SKU: m.producto ? m.producto.sku : '-',
            Producto: m.producto ? m.producto.titulo : '-',
            Cantidad: m.cantidad ? m.cantidad : '-',
            Precio_unitario: getPrecioUnitario(m),
            Total: m.total ? `$ ${m.total.toLocaleString('es-AR')}` : '-'
        }))

        // Crear hoja de Excel
        const ws = XLSX.utils.json_to_sheet(datos);

        // Crear libo de Excel y agregar la hoja
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Movimientos')

        // Generar archivo Excel y descargarlo
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
        saveAs(data, `Movimientos_${usuarioFiltrado?.nombre}.xlsx`)
    }

    const handleExportToExcel = () => {
        if (movimientos) {
            exportToExcel(movimientos)
        } else {
            alert('No hay movimientos')
        }
    }

    const handleGetMovimientos = async (movimientos: IMovimiento[]) => {
        if (movimientos && movimientos.length > 0) {
            // Ordenar por fecha descendente
            const movimientosOrdenados = movimientos.sort(
                (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            )

            setMovimientos(movimientosOrdenados)
        } else {
            setMovimientos([])
        }
    }
    useEffect(() => {
        getUsuarios()
    }, [])

    const formik = useFormik<IFiltroMovimientos>({
        initialValues: {
            idUsuario: '',
            tipoMovimiento: '',
            skuNombre: '',
            fechaMax: '',
            fechaMin: '',
            totalMovMax: undefined,
            totalMovMin: undefined
        }, onSubmit: async (values) => {
            if (!values.idUsuario) { alert('Debe seleccionar un usuario'); setMovimientos([]); return; }
            if (values.fechaMin && values.fechaMax && values.fechaMax < values.fechaMin) { alert('La fecha máxima debe ser mayor a la minima'); return; }
            if (values.totalMovMin && values.totalMovMax && values.totalMovMax < values.totalMovMin) { alert('El total máximo debe ser mayor al total mínimo'); return; }

            const filtroValues: IFiltroMovimientos = {
                idUsuario: values.idUsuario,
                tipoMovimiento: values.tipoMovimiento as TipoMovimiento ?? null,
                skuNombre: values.skuNombre,
                fechaMax: values.fechaMax ? `${values.fechaMax}T23:59:59.999` : null,
                fechaMin: values.fechaMin ? `${values.fechaMin}T00:00:00.000` : null,
                totalMovMax: values.totalMovMax,
                totalMovMin: values.totalMovMin
            }
            const movimientos = await filtrarMovimientos(filtroValues)
            if (movimientos) {
                handleGetMovimientos(movimientos)
            }
        }
    })

    useEffect(() => {
        if (firstRender) {
            setFirstRender(false)
            return
        }
        formik.handleSubmit()
    }, [
        formik.values.idUsuario,
        formik.values.tipoMovimiento,
        formik.values.fechaMin,
        formik.values.fechaMax,
    ]);

    const handleGetUsuarioFiltrado = async () => {
        const usuario = await getUsuarioById(formik.values.idUsuario!)
        setUsuarioFiltrado(usuario!)
    }
    useEffect(() => {
        if (formik.values.idUsuario && formik.values.idUsuario.length > 0) {
            handleGetUsuarioFiltrado()
        } else {
            setUsuarioFiltrado(null)
        }
    }, [formik.values.idUsuario])

    return (
        <div className={styles.background}>
            <div className={styles.header}>
                <h2>{usuarioFiltrado ? `Movimientos de: ${usuarioFiltrado.nombre}` : 'Movimientos'}</h2>
                <p>Total general: $ {movimientos.reduce((total, m) => total + (m.total ? m.total : 0), 0).toLocaleString('es-AR')}</p>
                <form className={styles.headerForm} onSubmit={formik.handleSubmit}>
                    <div className={styles.headerLeft}>
                        <select
                            className={styles.inputs}
                            name="idUsuario"
                            value={formik.values.idUsuario!}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ width: 'fit-content' }}
                        >
                            <option value="">Seleccione un usuario</option>
                            {usuarios.map((usuario) => (
                                <option key={usuario.id} value={usuario.id}>{usuario.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.filters}>
                        <div className={styles.groupedFilters}>
                            <input className={styles.inputs}
                                type='date'
                                name='fechaMin'
                                value={formik.values.fechaMin!}
                                onChange={formik.handleChange} />
                            <input className={styles.inputs}
                                type='date'
                                name='fechaMax'
                                min={formik.values.fechaMin!}
                                value={formik.values.fechaMax!}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className={styles.groupedFilters}>
                            <input className={styles.inputs}
                                name='skuNombre'
                                type='text'
                                placeholder='Buscar producto . . .'
                                value={formik.values.skuNombre!}
                                onChange={formik.handleChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        formik.handleSubmit()
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                            <select className={styles.inputs}
                                name="tipoMovimiento"
                                value={formik.values.tipoMovimiento!}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{ width: 'fit-content' }}
                            >
                                <option value="">Seleccione un tipo de movimiento</option>
                                <option value="VENTA">Venta</option>
                                <option value="INGRESO">Ingreso</option>
                                <option value="AJUSTE">Ajuste</option>
                                <option value="DECOMISO">Decomiso</option>
                                <option value="ROBO">Robo</option>
                                <option value="ROTURA">Rotura</option>
                                <option value="VENCIMIENTO">Vencimiento</option>
                                <option value="CIERRECAJA">Cierre de caja</option>
                            </select>

                        </div>
                        <div className={styles.groupedFilters}>
                            <div className={styles.inputWrapper}>
                                <span style={{
                                    position: "absolute",
                                    left: "5px",
                                    pointerEvents: "none",
                                    color: "black",
                                    zIndex: "70",
                                }}>$</span>
                                <input className={styles.inputs} type='number'
                                    placeholder='0'
                                    style={{ paddingLeft: '15px' }}
                                    name='totalMovMin'
                                    value={formik.values.totalMovMin!}
                                    onChange={formik.handleChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            formik.handleSubmit()
                                        }
                                    }}
                                />
                            </div>
                            <div className={styles.inputWrapper}>
                                <span style={{
                                    position: "absolute",
                                    left: "5px",
                                    pointerEvents: "none",
                                    color: "black",
                                    zIndex: "70",
                                }}>$</span>
                                <input className={styles.inputs} type='number'
                                    style={{ paddingLeft: '15px' }}
                                    name='totalMovMax'
                                    placeholder='0'
                                    value={formik.values.totalMovMax!}
                                    onChange={formik.handleChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            formik.handleSubmit()
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.headerRight}>
                        <button className={styles.downloadButton} onClick={() => handleExportToExcel()}>Descargar Excel</button>
                    </div>
                </form>
            </div>
            <div className={styles.content}>
                <MovementsTable movimientos={movimientos} />
            </div>
        </div>
    )
}