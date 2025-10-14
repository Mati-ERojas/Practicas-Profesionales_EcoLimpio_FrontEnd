import { useEffect, useState } from 'react'
import { usuarioStore } from '../../../store/usuarioStore'
import styles from './POSScreen.module.css'
import { productoStore } from '../../../store/productoStore'
import { useProducto } from '../../../hooks/useProducto'
import type { IProducto } from '../../../types/IProducto'
import { POSSearchResults } from '../../UI/POSSearchResults/POSSearchResults'
import { useFormik } from 'formik'
import type { IUsuario } from '../../../types/IUsuario'
import type { IDetalleVenta } from '../../../types/IDetalleVenta'
import { saleValidationSchema } from './saleValidationSchema.schema'
import { DetalleVentaItem } from '../../UI/DetalleVentaItem/DetalleVentaItem'
import { useVenta } from '../../../hooks/useVenta'
import { useDetalleVenta } from '../../../hooks/useDetalleVenta'
import { useMovimiento } from '../../../hooks/useMovimiento'
import type { IMovimiento, TipoMovimiento } from '../../../types/IMovimiento'
import { CustomSwal } from '../../UI/CustomSwal/CustomSwal'

interface IFormValues {
    venta: {
        fecha: string
        vendedor: IUsuario
        total: number
    }
    detallesVenta: IDetalleVenta[]
}

