import { useEffect, type FC } from 'react'
import { useCategoria } from '../../../hooks/useCategoria'
import styles from './CategoriesHorizontalList.module.css'
import type { ICategoria } from '../../../types/ICategoria'
import { useNavigate } from 'react-router-dom'

interface ICategoriesHorizontalListProps {
    categorias: ICategoria[]
}

export const CategoriesHorizontalList: FC<ICategoriesHorizontalListProps> = ({ categorias }) => {
    const { getCategoriasHabilitadas } = useCategoria()
    const navigate = useNavigate();

    useEffect(() => {
        getCategoriasHabilitadas()
    }, [])

    return (
        <div className={styles.container} hidden={categorias?.length > 0 ? false : true}>
            <div className={styles.scrolleableWrapper}>
                <div className={styles.scrolleable}>
                    <div className={styles.categoriaContainer} onClick={() => navigate(`/browse-categories/ofertas`)}>
                        <p>Ofertas</p>
                    </div>
                    {categorias.map((c) => (
                        <div key={c.id} className={styles.categoriaContainer} onClick={() => navigate(`/browse-categories/${c.id}`)}>
                            <p>{c.nombre}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
