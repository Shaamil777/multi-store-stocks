import { NavLink } from "react-router"
const sideBar=()=>{
    return (
        <aside className="w-64 h-screen bg-gray-900 text-white p-5">

            <h1 className="text-xl font-bold mb-8">
                Multi Store Stocks
            </h1>

            <nav className="flex flex-col gap-3">

                <NavLink to="/">
                    Dashboard
                </NavLink>

                <NavLink to="/products">
                    Products
                </NavLink>

                <NavLink to="/stores">
                    Stores
                </NavLink>

                <NavLink to="/stocks">
                    Stock
                </NavLink>

                <NavLink to="/transfers ">
                    Transfer
                </NavLink>

            </nav>

        </aside>
    )
}

export default sideBar