import { useNavigate, useParams } from 'react-router-dom'
import styles from './ProductScreen.module.css'
import { useProducto } from '../../../hooks/useProducto';
import { useEffect, useState } from 'react';
import type { IProducto } from '../../../types/IProducto';
import noPhoto from '../../../../public/no-photo.webp'
import type { ICarritoItem } from '../../../types/ICarritoItem';
import { v4 as uuidv4 } from 'uuid'
import { useCarrito } from '../../../hooks/useCarrito';
import { SlideNotification } from '../../UI/SlideNotification/SlideNotification';
import { CarouselProducts } from '../../UI/CarouselProducts/CarouselProducts';
import { ProductCard } from '../../UI/ProductCard/ProductCard';
import { mediaStore } from '../../../store/mediaStore';

export const ProductScreen = () => {
    const isMobile = mediaStore((state) => state.isMobile)

    const { añadirItem, mensajeNotificacion, color } = useCarrito();

    const navigate = useNavigate()
    const { product } = useParams();
    const { getProductoById, getProductosByCategoriaId, getProductosBySearch } = useProducto()
    const [producto, setProducto] = useState<IProducto | null>(null)
    const [productosCategoria, setProductosCategoria] = useState<IProducto[]>([])
    const [productosMarca, setProductosMarca] = useState<IProducto[]>([])

    const handleGetProducto = async () => {
        if (product) {
            const productById = await getProductoById(product)
            if (productById) {
                setProducto(productById)
            } else {
                alert('Producto no encontrado')
                navigate('/home')
            }
        } else {
            alert('Producto no encontrado')
            navigate('/home')
        }
    }

    const handleGetSimilares = async () => {
        if (producto) {
            const pCategoria = await getProductosByCategoriaId(producto.categoria.id!)
            const pMarca = await getProductosBySearch(producto.marca)
            setProductosCategoria(pCategoria?.filter((p) => p.id !== producto.id) ?? [])
            setProductosMarca(pMarca?.filter((p) => p.id !== producto.id) ?? [])
        }
    }

    useEffect(() => {
        handleGetProducto()
    }, [product])

    useEffect(() => {
        handleGetSimilares()
    }, [producto])

    useEffect(() => {
        setProducto(null)
    }, [])

    const [cuantity, setCuantity] = useState(1)

    const calculatePrecio = (producto: IProducto): number => {
        if (producto.porcentajeOferta) {
            return ((producto.precioVenta - (producto.precioVenta * producto.porcentajeOferta / 100)))
        } else {
            return producto.precioVenta
        }
    }

    const calculateSubtotal = (producto: IProducto, cantidad: number): number => {
        if (producto.porcentajeOferta) {
            return ((producto.precioVenta - (producto.precioVenta * producto.porcentajeOferta / 100)) * cantidad)
        } else {
            return producto.precioVenta * cantidad
        }
    }

    const [showDetails, setShowDetails] = useState(true)

    const handleAddToShoppingCart = () => {
        const carritoItem: ICarritoItem = {
            id: uuidv4(),
            producto: producto!,
            cantidad: cuantity,
            subtotal: calculateSubtotal(producto!, cuantity)
        }
        añadirItem(carritoItem)
        setCuantity(1)
    }

    return (
        <div className={styles.background}>
            <div className={styles.productContainer}>
                {producto?.porcentajeOferta && <div className={styles.onSaleTag}>OFERTA</div>}
                <div className={styles.imgContainer} >
                    <img src={producto?.urlImagen ? producto.urlImagen : noPhoto} style={isMobile ? {maxHeight: '100%' } : { maxWidth: '100%' }} />
                </div>
                <div className={styles.productInfo}>
                    <div className={styles.productTitle}>
                        <h3>{producto?.titulo}</h3>
                    </div>
                    <div className={styles.productPriceAndAdd}>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <div className={styles.productPrice}>
                                <p className={producto?.porcentajeOferta ? styles.onSalePrice : ''}>$ {producto?.precioVenta.toLocaleString('es-AR')}</p>
                                {producto?.porcentajeOferta && <p>$ {calculatePrecio(producto).toLocaleString('es-AR')}</p>}
                            </div>
                            <div className={styles.inputWrapper}>
                                <p>Cantidad:</p>
                                <span className={styles.inputButton} onClick={() => { if (cuantity > 1) setCuantity(cuantity - 1) }}>-</span>
                                <input
                                    type='number'
                                    name='cuantity'
                                    value={cuantity}
                                    className={styles.cuantityInput}
                                    onChange={(e) => {
                                        const value = Number(e.target.value)
                                        if (value >= 1 && value <= producto?.stock!) {
                                            setCuantity(value)
                                        }
                                    }}
                                />
                                <span className={styles.inputButton} onClick={() => { if (cuantity < producto!.stock) setCuantity(cuantity + 1); }}>+</span>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <button className={styles.shoppingCartButton} onClick={() => handleAddToShoppingCart()}>
                                <span style={{ fontSize: '30px' }} className="material-symbols-outlined">add_shopping_cart</span>
                                <p style={isMobile ? { fontSize: '10px' } : { fontSize: '20px' }}>AÑADIR AL CARRITO</p>
                            </button>
                        </div>
                    </div>
                    <div className={styles.productDetails}>
                        <div className={styles.productDetailsHeader}>
                            <p className={showDetails ? styles.activeDetailsTag : ''} onClick={() => setShowDetails(!showDetails)}>Detalles del producto</p>
                            <p className={showDetails ? '' : styles.activeDetailsTag} onClick={() => setShowDetails(!showDetails)}>Descripción del producto</p>
                        </div>
                        <div className={styles.productDetailsContent}>
                            {showDetails
                                ?
                                <div className={styles.detailsList}>
                                    <p style={{ display: 'flex', gap: '5px' }}>Marca: <p className={styles.listClickeable} style={{ color: 'var(--blue)' }} onClick={() => navigate(`/browse?search=${producto?.marca}`)} >{producto?.marca}</p></p>
                                    <p style={{ display: 'flex', gap: '5px' }}>Categoría: <p className={styles.listClickeable} style={{ color: 'var(--blue)' }} onClick={() => navigate(`/browse-categories/${producto?.categoria.id}`)}>{producto?.categoria.nombre}</p></p>
                                    <p>SKU: {producto?.sku}</p>
                                    <p>En stock: <b>{producto?.stock} productos</b></p>
                                </div>
                                :
                                <div className={styles.detailsDescription}>
                                    <p>{producto?.descripcion}</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.otherProducts}>
                {productosCategoria.length > 0 &&
                    <div className={styles.section}>
                        <div className={styles.sectionTitle} onClick={() => navigate(`/browse-categories/${producto?.categoria.id}`)}>
                            <h3>Productos similares</h3>
                            <div className={styles.titleHr}></div>
                        </div>
                        {isMobile
                            ?
                            <div style={{ display: 'grid', gridTemplateColumns: productosCategoria.length > 1 ? 'repeat(2, 1fr)' : '1fr', gap: '10px' }}>
                                {productosCategoria.map((p, i) => (
                                    <ProductCard key={i} producto={p} />
                                ))}
                            </div>
                            :
                            <CarouselProducts visibleCount={5}>
                                {productosCategoria.map((p, i) => (
                                    <ProductCard key={i} producto={p} />
                                ))}
                            </CarouselProducts>
                        }
                    </div>
                }
                {productosMarca.length > 0 &&
                    <div className={styles.section}>
                        <div className={styles.sectionTitle} onClick={() => navigate(`/browse?search=${producto?.marca}`)}>
                            <h3>Más de '{producto?.marca}'</h3>
                            <div className={styles.titleHr}></div>
                        </div>
                        {isMobile
                            ?
                            <div style={{ display: 'grid', gridTemplateColumns: productosMarca.length > 1 ? 'repeat(2, 1fr)' : '1fr', gap: '10px' }}>
                                {productosMarca.map((p, i) => (
                                    <ProductCard key={i} producto={p} />
                                ))}
                            </div>
                            :
                            <CarouselProducts visibleCount={5}>
                                {productosMarca.map((p, i) => (
                                    <ProductCard key={i} producto={p} />
                                ))}
                            </CarouselProducts>
                        }
                    </div>
                }
            </div>
            {mensajeNotificacion && (
                <SlideNotification mensaje={mensajeNotificacion} color={color} />
            )}
        </div >
    )
}
