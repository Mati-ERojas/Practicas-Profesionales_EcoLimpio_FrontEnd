import axios from "axios";
import { validateTokenHttp } from "./authHttp";
import { navigateTo } from "../routes/navigation";
import { usuarioStore } from "../store/usuarioStore";
import { CustomSwal } from "../components/UI/CustomSwal/CustomSwal";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
        const esValido = await validateTokenHttp(token);
        if (esValido) {
            config.headers.Authorization = `Bearer ${token}`
        } else {
            navigateTo("/home")
            localStorage.removeItem("token");
            usuarioStore.setState({ usuarioLogeado: null });
            CustomSwal.fire(
                "Error",
                "La sesión ha expirado. Inicie sesión nuevamente",
                "warning"
            );
            throw new axios.Cancel("Token inválido o usuario no logueado")
        }
    }
    return config;
});

export default api;