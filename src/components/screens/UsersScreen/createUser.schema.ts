import * as yup from 'yup'

export const createUserSchema = yup.object().shape({
    name: yup.string().required('Campo obligatorio'),
    email: yup.string().required('Campo obligatorio').email('Correo inválido'),
    password: yup.string().required('Campo obligatorio').min(3, 'Mínimo 3 caracteres'),
    confirmPassword: yup.string().required('Campo obligatorio').oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
    rol: yup.string().required('Campo obligatorio').oneOf(['ADMIN', 'VENTAS'], 'Rol inválido')
})