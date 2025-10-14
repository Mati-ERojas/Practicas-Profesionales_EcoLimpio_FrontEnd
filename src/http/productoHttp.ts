import axios from "axios";
import type { IProducto } from "../types/IProducto"
import axiosAuth from './axios.config.ts'


const apiUrlHttp = '/productos'
const apiUrlNoAuth = import.meta.env.VITE_API_URL + "/productos";

export const getProductosHttp = async (): Promise<IProducto[] | undefined> => {
    try {
        const response = await axiosAuth.get<IProducto[]>(apiUrlHttp);
        return response.data;
    } catch (error) {
        console.error('Problemas en getProductosHttp', error);
        throw error;
    }
}

export const getProductosHabilitadosHttp = async (): Promise<IProducto[] | undefined> => {
    try {
        const response = await axios.get<IProducto[]>(apiUrlNoAuth + '/getEnabled');
        return response.data;
    } catch (error) {
        console.error('Problemas en getProductosHabilitadosHttp', error);
        throw error;
    }
}

export const createProductoHttp = async (producto: IProducto): Promise<IProducto | undefined> => {
    try {
        const response = await axiosAuth.post<IProducto>(apiUrlHttp, producto);
        return response.data;
    } catch (error) {
        console.error("Problemas en createProductoHttp", error);
        throw error;
    }
};

export const updateProductoHttp = async (producto: IProducto): Promise<IProducto | undefined> => {
    try {
        const response = await axiosAuth.put<IProducto>(apiUrlHttp, producto)
        return response.data
    } catch (error) {
        console.error("Problemas en updateProductoHttp", error)
        throw error;
    }
}

export const updateImagenProductoHttp = async (productoId: string, imagen: File): Promise<IProducto | undefined> => {
    try {
        const formData = new FormData();
        formData.append("archivo", imagen);
        console.log(productoId, formData)
        const response = await axiosAuth.patch<IProducto>(`${apiUrlHttp}/${productoId}/imagen`, formData);
        return response.data;
    } catch (error) {
        console.error("Problemas en updateImagenProductoHttp", error)
        throw error;
    }
}

export const deleteProductoHttp = async (productoId: string): Promise<string | undefined> => {
    try {
        const response = await axiosAuth.delete<string>(apiUrlHttp + `/${productoId}`);
        return response.data;
    } catch (error) {
        console.error("Problemas en deleteProductoHttp", error)
        throw error;
    }
}

export const toggleHabilitadoProductoHttp = async (productoId: string): Promise<string | undefined> => {
    try {
        const response = await axiosAuth.patch(`${apiUrlHttp}/toggle-habilitado/${productoId}`)
        return response.data;
    } catch (error) {
        console.error('Problemas en toggleHabilitadoProductoHttp', error)
        throw error;
    }
}