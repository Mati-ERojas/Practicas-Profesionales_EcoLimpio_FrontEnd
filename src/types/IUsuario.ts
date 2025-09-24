
export type Rol = "ADMIN" | "VENTAS";
export interface IUsuario {
    id?: string;
    habilitado?: boolean;
    email: string;
    nombre: string;
    password: string;
    rol: Rol;
}