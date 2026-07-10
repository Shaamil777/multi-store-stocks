import { useState, useEffect } from "react"
import { getStocks, transferStock } from "../api/stock.api"
import { getProducts } from "../api/product.api"
import { getStores } from "../api/store.api"


const Transfer = () => {
    const [stocks, setStocks] = useState([])
    const [products, setProducts] = useState([])
    const [stores, setStores] = useState([])

    const [formData, setFormData] = useState({
        product: "",
        fromStore: "",
        toStore: "",
        quantity: ""
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [stockRes, productRes, storeRes] = await Promise.all([
                getStocks(),
                getProducts(),
                getStores()
            ])
            setStocks(stockRes.data)
            setProducts(productRes.data.filter((p: any) => p.isActive))
            setStores(storeRes.data.filter((s: any) => s.isActive))
        } catch (error) {
            console.error(error)
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await transferStock({
                product: formData.product,
                fromStore: formData.fromStore,
                toStore: formData.toStore,
                quantity: Number(formData.quantity)
            })
            alert("Stock transferred successfully!")
            loadData() 
            setFormData({ product: "", fromStore: "", toStore: "", quantity: "" })
        } catch (error: any) {
            console.error(error)
            alert(error.response?.data?.errors?.join('\n') || error.response?.data?.message || "Error transferring stock")
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Transfer Stock</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-purple-200">
                <h2 className="text-xl font-semibold mb-4 text-purple-800">Transfer Between Stores</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Product</label>
                            <select name="product" value={formData.product} onChange={handleChange} required className="w-full border rounded-md px-3 py-2 bg-white">
                                <option value="" disabled>Select Product</option>
                                {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Quantity</label>
                            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required className="w-full border rounded-md px-3 py-2" placeholder="Amount to transfer" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded-md">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-red-600">Source Store (From)</label>
                            <select name="fromStore" value={formData.fromStore} onChange={handleChange} required className="w-full border-red-300 rounded-md px-3 py-2 bg-white outline-red-500">
                                <option value="" disabled>Select Source Store</option>
                                {stores.map(s => <option key={s._id} value={s._id}>{s.name} - {s.district}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-green-600">Destination Store (To)</label>
                            <select name="toStore" value={formData.toStore} onChange={handleChange} required className="w-full border-green-300 rounded-md px-3 py-2 bg-white outline-green-500">
                                <option value="" disabled>Select Destination Store</option>
                                {stores.map(s => <option key={s._id} value={s._id}>{s.name} - {s.district}</option>)}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 w-full md:w-auto">
                        Complete Transfer
                    </button>
                </form>
            </div>

            <h2 className="text-xl font-bold mb-4">Current Stock Levels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stocks.map((stock) => (
                    <div className="bg-white border rounded-lg p-5 shadow-sm" key={stock._id}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-800">{stock.product.name}</h3>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                                QTY: {stock.quantity}
                            </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-semibold text-gray-700">SKU:</span> {stock.product.sku}</p>
                            <p><span className="font-semibold text-gray-700">Location:</span> {stock.store.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Transfer
