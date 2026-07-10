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

module.exports = {
    createProduct
}