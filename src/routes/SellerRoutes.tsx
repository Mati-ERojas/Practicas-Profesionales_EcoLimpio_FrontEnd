import { Route, Routes } from "react-router-dom"
import { MenuPage } from "../components/screens/MenuPage/MenuPage"

export const SellerRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/menu' element={<MenuPage />} />
                <Route path='/modulo-de-ventas' element={<></>} />
                <Route path='/cierre-de-caja' element={<></>} />
            </Routes>
        </>
    )
}
