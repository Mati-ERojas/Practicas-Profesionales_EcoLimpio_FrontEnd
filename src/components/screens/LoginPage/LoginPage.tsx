import styles from './LoginPage.module.css'
import logo from '../../../assets/ecoLimpio-Icon.png'
import { useState } from 'react'
import { useFormik } from 'formik'
import { loginFormSchema } from './loginForm.schema'
import { navigateTo } from '../../../routes/navigation'
import { useUsuario } from '../../../hooks/useUsuario'

export const LoginPage = () => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { loginUsuario } = useUsuario();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        }, validationSchema: loginFormSchema,
        onSubmit: async (values) => {
            setLoading(true)
            const success = await loginUsuario(values);
            if (success) {
                navigateTo("/menu")
            } else {
                alert("Correo o contraseña incorrectos")
            }
            setLoading(false)
        }
    })
    return (
        <div>
            <div className={styles.headerFooter}>
                <img src={logo} alt='Logo' />
                <div className={styles.titleContainer}>
                    <h1>Eco</h1>
                    <h1>Limpio</h1>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.formHeader}>
                    <span className='material-icons'>account_circle</span>
                    <h2>Iniciar Sesión</h2>
                </div>
                <form className={styles.form} onSubmit={formik.handleSubmit}>
                    <div className={styles.inputsContainer} >
                        <div className={styles.inputWrapper}>
                            <p>Email</p>
                            <input type='text'
                                name='email'
                                placeholder=''
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                autoComplete='off'
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className={styles.error}>{formik.errors.email}</div>
                            )}
                        </div>
                        <div className={styles.inputWrapper}>
                            <p>Contraseña</p>
                            <input type={showPassword ? 'text' : 'password'}
                                name='password'
                                placeholder=''
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                autoComplete='off'
                            />
                            {showPassword ? <span className='material-icons' onClick={() => setShowPassword(!showPassword)}>visibility_off</span>
                                : <span className='material-icons' onClick={() => setShowPassword(!showPassword)}>visibility</span>}
                            {formik.touched.password && formik.errors.password && (
                                <div className={styles.error}>{formik.errors.password}</div>
                            )}
                        </div>
                    </div>
                    <div className={styles.buttonsContainer}>
                        <button type='submit' className={styles.acceptButton} disabled={!(formik.isValid && formik.dirty) || loading} hidden={loading} >Iniciar sesión</button>
                        <button disabled={loading} className={styles.cancelButton} onClick={() => { navigateTo("/home") }} hidden={loading} >Cancelar</button>
                    </div>
                </form>
                <div className={styles.spinner} hidden={!loading}></div>
            </div>
            <div className={styles.headerFooter}>
            </div>
        </div>
    )
}
