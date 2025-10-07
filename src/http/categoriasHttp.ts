import axios from 'axios';
import type { ICategoria } from '../types/ICategoria'
import axiosAuth from './axios.config.ts'

const apiUrlHttp = '/categorias'
const apiNoAuthUrl = import.meta.env.VITE_API_URL + apiUrlHttp
export const getCategoriasHttp = async (): Promise<ICategoria[] | undefined> => {
    try {
        const response = await axiosAuth.get<ICategoria[]>(apiUrlHttp);
        return response.data;
    } catch (error) {
        console.error("Problemas en getCategoriasHttp", error)
        throw error;
    }
}

export const getCategoriasHabilitadasHttp = async (): Promise<ICategoria[] | undefined> => {
    try {
        const response = await axios.get<ICategoria[]>(apiNoAuthUrl + "/getEnabled");
        return response.data;
    } catch (error) {
        console.error("Problemas en getCategoriasHabilitadasHttp", error)
        throw error;
    }
}

export const getCategoriaByIdHttp = async (idCategoria: string): Promise<ICategoria | undefined> => {
    try {
        const response = await axiosAuth.get<ICategoria>(`${apiUrlHttp}/${idCategoria}`)
        return response.data;
    } catch (error) {
        console.error("Problemas en getCategoriaById", error)
        throw error;
    }
}

export const createCategoriaHttp = async (categoria: ICategoria): Promise<ICategoria | undefined> => {
    try {
        const response = await axiosAuth.post<ICategoria>(apiUrlHttp, categoria);
        return response.data;
    } catch (error) {
        console.error("Problemas en createCategoriaHttp", error)
        throw error;
    }
}

export const deleteCategoriaHttp = async (idCategoria: string): Promise<string | undefined> => {
    try {
        const response = await axiosAuth.delete<string>(apiUrlHttp + `/${idCategoria}`);
        return response.data;
    } catch (error) {
        console.error("Problemas en deleteCategoriaHttp", error)
        throw error;
    }
}

export const toggleHabilitadoCategoriaHttp = async (idCategoria: string): Promise<string | undefined> => {
    try {
        const response = await axiosAuth.patch<string>(`${apiUrlHttp}/toggle-habilitado/${idCategoria}`)
        return response.data;
    } catch (error) {
        console.error("Problemas en toggleHabilitadoCategoriaHttp", error)
        throw error;
    }
}
