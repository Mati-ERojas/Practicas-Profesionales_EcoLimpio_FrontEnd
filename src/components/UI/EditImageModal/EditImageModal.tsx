import { useState, type Dispatch, type FC, type SetStateAction } from 'react'
import { productoStore } from '../../../store/productoStore'
import styles from './EditImageModal.module.css'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useProducto } from '../../../hooks/useProducto'

interface IEditImageModalProps {
    setOpenModalImage: Dispatch<SetStateAction<boolean>>
}
export const EditImageModal: FC<IEditImageModalProps> = ({ setOpenModalImage }) => {
    const productoActivo = productoStore((state) => state.productoActivo)
    const setProductoActivo = productoStore((state) => state.setProductoActivo)
    const { updateImagenProducto } = useProducto()

    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const imageValidationSchema = yup.object().shape({
        imagen: yup
            .mixed<File>()
            .required('Debes seleccionar una imagen')
            .test(
                'fileType',
                'Solo se permiten imágenes (.jpeg, .jpg, .png, .webp)',
                (value) => {
                    if (!value) return false;
                    const file = value as File;
                    const extension = file.name.split('.').pop()?.toLowerCase();
                    return ['jpeg', 'jpg', 'png', 'webp'].includes(extension || '');
                }
            )
            .test(
                'fileSize',
                'La imagen es demasiado grande (máx 2MB)',
                (value) => {
                    if (!value) return false;
                    const file = value as File;
                    return file.size <= 2 * 1024 * 1024;
                }
            ),
    });

    const formik = useFormik({
        initialValues: {
            imagen: null as File | null,
        }, validationSchema: imageValidationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            const success = await updateImagenProducto(productoActivo?.id!, values.imagen!)
            setLoading(false)
        },
    })
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            const file = event.currentTarget.files[0];
            formik.setFieldTouched('imagen', true);
            setPreview(URL.createObjectURL(file));
            formik.validateField('imagen');
            formik.setFieldValue('imagen', file);
        }
    };


    return (
        <div className='modal-overlay' >
            <div className={styles.modal}>
                <span className={styles.exitIcon} onClick={() => { setOpenModalImage(false); setProductoActivo(null) }}>X</span>
                <h3>Editar imagen</h3>
                <div className={styles.imageContainer} >
                    {preview ? (<img src={preview} alt='Preview' />) : productoActivo?.publicId ? (<img src={productoActivo?.urlImagen} />) : (<p>No hay imagen</p>)}
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className={styles.fileInputWrapper}>
                        <div className={styles.buttonsContainer}>
                            <div>
                                <input
                                    id="imagen"
                                    name="imagen"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className={styles.fileInput}
                                />
                                <label htmlFor="imagen" className={styles.fileLabel}>
                                    {preview ? "Editar imagen" : productoActivo?.publicId ? "Editar imagen" : "Seleccionar Imagen"}
                                </label>
                            </div>
                            <button
                                className={styles.submitButton}
                                type="submit"
                                disabled={loading || !formik.values.imagen || !!formik.errors.imagen}
                            >
                                Guardar imagen
                            </button>
                        </div>
                    </div>
                    {formik.touched.imagen && formik.errors.imagen && (
                        <div className={styles.error}>{formik.errors.imagen}</div>
                    )}
                </form>
            </div>
        </div >
    )
}
