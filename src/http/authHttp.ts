import axios from "axios";
import type { ILoginRequest } from "../types/ILoginRequest";

const apiUrlAuthController = import.meta.env.VITE_API_URL + "/auth";

interface AuthResponse {
    token: string;
}

export const loginUsuarioHttp = async (datosLogin: ILoginRequest): Promise<string | undefined> => {
    try {
        const response = await axios.post<AuthResponse>(apiUrlAuthController + "/login", datosLogin)
        return response.data.token;
    } catch (error) {
        console.error("Problemas en loginUsuarioHttp", error)
    }
}

export const validateTokenHttp = async (token: string): Promise<boolean | undefined> => {
    try {
        const response = await axios.get<boolean>(apiUrlAuthController + `/validarToken?token=${token}`)
        return response.data
    } catch (error) {
        console.error("Error al validar el token", error)
    }
}