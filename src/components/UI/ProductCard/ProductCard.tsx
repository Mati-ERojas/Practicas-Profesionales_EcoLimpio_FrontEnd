import { useEffect, useState, type FC } from 'react'
import type { IProducto } from '../../../types/IProducto'
import styles from './ProductCard.module.css'
import noPhoto from '../../../../public/no-photo.webp'
import { SlideNotification } from '../SlideNotification/SlideNotification'
import { useCarrito } from '../../../hooks/useCarrito'
import type { ICarritoItem } from '../../../types/ICarritoItem'
import { v4 as uuidv4 } from 'uuid'
import { ProductCardDetailsModal } from '../ProductCardDetailsModal/ProductCardDetailsModal'
import { useNavigate } from 'react-router-dom'

interface IProductCardProps {
    producto: IProducto
}

export const ProductCard: FC<IProductCardProps> = ({ producto }) => {
    const navigate = useNavigate()

    const { añadirItem, mensajeNotificacion, color } = useCarrito();

    const [activeAddButton, setActiveAddButton] = useState(false);
    const [mostrarDetalles, setMostrarDetalles] = useState(true);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [cuantity, setCuantity] = useState(1)

    useEffect(() => {
        if (activeAddButton) {
            // Desaparece inmediatamente
            setMostrarDetalles(false);
        } else {
            // Espera 300ms (duración de la animación del otro botón)
            const timeout = setTimeout(() => setMostrarDetalles(true), 300);
            return () => clearTimeout(timeout);
        }
    }, [activeAddButton]);

    const calculateSubtotal = (producto: IProducto, cantidad: number): number => {
        if (producto.porcentajeOferta) {
            return ((producto.precioVenta - (producto.precioVenta * producto.porcentajeOferta / 100)) * cantidad)
        } else {
            return producto.precioVenta * cantidad
        }
    }

    const handleAddToShoppingCart = () => {
        if (activeAddButton) {
            const carritoItem: ICarritoItem = {
                id: uuidv4(),
                producto: producto,
                cantidad: cuantity,
                subtotal: calculateSubtotal(producto, cuantity)
            }
            añadirItem(carritoItem)
            setActiveAddButton(false)
            setCuantity(1)
        } else {
            setActiveAddButton(true)
        }
    }
    return (
        <div className={styles.cardContainer}>
            <div className={styles.cardContent}>
                <div className={styles.imgContainer} onClick={() => navigate(`/product/${producto.id}`)}>
                    <img src={producto.urlImagen ? producto.urlImagen : noPhoto} height='100%' />
                </div>
                <div className={styles.titleContainer}>
                    <p>{producto.titulo}</p>
                </div>
                <div className={styles.priceContainer}>
                    {producto.porcentajeOferta ?
                        <div style={{ width: '100%' }}>
                            <p className={styles.onSalePrice}>$ {producto.precioVenta.toLocaleString('es-AR')}</p>
                            <p className={styles.onSaleDiscountedPrice}>$ {producto.precioVenta - (producto.precioVenta * (producto.porcentajeOferta / 100))} - {producto.porcentajeOferta}%</p>
                        </div>
                        :
                        <p >$ {producto.precioVenta.toLocaleString('es-AR')}</p>
                    }
                </div>
            </div>
            <div className={styles.cardButtons}>
                <button className={`${activeAddButton ? styles.activeAddButton : styles.addButton}`}>
                    <p onClick={() => handleAddToShoppingCart()}>Agregar</p>
                    <div className={styles.buttonHr} style={{ display: activeAddButton ? '' : 'none' }} />
                    <div className={styles.inputContainer} style={{ display: activeAddButton ? '' : 'none' }}>
                        <span className={styles.inputButton} onClick={() => { if (cuantity > 1) setCuantity(cuantity - 1) }}>-</span>
                        <input
                            type='number'
                            style={{ display: activeAddButton ? '' : 'none' }}
                            value={cuantity}
                            min={1}
                            max={producto.stock}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 1 && value <= producto.stock) {
                                    setCuantity(value);
                                }
                            }}
                        />
                        <span className={styles.inputButton} onClick={() => { if (cuantity < producto.stock) setCuantity(cuantity + 1); }}>+</span>
                    </div>
                </button>
                {mostrarDetalles && (
                    <button className={styles.detailsButton} onClick={() => setShowDetailsModal(true)}>Detalles</button>
                )}
            </div>
            {producto.porcentajeOferta && <div className={styles.onSaleTag}>OFERTA</div>}
            {mensajeNotificacion && (
                <SlideNotification mensaje={mensajeNotificacion} color={color} />
            )}
            {showDetailsModal && <ProductCardDetailsModal producto={producto} setShowDetailsModal={setShowDetailsModal} />}
        </div >
    )
}
