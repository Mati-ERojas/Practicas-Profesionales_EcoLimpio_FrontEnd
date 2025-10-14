import { useShallow } from "zustand/shallow"
import { usuarioStore } from "../store/usuarioStore"
import type { ILoginRequest } from "../types/ILoginRequest"
import { loginUsuarioHttp } from "../http/authHttp"
import { createUsuarioHttp, deleteUsuarioHttp, getUsuarioByEmailHttp, getUsuarioByIdHttp, getUsuariosHttp, toggleHabilitadoUsuarioHttp } from "../http/usuarioHttp"
import type { IUsuario } from "../types/IUsuario"
import { CustomSwal } from "../components/UI/CustomSwal/CustomSwal"

export const useUsuario = () => {
    const { setUsuarios, añadirUsuario, eliminarUsuario, actualizarUsuario, setUsuarioLogeado } = usuarioStore(useShallow((state) => ({
        setUsuarios: state.setUsuarios,
        añadirUsuario: state.añadirUsuario,
        eliminarUsuario: state.eliminarUsuario,
        actualizarUsuario: state.actualizarUsuario,
        setUsuarioLogeado: state.setUsuarioLogeado
    })))

    const loginUsuario = async (datosLogin: ILoginRequest): Promise<boolean> => {
        try {
            const token = await loginUsuarioHttp(datosLogin);
            if (!token) throw new Error("No se obtuvo ningun token al intentar logear")
            localStorage.setItem('token', token!)

            const usuario = await getUsuarioByEmailHttp(datosLogin.email)
            if (!usuario) {
                console.warn("No se encontro el usuario correspondiente al login en la BD")
                return false;
            }
            localStorage.setItem('usuarioLogeado', usuario.id!)
            setUsuarioLogeado(usuario)
            return true;
        } catch (error) {
            console.error("Error en loginUsuario: ", error);
            localStorage.removeItem('token')
            return false;
        }
    }

    const getUsuarioById = async (idUsuario: string): Promise<IUsuario | undefined> => {
        try {
            const usuario = await getUsuarioByIdHttp(idUsuario)
            if (!usuario) throw new Error;
            return usuario;
        } catch (error) {
            console.error("Error en getUsuarioById", error);
        }
    }

    const getUsuarios = async (): Promise<void> => {
        try {
            const usuarios = await getUsuariosHttp();
            if (usuarios) {
                setUsuarios(usuarios)
            }
        } catch (error) {
            console.error("Error en getUsuarios", error)
        }
    }

    const addUsuario = async (usuario: IUsuario): Promise<boolean> => {
        try {
            const createdUser = await createUsuarioHttp(usuario);

            if (!createdUser) {
                console.warn("Error al crear usuario. Puede que el correo ya exista.")
                return false;
            }

            añadirUsuario(createdUser);
            console.log(createdUser)
            getUsuarios();
            return true;
        } catch (error) {
            console.error("Error en addUsuario", error)
            return false;
        }
    }

    const enableDisableUsuario = async (idUsuario: string): Promise<void> => {
        try {
            await toggleHabilitadoUsuarioHttp(idUsuario);
            await getUsuarios();
        } catch (error) {
            console.error("Error al alterar el estado del usuario", error)
        }
    }

    const deleteUsuario = async (idUsuario: string): Promise<void> => {
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
                const success = await deleteUsuarioHttp(idUsuario);
                if (success) { eliminarUsuario(idUsuario); }
            } else {
                return;
            }
        } catch (error) {
            CustomSwal.fire("Error", "No se pudo eliminar el usuario", "error");
            console.error('Error en deleteUsuario', error)
        }
    }
    return {
        loginUsuario,
        getUsuarioById,
        getUsuarios,
        addUsuario,
        enableDisableUsuario,
        deleteUsuario
    }
}