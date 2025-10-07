import * as yup from 'yup'

export const productFormSchema = yup.object().shape({
    sku: yup.string().matches(/^[0-9]+$/, 'Solo se admiten números').required('El campo es obligatorio'),
    titulo: yup.string().required('El campo es obligatorio'),
    precioCompra: yup.number().moreThan(0, 'Debe ser mayor a 0').required('El campo es obligatorio'),
    precioVenta: yup.number().moreThan(0, 'Debe ser mayor a 0').required('El campo es obligatorio'),
    descripcion: yup.string().required('El campo es obligatorio'),
    marca: yup.string().required('El campo es obligatorio'),
    stock: yup.number().required('El campo es obligatorio'),
    porcentajeOferta: yup.number().nullable().moreThan(0, 'Debe ser mayor a 0').lessThan(100, 'Debe ser menor a 100').notRequired(),
    categoriaId: yup.string().required('El campo es obligatorio')
})