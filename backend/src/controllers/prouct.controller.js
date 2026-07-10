const { success } = require('zod');
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

const updateProduct = async (req,res)=>{
    try {
        const product = await productService.updateProduct(req.params.id,req.body)
        return res.status(200).json({
            success:true,
            message:"Product updated successfully",
            data:product
        })
    } catch (error) {
         let status = 500;

        if (error.message === "Invalid Product ID") {
            status = 400;
        } else if (error.message === "Product not found") {
            status = 404;
        }

        return res.status(status).json({
            success: false,
            message: error.message
        });
    }
}

const deleteProduct = async (req,res)=>{
    try{
        await productService.deleteProduct(req.params.id)
        return res.status(200).json({
            success:true,
            message:"Product deleted successfully"
        })
    }catch(error){
        let status = 500;

        if (error.message === "Invalid Product ID") {
            status = 400;
        } else if (error.message === "Product not found") {
            status = 404;
        }

        return res.status(status).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createProduct,getProducts,getProductById,updateProduct,deleteProduct
}