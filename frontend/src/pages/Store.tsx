import { useState, useEffect } from "react"
import { getStores, createStore, updateStore, deleteStore } from "../api/store.api"
const Store = () => {
    const [stores, setStores] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        district: "",
        address: "",
        phone: "",
        manager: "",
        isActive: true
    })

    useEffect(() => {
        loadStores()
    }, [])

    const loadStores = async () => {
        try {
            const response = await getStores()
            setStores(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, [name]: value
        }))
    };

    const handleEdit = (store) => {
        setFormData({
            name: store.name,
            district: store.district,
            address: store.address,
            phone: store.phone,
            manager: store.manager,
            isActive: store.isActive
        })
        setEditingId(store._id)
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteStore(id)
            alert("Store deleted successfully!")
            loadStores()
        } catch (error: any) {
            console.error(error)
            alert(error.message || "An error occurred")
        }
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingId(null)
        setFormData({ name: "", district: "", address: "", phone: "", manager: "", isActive: true })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            if (editingId) {
                await updateStore(editingId, formData)
                alert("Store updated successfully!")
            } else {
                await createStore(formData)
                alert("Store created successfully!")
            }
            
            loadStores()
            handleCancel()
        } catch (error: any) {
            console.error(error)
            const errorMsg = error.response?.data?.errors?.join('\n') || error.response?.data?.message || error.message || "An error occurred";
            alert(errorMsg);    
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Stores</h1>
                <button 
                    onClick={() => showForm ? handleCancel() : setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    {showForm ? "Cancel" : "Add Store"}
                </button>
            </div>
            
            
            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 border">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? "Edit Store" : "Create New Store"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Store Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">District</label>
                                <input type="text" name="district" value={formData.district} onChange={handleChange} required className="w-full border rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Manager</label>
                                <input type="text" name="manager" value={formData.manager} onChange={handleChange} required className="w-full border rounded-md px-3 py-2" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} required className="w-full border rounded-md px-3 py-2" rows={2}></textarea>
                        </div>
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                            {editingId ? "Update Store" : "Save Store"}
                        </button>
                    </form>
                </div>
            )}
            
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {stores.map((store) => (
                    <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col justify-between" key={store._id}>
                        <div>
                            <h3 className="font-bold text-lg">{store.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">{store.district}</p>
                            <div className="text-sm space-y-1">
                                <p><span className="font-semibold">Manager:</span> {store.manager}</p>
                                <p><span className="font-semibold">Phone:</span> {store.phone}</p>
                                <p><span className="font-semibold">Address:</span> {store.address}</p>
                                <p>
                                    <span className="font-semibold">Status:</span> 
                                    <span className={store.isActive ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                                        {store.isActive ? "Active" : "Inactive"}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-400 mt-2">Added: {new Date(store.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => handleEdit(store)} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(store._id)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Store
