
import { Route, Routes } from 'react-router-dom'
import { MenuPage } from '../components/screens/MenuPage/MenuPage'
import { UsersScreen } from '../components/screens/UsersScreen/UsersScreen'
import { ProductManagementScreen } from '../components/screens/ProductManagementScreen/ProductManagementScreen'
import { POSScreen } from '../components/screens/POSScreen/POSScreen'
import { MovementsScreen } from '../components/screens/MovementsScreen/MovementsScreen'
import { CashClosingScreen } from '../components/screens/CashClosingScreen/CashClosingScreen'

export const AdminRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/menu' element={<MenuPage />} />
                <Route path='/gestion-de-productos' element={<ProductManagementScreen />} />
                <Route path='/modulo-de-ventas' element={<POSScreen />} />
                <Route path='/cierre-de-caja' element={<CashClosingScreen />} />
                <Route path='/movimientos' element={<MovementsScreen />} />
                <Route path='/gestion-de-usuarios' element={<UsersScreen />} />
            </Routes>
        </>
    )
}
