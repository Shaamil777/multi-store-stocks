const Product = require('../models/Product')
const generateSKU = require('../utils/generateSKU')

const createProduct = async (productData)=>{
    try {
        const {name , brand , category , description, price} = productData
        const existingProduct = await Product.findOne({name,brand,category})
         if(existingProduct){
            throw new Error("Product already exists")
        }
        let sku;
        do {
            sku = generateSKU(brand,category)
        } while (await Product.findOne({sku}))
       
        const product = await Product.create({
            sku,
            name,
            brand,
            category,
            description,
            price
        });

        return product

        
    } catch (error) {
        throw error.message
    }
}

const getAllProducts = async () =>{
    try {

        const products = await Product.find({isActive:true}).sort({createdAt:-1})
        if(!products){
            throw new Error("No products found")
        }
        return products
    } catch (error) {
        throw error.message
    }
}

const getProductById = async(id)=>{
    try {
        
        const product = await Product.findById({_id:id,isActive:true})
        if(!product){
            throw new Error("product not found")
        }
        return product
    } catch (error) {
        throw error.message
    }
}
module.exports = {
    createProduct,getAllProducts,getProductById
}