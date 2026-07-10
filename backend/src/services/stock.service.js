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

const transferStock = async(transferData)=>{
    const {product,fromStore,toStore,quantity} = transferData
    
    if(fromStore === toStore){
        throw new Error("Source and destination stores cannot be same")
    }

    const existingProduct = await Product.findOne({
        _id:product,
        isActive:true
    })
    if(!existingProduct){
        throw new Error("Product not found");
    }

    const sourceStore = await Store.findOne({
        _id:fromStore,
        isActive:true
    })
     if (!sourceStore) {
        throw new Error("Source store not found");
    }

    const destinationStore = await Store.findOne({
        _id:toStore,
        isActive:true
    })
     if (!destinationStore) {
        throw new Error("Destination store not found");
    }

    const sourceStock = await Stock.findOne({
        product,
        store:fromStore
    })
    if (!sourceStock) {
        throw new Error("Source stock not found");
    }

    if(sourceStock.quantity<quantity){
        throw new Error("Insufficient stock for transfer");
    }

    sourceStock.quantity -= quantity

    let destinationStock = await Stock.findOne({
        product,
        store:toStore
    })

    if(destinationStock){
        destinationStock.quantity += quantity
    }else{
        destinationStock = await Stock.create({
            product,
            store:toStore,
            quantity
        })
    }

    await sourceStock.save()
    if(destinationStock.isModified()){
        await destinationStock.save()
    }

    return {
        sourceStock,
        destinationStock
    }
}

const getAllStocks = async()=>{
    const stocks = await Stock.find()
    .populate("product","name sku brand category").populate("store","name district").sort({createdAt:-1})
    return stocks
}

module.exports = {createStock,adjustStock,transferStock,getAllStocks}