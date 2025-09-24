import type { ICategoria } from "./ICategoria";

export interface IProducto {
    id?: string;
    habilitado?: boolean;
    sku: string;
    titulo: string;
    precioCompra: number;
    precioVenta: number;
    descripcion: string;
    marca: string;
    stock: number;
    porcentajeOferta: number;
    categoria: ICategoria;
    publicId?: string;
    urlImagen?: string;
    imagen?: File;
}