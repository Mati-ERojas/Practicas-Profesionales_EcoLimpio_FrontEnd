import { useState, type Dispatch, type FC, type SetStateAction } from 'react';
import type { IProducto } from '../../../types/IProducto'
import styles from './ProductCardDetailsModal.module.css'
import { createPortal } from 'react-dom';
import noPhoto from '../../../../public/no-photo.webp'

interface IProductCardDetailsModalProps {
    producto: IProducto;
    setShowDetailsModal: Dispatch<SetStateAction<boolean>>;
}

export const ProductCardDetailsModal: FC<IProductCardDetailsModalProps> = ({ producto, setShowDetailsModal }) => {
    const [showInfo, setShowInfo] = useState(false)
    return createPortal(
        <div className='modal-overlay' onClick={() => { setShowDetailsModal(false) }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.imgContainer}>
                        <img src={producto.urlImagen ? producto.urlImagen : noPhoto} height={'100%'} />
                    </div>
                    <p>{producto.titulo}</p>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.tagsContainer}>
                        <p onClick={(e) => { e.stopPropagation(); setShowInfo(false) }} className={`${styles.tag} ${showInfo ? '' : styles.activeTag}`}>Descripción</p>
                        <p onClick={(e) => { e.stopPropagation(); setShowInfo(true) }} className={`${styles.tag} ${showInfo ? styles.activeTag : ''}`}>Información</p>
                    </div>
                    <div className={styles.bodyContent}>
                        {
                            showInfo ?
                                <div className={styles.infoContent}>
                                    <p>SKU: {producto.sku}</p>
                                    <p>En stock: {producto.stock}</p>
                                    <p>Marca: {producto.marca}</p>
                                    <p>Precio: $ {producto.precioVenta.toLocaleString('es-AR')}</p>
                                    {producto.porcentajeOferta ? <p>Precio por oferta: $ {(producto.precioVenta - (producto.precioVenta * (producto.porcentajeOferta / 100))).toLocaleString('es-AR')}</p> : <></>}
                                </div>
                                :
                                <div className={styles.descriptionContent}>
                                    <p>{producto.descripcion}</p>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
        , document.getElementById('modal')!
    )
}
