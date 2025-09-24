import { useEffect, useState } from 'react'
import { usuarioStore } from '../../../store/usuarioStore'
import styles from './UsersScreen.module.css'
import { useUsuario } from '../../../hooks/useUsuario'
import { useFormik } from 'formik'
import { createUserSchema } from './createUser.schema'
import type { IUsuario, Rol } from '../../../types/IUsuario'

export const UsersScreen = () => {
    const usuarios = usuarioStore((state) => state.usuarios);
    const { getUsuarios, addUsuario, enableUnableUsuario, deleteUsuario } = useUsuario();
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getUsuarios();
    }, [])

    const handleToggleUsuario = async (idUsuario: string) => {
        enableUnableUsuario(idUsuario)
    }

    const handleDeleteUsuario = async (idUsuario: string) => {
        deleteUsuario(idUsuario)
    }
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            rol: "VENTAS"
        }, validationSchema: createUserSchema,
        onSubmit: async (values) => {
            const formatedValues: IUsuario = {
                email: values.email,
                nombre: values.name,
                password: values.password,
                rol: values.rol as Rol
            }
            setLoading(true)
            const success = await addUsuario(formatedValues);
            if (!success) {
                alert('Datos inválidos. Puede que el correo ya esté en uso')
                return;
            }
            formik.resetForm();
            setLoading(false)
        }
    })
    return (
        <div className={styles.background}>
            <div className={styles.header}>
                <h2>Gestión de usuarios</h2>
            </div>
            <div className={styles.content}>
                <div className={styles.usuariosSection}>
                    <div className={styles.sectionHeader}>
                        <p>Usuarios</p>
                    </div>
                    <div className={styles.usuariosList}>
                        {usuarios.length > 0 ? usuarios.map((usuario) => (
                            <div className={styles.usuarioCard} key={usuario.id}>
                                <div>
                                    <p><b>{usuario.nombre}</b></p>
                                    <p>{usuario.email}</p>
                                </div>
                                <div className={styles.habilitado}>
                                    <p>Habilitado: </p>
                                    {usuario.habilitado ? <span className="material-icons" onClick={() => handleToggleUsuario(usuario.id!)}>
                                        check_box
                                    </span> : <span className="material-icons" onClick={() => handleToggleUsuario(usuario.id!)}>
                                        check_box_outline_blank
                                    </span>}
                                </div>
                                <span className={`material-icons ${styles.delete}`} onClick={() => handleDeleteUsuario(usuario.id!)}> delete </span>
                            </div>
                        )) : <p>No hay usuarios creados</p>}
                    </div>
                </div>
                <div className={styles.separador}></div>
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <p>Crear usuario</p>
                    </div>
                    <form className={styles.form} onSubmit={formik.handleSubmit}>
                        <div className={styles.inputsContainer}>
                            <div className={styles.inputWrapper}>
                                <p>Nombre</p>
                                <input type='text'
                                    name='name'
                                    placeholder=''
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    autoComplete='off'
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className={styles.error}>{formik.errors.name}</div>
                                )}
                            </div>
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
                            <div className={styles.inputWrapper}>
                                <p>Confirmar contraseña</p>
                                <input type={showConfirmPassword ? 'text' : 'password'}
                                    name='confirmPassword'
                                    placeholder=''
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirmPassword}
                                    autoComplete='off'
                                />
                                {showConfirmPassword ? <span className='material-icons' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>visibility_off</span>
                                    : <span className='material-icons' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>visibility</span>}
                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <div className={styles.error}>{formik.errors.confirmPassword}</div>
                                )}
                            </div>
                            <div className={styles.inputWrapper}>
                                <p>Rol</p>
                                <select
                                    name="rol"
                                    value={formik.values.rol}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="VENTAS">VENTAS</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                                {formik.touched.rol && formik.errors.rol && (
                                    <div className={styles.error}>{formik.errors.rol}</div>
                                )}
                            </div>
                        </div>
                        <div className={styles.buttonsContainer}>
                            <button type='submit' className={styles.acceptButton} disabled={!(formik.isValid && formik.dirty) || loading} >Crear usuario</button>
                            <button type='reset' disabled={loading} className={styles.resetButton} onClick={() => formik.resetForm()} >
                                {loading ? <div className={styles.spinner}></div> : <span className='material-icons'>replay</span>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}
