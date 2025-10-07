import { useShallow } from "zustand/shallow"
import { categoriaStore } from "../store/categoriaStore"
import { createCategoriaHttp, deleteCategoriaHttp, getCategoriaByIdHttp, getCategoriasHabilitadasHttp, getCategoriasHttp, toggleHabilitadoCategoriaHttp } from "../http/categoriasHttp"
import type { ICategoria } from "../types/ICategoria"
import { CustomSwal } from "../components/UI/CustomSwal/CustomSwal"


export const useCategoria = () => {

    const { setCategorias, setCategoriasHabilitadas, añadirCategoria, eliminarCategoria } = categoriaStore(useShallow((state) => ({
        setCategorias: state.setCategorias,
        setCategoriasHabilitadas: state.setCategoriasHabilitadas,
        añadirCategoria: state.añadirCategoria,
        eliminarCategoria: state.eliminarCategoria
    })))

    const getCategorias = async (): Promise<void> => {
        try {
            const data = await getCategoriasHttp();
            if (data) {
                setCategorias(data);
            }
        } catch (error) {
            console.error("Error en getCategorias: ", error)
        }
    }

    const getCategoriasHabilitadas = async (): Promise<void> => {
        try {
            const data = await getCategoriasHabilitadasHttp();
            if (data) {
                setCategoriasHabilitadas(data);
            }
        } catch (error) {
            console.error("Error en getCategoriasHabilitadas: ", error)
        }
    }

    const getCategoriaById = async (idCategoria: string): Promise<ICategoria | undefined> => {
        try {
            const categoria = await getCategoriaByIdHttp(idCategoria);
            if (!categoria) throw new Error;
            return categoria;
        } catch (error) {
            console.error("Error en getCategoriaById", error)
        }
    }

    const createCategoria = async (categoria: ICategoria): Promise<boolean> => {
        try {
            const data = await createCategoriaHttp(categoria);
            if (data) {
                añadirCategoria(data);
                CustomSwal.fire("Éxito", "Categoria creada correctamete", "success")
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error en createCategoria: ", error)
            CustomSwal.fire("Error", "No se pudo crear la categoria", "error");
            return false;
        }
    }

    const deleteCategoria = async (idCategoria: string): Promise<void> => {
        try {
            const result = await CustomSwal.fire({
                title: '¿Estás seguro?',
                text: "Esto podría generar problemas. Es recomendable solo deshabilitar.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar"
            });

            if (result.isConfirmed) {
                const success = await deleteCategoriaHttp(idCategoria);
                if (success) { eliminarCategoria(idCategoria); }
            } else {
                return;
            }
        } catch (error) {
            CustomSwal.fire("Error", "No se pudo eliminar la categoria", "error");
            console.error("Error en deleteCategoria: ", error)
        }
    }

    const enableDisableCategoria = async (idCategoria: string): Promise<void> => {
        try {
            await toggleHabilitadoCategoriaHttp(idCategoria)
            await getCategorias()
        } catch (error) {
            console.error("Error al alterar el estado de la categoria: ", error)
        }
    }

    return {
        getCategorias,
        getCategoriasHabilitadas,
        getCategoriaById,
        createCategoria,
        deleteCategoria,
        enableDisableCategoria
    }
}