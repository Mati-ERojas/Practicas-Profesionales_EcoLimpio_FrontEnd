import { useFormik } from 'formik'
import styles from './ProductFormModal.module.css'
import { productFormSchema } from './productForm.schema.ts'
import { useEffect, useState, type Dispatch, type FC, type SetStateAction } from 'react'
import { useCategoria } from '../../../hooks/useCategoria';
import { categoriaStore } from '../../../store/categoriaStore';
import type { IProducto } from '../../../types/IProducto';
import { productoStore } from '../../../store/productoStore';
import { useProducto } from '../../../hooks/useProducto';
import type { IMovimiento } from '../../../types/IMovimiento.ts';


interface IProductFormModalProp {
    setOpenModalProducto: Dispatch<SetStateAction<boolean>>;
}
export const ProductFormModal: FC<IProductFormModalProp> = ({ setOpenModalProducto }) => {
    const productoActivo = productoStore((state) => state.productoActivo)
    const setProductoActivo = productoStore((state) => state.setProductoActivo)
    const categoriasHabilitadas = categoriaStore((state) => state.categoriasHabilitadas)
    const { getCategoriasHabilitadas, getCategoriaById } = useCategoria();
    const { createProducto, updateProducto } = useProducto()

    const [loading, setLoading] = useState(false)
    const [ofertar, setOfertar] = useState(false)

    const handleOfertarActivo = () => {
        if (productoActivo && productoActivo.porcentajeOferta) {
            setOfertar(true)
        } else {
            setOfertar(false)
        }
    }
    useEffect(() => {
        handleOfertarActivo();
        getCategoriasHabilitadas();
    }, [])
    const initialValues = productoActivo ? {
        sku: productoActivo.sku,
        titulo: productoActivo.titulo,
        precioCompra: productoActivo.precioCompra,
        precioVenta: productoActivo.precioVenta,
        descripcion: productoActivo.descripcion,
        marca: productoActivo.marca,
        stock: productoActivo.stock,
        porcentajeOferta: productoActivo.porcentajeOferta,
        categoriaId: productoActivo.categoria.id,
    }
        :
        {
            sku: "",
            titulo: "",
            precioCompra: null,
            precioVenta: null,
            descripcion: "",
            marca: "",
            stock: 0,
            porcentajeOferta: null,
            categoriaId: "",
        }
    const formik = useFormik({
        initialValues,
        validationSchema: productFormSchema,
        onSubmit: async (values) => {
            setLoading(true)
            const categoria = await getCategoriaById(values.categoriaId!)
            const productoValues: IProducto = productoActivo ? {
                id: productoActivo.id,
                sku: values.sku,
                titulo: values.titulo,
                precioCompra: values.precioCompra!,
                precioVenta: values.precioVenta!,
                descripcion: values.descripcion,
                marca: values.marca,
                stock: productoActivo.stock,
                categoria: categoria!,
                publicId: productoActivo.publicId,
                urlImagen: productoActivo.urlImagen
            } : {
                sku: values.sku,
                titulo: values.titulo,
                precioCompra: values.precioCompra!,
                precioVenta: values.precioVenta!,
                descripcion: values.descripcion,
                marca: values.marca,
                stock: values.stock,
                categoria: categoria!
            }
            if (values.porcentajeOferta !== null) { productoValues.porcentajeOferta = values.porcentajeOferta }

            const success = productoActivo ? await updateProducto(productoValues) : await createProducto(productoValues);
            setOpenModalProducto(false)
            setProductoActivo(null)
            setLoading(false)
        }
    })
    return (
        <div className='modal-overlay'>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <p style={{ fontSize: "20px" }}>{productoActivo ? "Editar producto" : "Crear producto"}</p>
                </div>
                <form className={styles.form} onSubmit={formik.handleSubmit}>
                    <div className={styles.inputsContainer}>
                        <div className={styles.inputWrapper}>
                            <input type='text'
                                name='titulo'
                                placeholder='Nombre del producto'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.titulo}
                                autoComplete='off'
                            />
                            {formik.touched.titulo && formik.errors.titulo && (
                                <div className={styles.error}>{formik.errors.titulo}</div>
                            )}
                        </div>
                        <div className={styles.inputWrapper}>
                            <select
                                name="categoriaId"
                                value={formik.values.categoriaId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="null">Seleccione una categoria</option>
                                {categoriasHabilitadas.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                                ))}
                            </select>
                            {formik.touched.categoriaId && formik.errors.categoriaId && (
                                <div className={styles.error}>{formik.errors.categoriaId}</div>
                            )}
                        </div>
                        <div className={styles.inputWrapper}>
                            <input type='text'
                                name='sku'
                                placeholder='SKU'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.sku}
                                autoComplete='off'
                            />
                            {formik.touched.sku && formik.errors.sku && (
                                <div className={styles.error}>{formik.errors.sku}</div>
                            )}
                        </div>
                        <div className={styles.inputWrapper}>
                            <input type='text'
                                name='marca'
                                placeholder='Marca'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.marca}
                                autoComplete='off'
                            />
                            {formik.touched.marca && formik.errors.marca && (
                                <div className={styles.error}>{formik.errors.marca}</div>
                            )}
                        </div>
                        <div className={styles.inputWrapper}>
                            <span style={{
                                position: "absolute",
                                left: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                pointerEvents: "none",
                                color: "black",
                                zIndex: "100",
                            }}>$</span>
                            <input type='number'
                                name='precioVenta'
                                placeholder='Precio de venta'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.precioVenta ?? ""}
                                style={{ paddingLeft: "20px" }}
                                autoComplete='off'
                            />
                            {formik.touched.precioVenta && formik.errors.precioVenta && (
                                <div className={styles.error}>{formik.errors.precioVenta}</div>
                            )}
                        </div>
                        <div className={styles.inputWrapper}>
                            <span style={{
                                position: "absolute",
                                left: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                pointerEvents: "none",
                                color: "black",
                                zIndex: "100",
                            }}>$</span>
                            <input type='number'
                                name='precioCompra'
                                placeholder='Precio de compra'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.precioCompra ?? ""}
                                style={{ paddingLeft: "20px" }}
                                autoComplete='off'
                            />
                            {formik.touched.precioCompra && formik.errors.precioCompra && (
                                <div className={styles.error}>{formik.errors.precioCompra}</div>
                            )}
                        </div>
                        <div className={styles.inputWrapper}>
                            <textarea
                                name="descripcion"
                                placeholder="Descripción"
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                rows={3}
                                className={styles.textarea}
                            />
                            {formik.touched.descripcion && formik.errors.descripcion && (
                                <div className={styles.error}>{formik.errors.descripcion}</div>
                            )}
                        </div>
                        {productoActivo ? (
                            <></>
                        ) : (
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
                        )}

                        <div className={styles.ofertarCheckbox}>
                            <p>Ofertar: </p>
                            {ofertar ? <span className="material-symbols-outlined" onClick={() => { setOfertar(false); formik.setFieldValue("porcentajeOferta", null) }}>
                                check_box
                            </span> : <span className="material-symbols-outlined" onClick={() => setOfertar(true)}>
                                check_box_outline_blank
                            </span>}
                        </div>
                        {ofertar ?
                            <div className={styles.inputWrapper}>
                                <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "black", zIndex: "100", }}>%</span>
                                <input type='number'
                                    name='porcentajeOferta'
                                    placeholder='Oferta'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.porcentajeOferta ?? ""}
                                    autoComplete='off'
                                    style={{ paddingRight: "30px" }} />
                                {formik.touched.porcentajeOferta && formik.errors.porcentajeOferta &&
                                    (<div className={styles.error}>{formik.errors.porcentajeOferta}</div>)}
                            </div> : <div></div>}
                    </div>
                    <div className={styles.buttonsContainer}>
                        <button type='submit' className={styles.acceptButton} disabled={!(formik.isValid && formik.dirty) || loading} >{productoActivo ? "Editar producto" : "Crear producto"}</button>
                        <button type='reset' disabled={loading} className={styles.cancelButton} onClick={() => { setOpenModalProducto(false); setProductoActivo(null) }} >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
