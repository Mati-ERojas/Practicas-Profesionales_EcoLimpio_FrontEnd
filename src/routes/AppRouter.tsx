import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { LoadingScreen } from '../components/screens/LoadingScreen/LoadingScreen'
import { LandingPage } from '../components/screens/LandingPage/LandingPage'
import { Navbar } from '../components/UI/Navbar/Navbar'
import { LoginPage } from '../components/screens/LoginPage/LoginPage'
import { usuarioStore } from '../store/usuarioStore'
import { useUsuario } from '../hooks/useUsuario'
import { useEffect, useState } from 'react'
import { validateTokenHttp } from '../http/authHttp'
import { AdminRoutes } from './AdminRoutes'
import { SellerRoutes } from './SellerRoutes'
import { BrowseCategoriesScreen } from '../components/screens/BrowseCategoriesScreen/BrowseCategoriesScreen'
import { BrowseScreen } from '../components/screens/BrowseScreen/BrowseScreen'
import { ProductScreen } from '../components/screens/ProductScreen/ProductScreen'

export const AppRouter = () => {
    const navigate = useNavigate()

    const usuarioLogged = usuarioStore((state) => state.usuarioLogeado);
    const setUsuarioLogeado = usuarioStore((state) => state.setUsuarioLogeado)
    const { getUsuarioById } = useUsuario();
    const [cargandoUsuario, setCargandoUsuario] = useState(true);
    const location = useLocation();

    // Maneja el acceso a rutas protegidas sin autorización
    useEffect(() => {
        if (cargandoUsuario) return; // 👈 NO hacer chequeos todavía

        const rutasProtegidas = [
            "/menu",
            "/gestion-de-productos",
            "/modulo-de-ventas",
            "/cierre-de-caja",
            "/movimientos",
            "/gestion-de-usuarios"
        ];

        const esRutaProtegida = rutasProtegidas.some((ruta) =>
            location.pathname.startsWith(ruta)
        );

        if (!usuarioLogged && esRutaProtegida) {
            navigate("/home");
        }
    }, [location.pathname, usuarioLogged, cargandoUsuario]);


    // Persiste al usuario loggeado
    useEffect(() => {
        const handlePersistUsuarioLoggeado = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const validToken = await validateTokenHttp(token)
                if (validToken) {
                    const userId = localStorage.getItem("usuarioLogeado")
                    if (userId) {
                        const userLogPersist = await getUsuarioById(userId)
                        if (userLogPersist) {
                            setUsuarioLogeado(userLogPersist);
                        } else {
                            console.error("usuario no encontrado")
                        }
                    }
                } else {
                    localStorage.clear();
                    console.warn("Token inválido. Cerrando sesión")
                }
            } else {
                localStorage.clear();
                console.warn("No hay token. Cerrando sesión")
            }
            setCargandoUsuario(false)
        }
        handlePersistUsuarioLoggeado();
    }, [])

    const hideNavbar = location.pathname === "/" || location.pathname === "/login"
    if (cargandoUsuario) return <LoadingScreen />
    return (
        <>
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path='/' element={<LoadingScreen />} />
                <Route path='/home' element={<LandingPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/browse-categories/:category' element={<BrowseCategoriesScreen />} />
                <Route path='/product/:product' element={<ProductScreen />} />
                <Route path='/browse' element={<BrowseScreen />} />
                <Route path='/*'
                    element={
                        usuarioLogged?.rol === "ADMIN" ? (<AdminRoutes />
                        ) : usuarioLogged?.rol === "VENTAS" ? (<SellerRoutes />
                        ) : (<Navigate to="/login" />)
                    }
                />
            </Routes>
        </>
    )
}
