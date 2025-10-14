
import { Route, Routes } from 'react-router-dom'
import { MenuPage } from '../components/screens/MenuPage/MenuPage'
import { UsersScreen } from '../components/screens/UsersScreen/UsersScreen'
import { ProductManagementScreen } from '../components/screens/ProductManagementScreen/ProductManagementScreen'
import { POSScreen } from '../components/screens/POSScreen/POSScreen'

export const AdminRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/menu' element={<MenuPage />} />
                <Route path='/gestion-de-productos' element={<ProductManagementScreen />} />
                <Route path='/modulo-de-ventas' element={<POSScreen />} />
                <Route path='/cierre-de-caja' element={<></>} />
                <Route path='/movimientos' element={<></>} />
                <Route path='/gestion-de-usuarios' element={<UsersScreen />} />
            </Routes>
        </>
    )
}
