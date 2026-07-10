const productService = require('../services/product.service')

const createProduct = async (req,res)=>{
    try {
        const product = await productService.createProduct(req.body)
        return res.status(201).json({
            success:true,
            message:"Product Created Successfully",
            data:product
        })

    } catch (error) {
        const status = error.message === 'Product already exists'? 400 : 500;

        return res.status(status).json({
            success:false,
            message:error.message || "Failed to create product"
        })
    }
}

const getProducts = async(req,res)=>{
    try {
        const products = await productService.getAllProducts()

        return res.status(200).json({
            success:true,
            message:"Products Fetched Successfully",
            data:products
        })
    } catch (error) {
        const status = error.message === "No products found" ? 404 : 500;

        return res.status(status).json({
            success:false,
            message:error.message || "Failed to fetch products"
        })
    }
}

const getProductById = async(req,res)=>{
    try {
        const product = await productService.getProductById(req.params.id)
        return res.status(200).json({
            success:true,
            data:product
        })
    } catch (error) {
        const status = error.message === "product not found" ? 404 : 500;
        return res.status(status).json({
            success:false,
            message:error.message || "Failed to fetch product"
        })
    }
}
module.exports = {
    createProduct,getProducts,getProductById
}