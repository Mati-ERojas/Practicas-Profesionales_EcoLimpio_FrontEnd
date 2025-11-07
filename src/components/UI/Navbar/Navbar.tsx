import styles from './Navbar.module.css'
import Logo from '../../../../public/ecoLimpio-Icon.png'
import { useEffect, useState } from 'react'
import { navigateTo } from '../../../routes/navigation'
import { CustomSwal } from '../CustomSwal/CustomSwal'
import { usuarioStore } from '../../../store/usuarioStore'
import { DropdownOptionsNavbar } from '../DropdownOptionsNavbar/DropdownOptionsNavbar'
import { carritoStore } from '../../../store/carritoStore'
import { ShoppingCartDropdown } from '../ShoppingCartDropdown/ShoppingCartDropdown'
import { useLocation, useNavigate } from 'react-router-dom'

export const Navbar = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('')

    const location = useLocation();
    const showSearchBar = location.pathname.includes("/browse") || location.pathname.includes("/product")

    const carritoLength = carritoStore((state) => state.carrito.length)
    const [openCarrito, setOpenCarrito] = useState(false)

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

    useEffect(() => { setSearch('') }, [location])
    return (
        <div className={styles.container}>
            <div className={styles.titleSection} onClick={() => usuarioLogged ? navigateTo("/menu") : navigateTo("/home")}>
                <img className={styles.logo} src={Logo} alt='Logo' />
                <div className={styles.titleContainer} >
                    <h1>Eco</h1>
                    <h1>Limpio</h1>
                </div>
            </div>

            {showSearchBar &&
                <div className={styles.searchContainer}>
                    <span className="material-symbols-outlined">search</span>
                    <input
                        autoComplete='off'
                        name='search'
                        value={search}
                        type="text"
                        className={styles.searchInput}
                        placeholder="¿Qué estás buscando?"
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                navigate(`/browse?search=${search}`)
                            }
                        }}
                    />
                </div>
            }
            {usuarioLogged ? (
                <div className={styles.optionsSection}>
                    <span className={`material-icons ${styles.icons}`} onClick={handleLogout}>logout</span>
                    <span className={`material-icons ${styles.icons}`} onClick={() => setOpenDropdown(!openDropdown)}>menu</span>
                </div>
            ) : (
                <div className={styles.optionsSection}>
                    <span className={`material-icons ${styles.icons}`} onClick={handleNavigateToLogin}>login</span>
                    <div className={`${styles.buttonCarrito} ${openCarrito ? styles.active : ''}`} onClick={() => { setOpenCarrito(!openCarrito) }}>
                        <div className={styles.carritoNumber}>{carritoLength}</div>
                        <span className={`material-icons ${styles.icons}`}>shopping_cart</span>
                    </div>
                </div>
            )}
            {openDropdown && <DropdownOptionsNavbar />}
            {openCarrito && <ShoppingCartDropdown />}
        </div>
    )
}
