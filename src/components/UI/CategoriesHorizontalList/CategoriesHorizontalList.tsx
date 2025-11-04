import { useEffect, type FC } from 'react'
import { useCategoria } from '../../../hooks/useCategoria'
import styles from './CategoriesHorizontalList.module.css'
import type { ICategoria } from '../../../types/ICategoria'

interface ICategoriesHorizontalListProps {
    categorias: ICategoria[]
}

export const CategoriesHorizontalList: FC<ICategoriesHorizontalListProps> = ({ categorias }) => {
    const { getCategoriasHabilitadas } = useCategoria()

    useEffect(() => {
        getCategoriasHabilitadas()
    }, [])

    return (
        <div className={styles.container} hidden={categorias?.length > 0 ? false : true}>
            <div className={styles.scrolleableWrapper}>
                <div className={styles.scrolleable}>
                    <div className={styles.categoriaContainer}>
                        <p>Ofertas</p>
                    </div>
                    {categorias.map((c) => (
                        <div key={c.id} className={styles.categoriaContainer}>
                            <p>{c.nombre}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
