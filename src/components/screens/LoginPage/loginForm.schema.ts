import * as yup from 'yup'

export const loginFormSchema = yup.object().shape({
    email: yup.string().required('Campo obligatorio.').email('Ingrese un correo válido.'),
    password: yup.string().required('Campo obligatorio').min(3, 'Mínimo 3 caracteres.')
})