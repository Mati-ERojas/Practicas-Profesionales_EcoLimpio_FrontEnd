import styles from './Navbar.module.css'
import Logo from '../../../../public/ecoLimpio-Icon.png'
import { useState } from 'react'
import { navigateTo } from '../../../routes/navigation'
import { CustomSwal } from '../CustomSwal/CustomSwal'
import { usuarioStore } from '../../../store/usuarioStore'
import { DropdownOptionsNavbar } from '../DropdownOptionsNavbar/DropdownOptionsNavbar'
export const Navbar = () => {
    const [contador, setContador] = useState(0)
    const [openDropdown, setOpenDropdown] = useState(false)
    const usuarioLogged = usuarioStore((state) => state.usuarioLogeado);
    const setUsuarioLogeado = usuarioStore((state) => state.setUsuarioLogeado);
    const handleLogout = () => {
        setUsuarioLogeado(null)
        localStorage.clear()
    }

    const handleNavigateToLogin = async () => {
        const confirm = await CustomSwal.fire({
            text: "Solo los empleados deben iniciar sesión",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "Cerrar"
        })
        if (!confirm.isConfirmed) return
        navigateTo('/login')
    }
    return (
        <div className={styles.container}>
            <div className={styles.titleSection} onClick={() => usuarioLogged ? navigateTo("/menu") : navigateTo("/home")}>
                <img className={styles.logo} src={Logo} alt='Logo' />
                <div className={styles.titleContainer} >
                    <h1>Eco</h1>
                    <h1>Limpio</h1>
                </div>
            </div>
            {usuarioLogged ? (
                <div className={styles.optionsSection}>
                    <span className={`material-icons ${styles.icons}`} onClick={handleLogout}>logout</span>
                    <span className={`material-icons ${styles.icons}`} onClick={() => setOpenDropdown(!openDropdown)}>menu</span>
                </div>
            ) : (
                <div className={styles.optionsSection}>
                    <span className={`material-icons ${styles.icons}`} onClick={handleNavigateToLogin}>login</span>
                    <div className={styles.buttonCarrito} onClick={() => { setContador(contador + 1) }}>
                        <div className={styles.carritoNumber}>{contador}</div>
                        <span className={`material-icons ${styles.icons}`}>shopping_cart</span>
                    </div>
                </div>
            )}
            {openDropdown && <DropdownOptionsNavbar />}
        </div>
    )
}
