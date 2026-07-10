import { useState, useEffect } from "react"
import { getProducts, createProduct, updateProduct,deleteProduct } from "../api/product.api"

const Product = () => {
    const [products, setProducts] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        category: "",
        description: "",
        price: 0,
        isActive: true
    })

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        try {
            const response = await getProducts()
            setProducts(response.data)
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

    const handleEdit = (product: any) => {
        setFormData({
            name: product.name,
            brand: product.brand,
            category: product.category,
            description: product.description || "",
            price: product.price,
            isActive: product.isActive
        })
        setEditingId(product._id)
        setShowForm(true)
    }
    const handleDelete=async(id:string)=>{
        try {
            await deleteProduct(id)
            alert("Product deleted successfully!")
            loadProducts()
        } catch (error: any) {
            console.error(error)
            alert(error.message || "An error occurred")
        }
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingId(null)
        setFormData({ name: "", brand: "", category: "", description: "", price: 0, isActive: true })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const productData = {
                ...formData,
                price: Number(formData.price)
            }

            if (editingId) {
                await updateProduct(editingId, productData)
                alert("Product updated successfully!")
            } else {
                await createProduct(productData)
                alert("Product created successfully!")
            }
            
            loadProducts()
            handleCancel()
        } catch (error: any) {
            console.error(error)
            alert(error.message || "An error occurred")
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <button 
                    onClick={() => showForm ? handleCancel() : setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    {showForm ? "Cancel" : "Add Product"}
                </button>
            </div>
           
            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 border">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? "Edit Product" : "Create New Product"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Brand</label>
                            
                                <input type="text" name="brand" value={formData.brand} onChange={handleChange} required disabled={!!editingId} className="w-full border rounded-md px-3 py-2 disabled:bg-gray-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                
                                <input type="text" name="category" value={formData.category} onChange={handleChange} required disabled={!!editingId} className="w-full border rounded-md px-3 py-2 disabled:bg-gray-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Price</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} min="0.01" step="0.01" required className="w-full border rounded-md px-3 py-2" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded-md px-3 py-2" rows={2}></textarea>
                        </div>
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                            {editingId ? "Update Product" : "Save Product"}
                        </button>
                    </form>
                </div>
            )}
          


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {products.map((product: any) => (
                    <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col justify-between" key={product._id}>
                        <div>
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">SKU: {product.sku}</p>
                            <div className="text-sm space-y-1">
                                <p><span className="font-semibold">Brand:</span> {product.brand}</p>
                                <p><span className="font-semibold">Category:</span> {product.category}</p>
                                <p><span className="font-semibold">Price:</span> ${product.price}</p>
                                <p>
                                    <span className="font-semibold">Status:</span> 
                                    <span className={product.isActive ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                                        {product.isActive ? "Active" : "Inactive"}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-400 mt-2">Added: {new Date(product.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Product