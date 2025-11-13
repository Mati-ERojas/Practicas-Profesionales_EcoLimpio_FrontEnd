import { useEffect, useState } from 'react';
import { useProducto } from '../../../hooks/useProducto';
import { CarouselImagenes } from '../../UI/CarouselImagenes/CarouselImagenes'
import { CategoriesHorizontalList } from '../../UI/CategoriesHorizontalList/CategoriesHorizontalList'
import styles from './LandingPage.module.css'
import { productoStore } from '../../../store/productoStore';
import type { IProducto } from '../../../types/IProducto';
import { ProductCard } from '../../UI/ProductCard/ProductCard';
import { CarouselProducts } from '../../UI/CarouselProducts/CarouselProducts';
import { useCategoria } from '../../../hooks/useCategoria';
import { categoriaStore } from '../../../store/categoriaStore';
import { useNavigate } from 'react-router-dom';
import { mediaStore } from '../../../store/mediaStore';

export const LandingPage = () => {
    const isMobile = mediaStore((state) => state.isMobile)

    const navigate = useNavigate();
    const [search, setSearch] = useState('')

    const { getProductosHabilitados, getProductosByCategoriaId } = useProducto();

    const { getCategoriasHabilitadas } = useCategoria()
    const categorias = categoriaStore((state) => state.categoriasHabilitadas)

    const [productosEnOferta, setProductosEnOferta] = useState<IProducto[]>([])

    const productosHabilitados = productoStore((state) => state.productosHabilitados)
    useEffect(() => {
        getProductosHabilitados()
        getCategoriasHabilitadas()
    }, [])
    useEffect(() => {
        filterProductosEnOferta()
    }, [productosHabilitados])
    const filterProductosEnOferta = async () => {
        const productosOferta = productosHabilitados.filter((p) => p.porcentajeOferta != null)
        setProductosEnOferta(productosOferta)
    }

    const [productosPorCategoria, setProductosPorCategoria] = useState<Record<string, IProducto[]>>({});

    useEffect(() => {
        const fetchProductos = async () => {
            if (!categorias || categorias.length === 0) return;

            const resultados: Record<string, IProducto[]> = {};
            for (const c of categorias) {
                const productos = await getProductosByCategoriaId(c.id!);
                resultados[c.id!] = productos!;
            }

            setProductosPorCategoria(resultados);
        };

        fetchProductos();
    }, [categorias]);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.background}>
                <div className={styles.contentHeader}>
                    <CarouselImagenes />
                    <div className={styles.searchContainer}>
                        <span className="material-symbols-outlined">search</span>
                        <input
                            autoComplete='off'
                            name='search'
                            value={search}
                            type="search"
                            enterKeyHint='search'
                            className={styles.searchInput}
                            placeholder="¿Qué estás buscando?"
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    navigate(`/browse?search=${search}`)
                                }
                            }}
                        />
                    </div>
                    <CategoriesHorizontalList categorias={categorias} />
                </div>
                <div className={styles.contentBody}>
                    {productosHabilitados && productosHabilitados.length > 0 ? <></> : <div className={styles.noHayProductos}>Lo sentimos! No tenemos productos en stock</div>}
                    {productosEnOferta && productosEnOferta.length > 0
                        ?
                        <div className={styles.section}>
                            <div className={styles.sectionTitle} onClick={() => navigate('/browse-categories/ofertas')}>
                                <h3>Productos destacados</h3>
                                <div className={styles.titleHr}></div>
                            </div>
                            {isMobile
                                ?
                                <div style={{ display: 'grid', gridTemplateColumns: productosEnOferta.length > 1 ? 'repeat(2, 1fr)' : '1fr', gap: '10px' }}>
                                    {productosEnOferta.map((p, i) => (
                                        <ProductCard key={i} producto={p} />
                                    ))}
                                </div>
                                :
                                <CarouselProducts visibleCount={5} >
                                    {productosEnOferta.map((p, i) => (
                                        <ProductCard key={i} producto={p} />
                                    ))}
                                </CarouselProducts>
                            }

                        </div>
                        :
                        <></>
                    }
                    {categorias.map((c) => {
                        const productosCategoria = productosPorCategoria[c.id!] || [];
                        if (productosCategoria.length === 0) return null;
                        return (
                            <div key={c.id} className={styles.section}>
                                <div className={styles.sectionTitle} onClick={() => navigate(`/browse-categories/${c.id}`)}>
                                    <h3>{c.nombre}</h3>
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
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
