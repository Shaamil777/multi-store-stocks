import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Changed to react-router-dom
import { registerUser } from "../api/auth.api";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("shopper");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await registerUser({
                name,
                email,
                password,
                role
            });
            alert("Registration successful. Please login.");
            navigate("/login");
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="shopper">Shopper</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                    <p className="text-center text-sm mt-4 text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
