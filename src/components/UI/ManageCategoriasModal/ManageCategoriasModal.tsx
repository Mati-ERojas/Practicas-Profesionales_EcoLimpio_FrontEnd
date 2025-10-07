import { useEffect, useState, type Dispatch, type FC, type SetStateAction } from 'react';
import styles from './ManageCategoriasModal.module.css'
import { useCategoria } from '../../../hooks/useCategoria';
import type { ICategoria } from '../../../types/ICategoria';
import { categoriaStore } from '../../../store/categoriaStore';

interface IManageCategoriasModalProp {
    setOpenModalCategorias: Dispatch<SetStateAction<boolean>>;
}
export const ManageCategoriasModal: FC<IManageCategoriasModalProp> = ({ setOpenModalCategorias }) => {
    const categorias = categoriaStore((state) => state.categorias)
    const { getCategorias, createCategoria, deleteCategoria, enableDisableCategoria } = useCategoria();
    const [categoriaInput, setCategoriaInput] = useState("")
    const [creatingCategoria, setCreatingCategoria] = useState(false)

    useEffect(() => {
        getCategorias()
    }, [])

    const handleCreateCategoria = async () => {
        const categoria: ICategoria = {
            nombre: categoriaInput
        }
        setCreatingCategoria(true)
        await createCategoria(categoria)
        setCategoriaInput("")
        setCreatingCategoria(false)
    }
    const handleToggleCategoria = async (idCategoria: string) => {
        await enableDisableCategoria(idCategoria)
    }
    const handleDeleteCategoria = async (idCategoria: string) => {
        await deleteCategoria(idCategoria)
    }

    return (
        <div className="modal-overlay">
            <div className={styles.modal}>
                <h3>Categorias</h3>
                <div className={styles.containerInput}>
                    <input type='text'
                        name='categoriaInput'
                        placeholder='Nombre de la categoria'
                        onChange={(e) => setCategoriaInput(e.target.value)}
                        value={categoriaInput}
                        autoComplete='off'
                        className={styles.categoriaInput}
                    />
                    <button className={styles.iconButton} onClick={() => handleCreateCategoria()} disabled={creatingCategoria}>
                        <span className="material-symbols-outlined" >
                            add_box
                        </span>
                    </button>
                </div>
                <hr />
                <div className={styles.containerCategorias}>
                    {categorias.length > 0 ? categorias.map((categoria) => (
                        <div key={categoria.id} className={styles.categoriaContainer}>
                            <h3>{categoria.nombre}</h3>
                            <div className={styles.habilitado}>
                                <p>Habilitado: </p>
                                {categoria.habilitado ? <span className="material-icons" onClick={() => handleToggleCategoria(categoria.id!)}>
                                    check_box
                                </span> : <span className="material-icons" onClick={() => handleToggleCategoria(categoria.id!)}>
                                    check_box_outline_blank
                                </span>}
                            </div>
                            <span className={`material-icons ${styles.delete}`} onClick={() => handleDeleteCategoria(categoria.id!)}> delete </span>
                        </div>
                    )) : <p className={styles.tituloSinCategorias}>No hay categorias</p>}
                </div>
                <div className={styles.buttonContainer}>
                    <button onClick={() => setOpenModalCategorias(false)} >Cerrar</button>
                </div>
            </div>
        </div >
    )
}