export const POSScreen = () => {
    const { createVenta } = useVenta()
    const { createDetalleVenta } = useDetalleVenta()
    const { createMovimiento } = useMovimiento()

    const [loading, setLoading] = useState(false)

    const [fechaState, setFechaState] = useState(() => {
        const fechaNow = new Date()
        return new Date(fechaNow.getTime() - fechaNow.getTimezoneOffset() * 60000).toISOString().slice(0, -1)
    })

    const usuarioLogeado = usuarioStore((state) => state.usuarioLogeado)

    const { getProductosHabilitados } = useProducto()
    const productosHabilitados = productoStore((state) => state.productosHabilitados)

    const [search, setSearch] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [searchedProducts, setSearchedProducts] = useState<IProducto[]>([])

    useEffect(() => {
        getProductosHabilitados()
    }, [])

    const handleResetFecha = async () => {
        const fechaNow = new Date()
        await setFechaState(new Date(fechaNow.getTime() - fechaNow.getTimezoneOffset() * 60000).toISOString().slice(0, -1))
    }

    const handleSearch = () => {
        if (search) {
            const searchLower = search.toLowerCase();
            const productosFiltrados = productosHabilitados.filter((p) =>
                p.titulo.toLowerCase().includes(searchLower) ||
                p.sku.includes(searchLower)
            );
            setSearchedProducts(productosFiltrados)
        } else {
            setSearchedProducts([])
        }
    }
    useEffect(() => {
        handleSearch()
    }, [search])

    const handleAgregarProducto = (producto: IProducto) => {
        const yaAgregado = formik.values.detallesVenta.some(d => d.producto.id === producto.id)
        if (!yaAgregado) {
            const nuevoDetalle: IDetalleVenta = {
                producto: producto,
                cantidad: 1,
                subtotal: producto.porcentajeOferta ?
                    (producto.precioVenta - (producto.precioVenta * (producto.porcentajeOferta / 100)))
                    : producto.precioVenta
            }

            formik.setFieldValue('detallesVenta', [
                ...formik.values.detallesVenta, nuevoDetalle
            ])
        } else {
            alert('Producto ya agregado')
        }
    }

    const formik = useFormik<IFormValues>({
        enableReinitialize: true,
        initialValues: {
            venta: {
                fecha: fechaState,
                vendedor: usuarioLogeado!,
                total: 0
            },
            detallesVenta: []
        }, validationSchema: saleValidationSchema, onSubmit: async (values) => {
            setLoading(true);
            try {
                // Crear venta
                const ventaCreada = await createVenta(values.venta);
                if (!ventaCreada) throw new Error("Error al crear la venta");

                // Crear cada detalle y su movimiento
                for (const d of values.detallesVenta) {
                    const detalleVenta: IDetalleVenta = {
                        producto: d.producto,
                        cantidad: d.cantidad,
                        subtotal: d.subtotal,
                        venta: ventaCreada,
                    };

                    const detalleCreado = await createDetalleVenta(detalleVenta);
                    if (!detalleCreado) throw new Error("Error al crear detalle de venta");

                    const movimientoValues: IMovimiento = {
                        tipo: "VENTA" as TipoMovimiento,
                        fecha: values.venta.fecha,
                        cantidad: d.cantidad * -1,
                        total: d.subtotal,
                        usuario: usuarioLogeado!,
                        producto: d.producto,
                    };

                    const movimientoCreado = await createMovimiento(movimientoValues);
                    if (!movimientoCreado) throw new Error("Error al crear el movimiento");
                }

                CustomSwal.fire('Éxito', 'Venta registrada correctamente', 'success')
            } catch (error) {
                console.error(error);
                CustomSwal.fire('Error', 'Hubo un error al procesar la venta', 'error')
            } finally {
                await handleResetFecha()
                formik.resetForm()
                setLoading(false);
            }
        }

    })

    /* Recalcular el total al agregar un detalle*/
    useEffect(() => {
        const total = formik.values.detallesVenta.reduce((acc, d) => acc + d.subtotal, 0)
        formik.setFieldValue('venta.total', total)
    }, [formik.values.detallesVenta])

    /* Handler cantidad*/
    const handleCantidadChange = (index: number, nuevaCantidad: number) => {
        const nuevosDetalles = [...formik.values.detallesVenta]
        const producto = nuevosDetalles[index].producto

        nuevosDetalles[index].cantidad = nuevaCantidad
        nuevosDetalles[index].subtotal =
            nuevaCantidad *
            (producto.porcentajeOferta
                ? producto.precioVenta -
                producto.precioVenta * (producto.porcentajeOferta / 100)
                : producto.precioVenta)

        formik.setFieldValue('detallesVenta', nuevosDetalles)
    }

    /* Handler eliminar detalle */
    const handleEliminarDetalle = (index: number) => {
        const nuevosDetalles = formik.values.detallesVenta.filter((_, i) => i !== index)
        formik.setFieldValue('detallesVenta', nuevosDetalles)
    }

    return (
        <div className={styles.background}>
            <div className={styles.header}>
                <h2>Módulo de ventas</h2>
                <p>
                    Usuario: {usuarioLogeado?.nombre} - Fecha: {new Date(fechaState).toLocaleDateString('es-AR')} Hora: {new Date(fechaState).toLocaleTimeString('es-AR', { hour12: false })}
                </p>
            </div>
            <div className={styles.content}>
                <div className={styles.searchBarContainer}>
                    <input type='text'
                        name='search'
                        placeholder='Buscar producto'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        autoComplete='off'
                        className={styles.searchInput}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    {search && isFocused && <POSSearchResults productos={searchedProducts} agregarProducto={handleAgregarProducto} />}
                </div>
                <form className={styles.form} onSubmit={formik.handleSubmit}>
                    {formik.values.detallesVenta.length > 0 &&
                        <div className={styles.detallesContainer}>
                            <div className={styles.detallesContainerScrolleable}>
                                {formik.values.detallesVenta.map((detalle, index) => (
                                    <DetalleVentaItem
                                        key={detalle.producto.id}
                                        detalle={detalle}
                                        index={index}
                                        onCantidadChange={handleCantidadChange}
                                        onEliminar={handleEliminarDetalle}
                                    />
                                ))}
                            </div>
                        </div>
                    }
                    <div className={styles.submitContainer}>
                        <p><b>Total: $ {formik.values.venta.total.toLocaleString('es-AR')}</b></p>
                        <button type='submit' className={styles.submitButton} disabled={!(formik.isValid) || loading}>Confirmar venta</button>
                    </div>
                </form>
            </div>
            {loading &&
                <div className='modal-overlay'>
                    <div className={styles.loadingModal}>
                        <div className={styles.spinner}></div>
                        <h2>Procesando venta...</h2>
                    </div>
                </div>
            }
        </div>
    )
}
