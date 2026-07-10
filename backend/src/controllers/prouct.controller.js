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

module.exports = {
    createProduct
}