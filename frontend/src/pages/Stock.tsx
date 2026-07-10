import { useState, useEffect } from "react"
import { getStocks, createStock, adjustStock } from "../api/stock.api"
import { getProducts } from "../api/product.api"
import { getStores } from "../api/store.api"

const Stock = () => {
    const [stocks, setStocks] = useState([])
    const [products, setProducts] = useState([])
    const [stores, setStores] = useState([])


    const [showCreate, setShowCreate] = useState(false)
    const [showAdjust, setShowAdjust] = useState(false)

    
    const [createData, setCreateData] = useState({ product: "", store: "", quantity: 0 })
    const [adjustData, setAdjustData] = useState<{ product: string; store: string; type: "add" | "remove"; quantity: number }>({ 
        product: "", store: "", type: "add", quantity: 0 
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

    const handleCreateChange = (e: any) => {
        const { name, value } = e.target;
        setCreateData(prev => ({ ...prev, [name]: value }))
    }

    const handleAdjustChange = (e: any) => {
        const { name, value } = e.target;
        setAdjustData(prev => ({ ...prev, [name]: value }))
    }

    const handleCreateSubmit = async (e: any) => {
        e.preventDefault()
        try {
            await createStock({
                product: createData.product,
                store: createData.store,
                quantity: Number(createData.quantity)
            })
            alert("Initial stock added successfully!")
            loadData()
            setShowCreate(false)
            setCreateData({ product: "", store: "", quantity: 0 })
        } catch (error: any) {
            console.error(error)
            alert(error.response?.data?.errors?.join('\n') || error.response?.data?.message || "Error adding stock")
        }
    }

    const handleAdjustSubmit = async (e: any) => {
        e.preventDefault()
        try {
            await adjustStock({
                product: adjustData.product,
                store: adjustData.store,
                type: adjustData.type,
                quantity: Number(adjustData.quantity)
            })
            alert("Stock adjusted successfully!")
            loadData()
            setShowAdjust(false)
        } catch (error: any) {
            console.error(error)
            alert(error.response?.data?.errors?.join('\n') || error.response?.data?.message || "Error adjusting stock")
        }
    }

    const openAdjustForm = (stock: StockType) => {
        setAdjustData({
            product: stock.product._id,
            store: stock.store._id,
            type: "add",
            quantity: 0
        })
        setShowAdjust(true)
        setShowCreate(false)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Stock Management</h1>
                <button 
                    onClick={() => { setShowCreate(!showCreate); setShowAdjust(false); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    {showCreate ? "Cancel" : "Add Initial Stock"}
                </button>
            </div>

            {showCreate && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-blue-200">
                    <h2 className="text-xl font-semibold mb-4 text-blue-800">Add Initial Stock</h2>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Product</label>
                                <select name="product" value={createData.product} onChange={handleCreateChange} required className="w-full border rounded-md px-3 py-2 bg-white">
                                    <option value="" disabled>Select Product</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Store</label>
                                <select name="store" value={createData.store} onChange={handleCreateChange} required className="w-full border rounded-md px-3 py-2 bg-white">
                                    <option value="" disabled>Select Store</option>
                                    {stores.map(s => <option key={s._id} value={s._id}>{s.name} - {s.district}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Initial Quantity</label>
                                <input type="number" name="quantity" value={createData.quantity} onChange={handleCreateChange} min="0" required className="w-full border rounded-md px-3 py-2" />
                            </div>
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Save Stock</button>
                    </form>
                </div>
            )}

            {showAdjust && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-yellow-400">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-yellow-700">Adjust Existing Stock</h2>
                        <button type="button" onClick={() => setShowAdjust(false)} className="text-gray-500 hover:text-gray-700">✕ Close</button>
                    </div>
                    <form onSubmit={handleAdjustSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Adjustment Type</label>
                                <select name="type" value={adjustData.type} onChange={handleAdjustChange} required className="w-full border rounded-md px-3 py-2 bg-white font-medium">
                                    <option value="add">Add (+)</option>
                                    <option value="remove">Remove (-)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Quantity to Adjust</label>
                                <input type="number" name="quantity" value={adjustData.quantity} onChange={handleAdjustChange} min="1" required className="w-full border rounded-md px-3 py-2" />
                            </div>
                        </div>
                        <button type="submit" className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600">Update Stock</button>
                    </form>
                </div>
            )}

       
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stocks.map((stock) => (
                    <div className="bg-white border rounded-lg p-5 shadow-sm" key={stock._id}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-800">{stock.product.name}</h3>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                                QTY: {stock.quantity}
                            </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                            <p><span className="font-semibold text-gray-700">SKU:</span> {stock.product.sku}</p>
                            <p><span className="font-semibold text-gray-700">Brand:</span> {stock.product.brand}</p>
                            <p><span className="font-semibold text-gray-700">Category:</span> {stock.product.category}</p>
                            <div className="border-t pt-2 mt-2">
                                <p><span className="font-semibold text-gray-700">Location:</span> {stock.store.name} ({stock.store.district})</p>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Last Updated: {new Date(stock.updatedAt).toLocaleString()}</p>
                        </div>
                        
                        <div className="flex justify-end pt-2">
                            <button 
                                onClick={() => openAdjustForm(stock)} 
                                className="bg-yellow-500 text-white px-4 py-1.5 rounded text-sm hover:bg-yellow-600 transition font-medium"
                            >
                                Adjust Quantity
                            </button>
                        </div>
                    </div>
                ))}
                
                {stocks.length === 0 && (
                    <div className="col-span-full bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                        No stock records found. Click "Add Initial Stock" to get started.
                    </div>
                )}
            </div>
        </div>
    )
}

export default Stock
