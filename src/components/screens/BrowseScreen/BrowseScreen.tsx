import { useSearchParams } from 'react-router-dom'
import styles from './BrowseScreen.module.css'
import { useEffect, useState } from 'react'
import { useProducto } from '../../../hooks/useProducto'
import type { IProducto } from '../../../types/IProducto'
import { ProductCard } from '../../UI/ProductCard/ProductCard'

export const BrowseScreen = () => {
    const [searchParamas] = useSearchParams()
    const search = searchParamas.get('search')

    const [filter, setFilter] = useState('null')

    const { getProductosBySearch } = useProducto()
    const [productos, setProductos] = useState<IProducto[]>([])

    const handleGetProductos = async () => {
        const productosSearch = await getProductosBySearch(search ?? '')
        if (productosSearch) {
            setProductos(productosSearch)
        }
    }
    useEffect(() => {
        setFilter('null')
        handleGetProductos()
    }, [search])

    const calculatePrecio = (producto: IProducto): number => {
        if (producto.porcentajeOferta) {
            return ((producto.precioVenta - (producto.precioVenta * producto.porcentajeOferta / 100)))
        } else {
            return producto.precioVenta
        }
    }

    useEffect(() => {
        if (filter === 'null') handleGetProductos();

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
            <div className={styles.contentHeader}>
                <h3>Resultados para: '{search}'</h3>
                <div className={styles.headerGroup}>
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
    )
}
