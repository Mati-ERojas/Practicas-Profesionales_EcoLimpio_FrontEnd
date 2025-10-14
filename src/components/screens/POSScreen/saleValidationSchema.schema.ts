import * as yup from 'yup'

export const saleValidationSchema = yup.object({
    venta: yup.object({
        fecha: yup.string().required(),
        vendedor: yup.object().required(),
        total: yup.number().moreThan(0).required()
    }),
    detallesVenta: yup.array().min(1)
})