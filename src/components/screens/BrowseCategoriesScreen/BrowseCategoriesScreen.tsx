import { useNavigate, useParams } from 'react-router-dom'
import styles from './BrowseCategoriesScreen.module.css'
import { useEffect, useState } from 'react'
import { useCategoria } from '../../../hooks/useCategoria'
import type { IProducto } from '../../../types/IProducto'
import type { ICategoria } from '../../../types/ICategoria'
import { useProducto } from '../../../hooks/useProducto'
import { productoStore } from '../../../store/productoStore'
import { categoriaStore } from '../../../store/categoriaStore'
import { ProductCard } from '../../UI/ProductCard/ProductCard'
import { mediaStore } from '../../../store/mediaStore'

export const BrowseCategoriesScreen = () => {
    const isMobile = mediaStore((state) => state.isMobile)

    const [showCategories, setShowCategories] = useState(false)

    const navigate = useNavigate()
    const { category } = useParams()
    const { getCategoriaById, getCategoriasHabilitadas } = useCategoria()
    const { getProductosHabilitados, getProductosByCategoriaId } = useProducto()

    const productosHabilitados = productoStore((state) => state.productosHabilitados)
    const categoriasHabilitadas = categoriaStore((state) => state.categoriasHabilitadas)


    const [title, setTitle] = useState('')
    const [categoria, setCategoria] = useState<ICategoria | null>(null)
    const [productos, setProductos] = useState<IProducto[]>([])

    const [filter, setFilter] = useState('null')

    const handleGetCategoria = async () => {
        if (category) {
            if (category === 'ofertas') {
                setCategoria(null)
                await getProductosHabilitados();
                const productosOferta = productosHabilitados.filter((p) => p.porcentajeOferta != null)
                setProductos(productosOferta)
                setTitle('Ofertas')
            } else {
                const categoriaById = await getCategoriaById(category)
                if (categoriaById) {
                    setCategoria(categoriaById!)
                    setTitle(categoriaById!.nombre)
                    const productosByCategoria = await getProductosByCategoriaId(categoriaById!.id!)
                    setProductos(productosByCategoria!)
                } else {
                    setTitle('Seleccione una categoria')
                    setCategoria(null)
                    setProductos([])
                }
            }
        }
    }

    useEffect(() => {
        setFilter('null')
        getCategoriasHabilitadas()
    }, [])

    useEffect(() => {
        handleGetCategoria()
    }, [category])

    const calculatePrecio = (producto: IProducto): number => {
        if (producto.porcentajeOferta) {
            return ((producto.precioVenta - (producto.precioVenta * producto.porcentajeOferta / 100)))
        } else {
            return producto.precioVenta
        }
    }

    useEffect(() => {
        if (filter === 'null') handleGetCategoria();

        let productosOrdenados = [...productos];

        switch (filter) {
            case 'oferta':
                productosOrdenados.sort((a, b) => {
                    const aOferta = a.porcentajeOferta ?? 0;
                    const bOferta = b.porcentajeOferta ?? 0;
                    return bOferta - aOferta;
                });
                break;

            case 'AaZ':
                productosOrdenados.sort((a, b) => a.titulo.localeCompare(b.titulo));
                break;

            case 'ZaA':
                productosOrdenados.sort((a, b) => b.titulo.localeCompare(a.titulo));
                break;

            case 'menorAmayor':
                productosOrdenados.sort((a, b) => (calculatePrecio(a) ?? 0) - (calculatePrecio(b) ?? 0));
                break;

            case 'mayorAmenor':
                productosOrdenados.sort((a, b) => (calculatePrecio(b) ?? 0) - (calculatePrecio(a) ?? 0));
                break;
        }

        setProductos(productosOrdenados);
    }, [filter]);

    return (
        <div className={styles.background}>
            {!isMobile &&
                <div className={styles.sideSection}>
                    <div className={styles.sideHeader}>
                        <h3>Categorias</h3>
                    </div>
                    <div className={styles.sideList}>
                        <p
                            className={category === 'ofertas' ? styles.activeCategory : ''}
                            onClick={() => navigate(`/browse-categories/ofertas`)}
                        >Ofertas</p>
                        {categoriasHabilitadas.map((c) => (
                            <p
                                key={c.id}
                                className={c.id === categoria?.id ? styles.activeCategory : ''}
                                onClick={() => navigate(`/browse-categories/${c.id}`)}
                            >{c.nombre}</p>
                        ))}
                    </div>
                </div>
            }
            <div className={styles.content}>
                <div className={styles.contentHeader}>
                    {isMobile
                        ?
                        <div className={styles.headerTitleMobile} onClick={() => setShowCategories(!showCategories)}>
                            <h2>{title.toUpperCase()}</h2>
                            {showCategories ? <span className='material-icons'>keyboard_arrow_up</span> : <span className='material-icons'>keyboard_arrow_down</span>}
                            {showCategories &&
                                <div className={styles.categoriesContainer}>
                                    <p className={category === 'ofertas' ? styles.activeCategory : ''} onClick={() => navigate(`/browse-categories/ofertas`)}>Ofertas</p>
                                    {categoriasHabilitadas.map((c) => (
                                        <p
                                            key={c.id}
                                            className={c.id === categoria?.id ? styles.activeCategory : ''}
                                            onClick={() => navigate(`/browse-categories/${c.id}`)}
                                        >{c.nombre}</p>
                                    ))}
                                </div>
                            }
                        </div>
                        :
                        <div className={styles.headerTitle}>
                            <h2>{title.toUpperCase()}</h2>
                        </div>
                    }
                    <div className={styles.headerContent}>
                        <p className={styles.productCount}>Hay {productos.length} productos</p>
                        <div className={styles.selectWrapper}>
                            <p>Ordenar por: </p>
                            <select
                                name="filter"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="null">. . .</option>
                                <option value="oferta">Oferta</option>
                                <option value="AaZ">Nombre, A a Z</option>
                                <option value="ZaA">Nombre, Z a A</option>
                                <option value="menorAmayor">Precio, menor a mayor</option>
                                <option value="mayorAmenor">Precio, mayor a menor</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className={styles.contentBody}>
                    {productos.map((p) => (
                        <ProductCard key={p.id} producto={p} />
                    ))}
                    {productos.length > 0 ? <></> : <p className={styles.noProducts}>No hay productos!</p>}
                </div>
            </div>
        </div>
    )
}
