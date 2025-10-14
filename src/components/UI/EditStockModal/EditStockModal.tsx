import { useState, type Dispatch, type FC, type SetStateAction } from 'react'
import styles from './EditStockModal.module.css'
import { productoStore } from '../../../store/productoStore'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useProducto } from '../../../hooks/useProducto'
import type { IProducto } from '../../../types/IProducto'
import { useMovimiento } from '../../../hooks/useMovimiento'
import type { IMovimiento, TipoMovimiento } from '../../../types/IMovimiento'
import { usuarioStore } from '../../../store/usuarioStore'

interface IEditStockModalProps {
    setOpenModalStock: Dispatch<SetStateAction<boolean>>
}

export const EditStockModal: FC<IEditStockModalProps> = ({ setOpenModalStock }) => {
    const productoActivo = productoStore((state) => state.productoActivo);
    const setProductoActivo = productoStore((state) => state.setProductoActivo);
    const usuarioLogeado = usuarioStore((state) => state.usuarioLogeado)
    const [loading, setLoading] = useState(false);
    const { updateProducto } = useProducto()
    const { createMovimiento } = useMovimiento()

    const formik = useFormik({
        initialValues: {
            tipoMovimiento: "",
            stock: null,
        }, validationSchema: yup.object().shape({
            tipoMovimiento: yup.string().required('El campo es obligatorio'),
            stock: yup.number().required('El campo es obligatorio').notOneOf([0], 'El stock no puede ser cero')
        }), onSubmit: async (values) => {
            setLoading(true)
            const stockValues: IProducto = {
                id: productoActivo!.id,
                stock: productoActivo!.stock + values.stock!,
                sku: productoActivo!.sku,
                titulo: productoActivo!.titulo,
                precioCompra: productoActivo!.precioCompra,
                precioVenta: productoActivo!.precioVenta,
                descripcion: productoActivo!.descripcion,
                marca: productoActivo!.marca,
                categoria: productoActivo!.categoria,
                publicId: productoActivo!.publicId,
                urlImagen: productoActivo!.urlImagen
            }
            const movimientoValues: IMovimiento = {
                tipo: values.tipoMovimiento as TipoMovimiento,
                fecha: new Date().toISOString().slice(0, -1),
                cantidad: values.stock!,
                total: Math.abs(productoActivo!.precioCompra * values.stock!),
                usuario: usuarioLogeado!,
                producto: productoActivo!,
            }
            const mSuccess = await createMovimiento(movimientoValues);
            if (mSuccess) {
                await updateProducto(stockValues);
            }
            setOpenModalStock(false)
            setLoading(false)
        }
    })
    return (
        <div className="modal-overlay">
            <div className={styles.modal}>
                <h3>Modificar stock - producto: {productoActivo?.sku}</h3>
                <form className={styles.form} onSubmit={formik.handleSubmit} >
                    <div className={styles.inputWrapper}>
                        <select
                            name="tipoMovimiento"
                            value={formik.values.tipoMovimiento}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="null">Seleccione el tipo de movimiento</option>
                            <option value="INGRESO">Ingreso</option>
                            <option value="AJUSTE">Ajuste</option>
                            <option value="DECOMISO">Decomiso</option>
                            <option value="ROBO">Robo</option>
                            <option value="ROTURA">Rotura</option>
                            <option value="VENCIMIENTO">Vencimiento</option>
                        </select>
                        {formik.touched.tipoMovimiento && formik.errors.tipoMovimiento && (
                            <div className={styles.error}>{formik.errors.tipoMovimiento}</div>
                        )}
                    </div>
                    <div className={styles.inputWrapper}>
                        <input type='number'
                            name='stock'
                            placeholder='Cantidad'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.stock ?? ""}
                            autoComplete='off'
                        />
                        {formik.touched.stock && formik.errors.stock && (
                            <div className={styles.error}>{formik.errors.stock}</div>
                        )}
                    </div>
                    <div className={styles.buttonsContainer}>
                        <button type='submit' className={styles.acceptButton} disabled={!(formik.isValid && formik.dirty) || loading} >Modificar</button>
                        <button type='reset' disabled={loading} className={styles.cancelButton} onClick={() => { setOpenModalStock(false); setProductoActivo(null) }} >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
