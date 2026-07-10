const Stock = require("../models/Stock")
const Store = require("../models/Store")
const Product = require("../models/Product")

const createStock = async(stockData)=>{
    const {product,store,quantity} = stockData

    const existingProduct = await Product.findOne({
        _id:product,
        isActive:true
    })
    if(!existingProduct){
        throw new error("Product not found")
    }

    const existingStore = await Store.findOne({
        _id:store,
        isActive:true
    })
    if(!existingStore){
        throw new Error("Store not found")
    }

    const existingStock = await Stock.findOne({
        product,
        store
    });

    if(existingStock){
        throw new Error("Stock already exist for this store")
    }
    const stock = await Stock.create({
        product,
        store,
        quantity
    })

    return stock;
}

const adjustStock = async(stockData)=>{
    const {
        product,
        store,
        type,
        quantity
    } = stockData;

    const stock = await Stock.findOne({
        product,
        store
    });

     if (!stock) {
        throw new Error("Stock record not found");
    }

    if (type === "add") {

        stock.quantity += quantity;

    } else {

        if (stock.quantity < quantity) {
            throw new Error("Insufficient stock");
        }

        stock.quantity -= quantity;
    }

    await stock.save();

    return stock;
}

module.exports = {createStock,adjustStock}