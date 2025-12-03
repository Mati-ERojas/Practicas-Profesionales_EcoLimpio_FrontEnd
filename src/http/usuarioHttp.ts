import type { IUsuario } from '../types/IUsuario.ts'
import axiosAuth from './axios.config.ts'

const apiUrlHttp = "/usuarios"

export const getUsuarioByEmailHttp = async (email: string): Promise<IUsuario | undefined> => {
    try {
        const response = await axiosAuth.get<IUsuario>(apiUrlHttp + `/email/${email}`);
        return response.data;
    } catch (error) {
        console.error("Problemas en getUsuarioByEmailHttp", error);
        throw error;
    }
}

export const getUsuarioByIdHttp = async (idUsuario: string): Promise<IUsuario | undefined> => {
    try {
        const response = await axiosAuth.get<IUsuario>(apiUrlHttp + `/${idUsuario}`)
        return response.data;
    } catch (error) {
        console.error("Problemas en getUsuarioByIdHttp", error)
        throw error;
    }
}

export const getUsuariosHttp = async (): Promise<IUsuario[] | undefined> => {
    try {
        const response = await axiosAuth.get<IUsuario[]>(apiUrlHttp)
        return response.data;
    } catch (error) {
        console.error("Problemas en getUsuariosHttp", error)
        throw error;
    }
}

export const createUsuarioHttp = async (usuario: IUsuario): Promise<IUsuario | undefined> => {
    try {
        const response = await axiosAuth.post<IUsuario>(apiUrlHttp, usuario);
        return response.data;
    } catch (error) {
        console.error("Problemas en createUsuarioHttp", error)
        throw error;
    }
}

export const updateUsuarioHttp = async (usuario: IUsuario): Promise<IUsuario | undefined> => {
    try {
        const response = await axiosAuth.put(apiUrlHttp, usuario);
        return response.data;
    } catch (error) {
        console.error("Problemas en updateUsuarioHttp", error)
        throw error;
    }
}

export const toggleHabilitadoUsuarioHttp = async (idUsuario: string): Promise<string | undefined> => {
    try {
        const response = await axiosAuth.patch<string>(`${apiUrlHttp}/toggle-habilitado/${idUsuario}`)
        return response.data
    } catch (error) {
        console.error("Problemas en toggleHabilitadoUsuarioHttp", error)
        throw error;
    }
}

export const deleteUsuarioHttp = async (idUsuario: string): Promise<string | undefined> => {
    try {
        const response = await axiosAuth.delete<string>(apiUrlHttp + `/${idUsuario}`)
        return response.data;
    } catch (error) {
        console.error("Problemas en deleteUsuarioHttp", error)
        throw error;
    }
}