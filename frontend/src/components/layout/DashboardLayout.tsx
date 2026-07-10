import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const DashboardLayout=()=>{
    return (
         <div className="flex">

            <Sidebar />

                <main className="p-6">

                    <Outlet />

                </main>

            

        </div>
    )
}

export default DashboardLayout