import {Navigate,Outlet} from "react-router-dom"

import { getToken } from "../utils/auth"

const ProtectedRoutes = () =>{
    const token = getToken()
    if(!token){
        return <Navigate to="/login" replace />
    }
    return <Outlet />
}

export default ProtectedRoutes