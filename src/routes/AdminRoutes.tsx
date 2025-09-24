
import { Route, Routes } from 'react-router-dom'
import { MenuPage } from '../components/screens/MenuPage/MenuPage'
import { UsersScreen } from '../components/screens/UsersScreen/UsersScreen'

export const AdminRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/menu' element={<MenuPage />} />
                <Route path='/gestion-de-productos' element={<></>} />
                <Route path='/modulo-de-ventas' element={<></>} />
                <Route path='/cierre-de-caja' element={<></>} />
                <Route path='/movimientos' element={<></>} />
                <Route path='/gestion-de-usuarios' element={<UsersScreen />} />
            </Routes>
        </>
    )
}
