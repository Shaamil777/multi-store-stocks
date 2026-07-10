import {BrowserRouter,Routes,Route} from "react-router-dom"
import DashboardLayout from "../components/layout/DashboardLayout"
import ProtectedRoutes from "./protectedRoute"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Product from "../pages/Product"

const AppRoutes = ()=>{
    return (
        <BrowserRouter>
        <Routes>
        <Route path="/login" element={<Login/>} />
        <Route element={<ProtectedRoutes/>}>
            <Route element={<DashboardLayout/>}>
                <Route path="/" element={<Dashboard/>} />
                <Route path="/products" element={<Product/>}/>
                {/* <Route path="/stores" element={<Stores />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/transfer" element={<Transfer />} /> */}
            </Route>
        </Route>
        </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes