import { create } from "zustand";
import type { ICategoria } from "../types/ICategoria";

interface ICategoriaStore {
    categorias: ICategoria[];
    categoriasHabilitadas: ICategoria[];
    setCategorias: (categorias: ICategoria[]) => void;
    setCategoriasHabilitadas: (categorias: ICategoria[]) => void;
    añadirCategoria: (categoria: ICategoria) => void;
    eliminarCategoria: (idCategoria: String) => void;
}

export const categoriaStore = create<ICategoriaStore>((set) => ({
    categorias: [],
    categoriasHabilitadas: [],
    setCategorias: (categorias) => {
        set(() => ({ categorias: categorias }))
    },
    setCategoriasHabilitadas: (categorias) => {
        set(() => ({ categoriasHabilitadas: categorias }))
    },
    añadirCategoria: (categoriaNueva) => {
        set((state) => ({ categorias: [...state.categorias, categoriaNueva] }))
    },
    eliminarCategoria: (idCategoria) => {
        set((state) => ({ categorias: state.categorias.filter((categoria) => categoria.id !== idCategoria) }))
    }
}))