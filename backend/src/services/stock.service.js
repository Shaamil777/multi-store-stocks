const mongoose = require('mongoose')
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
    const { product, store, type, quantity } = stockData;

    let stock;
    if (type === "add") {
        stock = await Stock.findOneAndUpdate(
            { product, store },
            { $inc: { quantity: quantity } },
            { new: true }
        );
    } else {
        stock = await Stock.findOneAndUpdate(
            { product, store, quantity: { $gte: quantity } },
            { $inc: { quantity: -quantity } },
            { new: true }
        );
        
        if (!stock) {
            const exists = await Stock.exists({ product, store });
            if (!exists) throw new Error("Stock record not found");
            throw new Error("Insufficient stock");
        }
    }

    if (!stock) {
        throw new Error("Stock record not found");
    }

    return stock;
}

const transferStock = async(transferData)=>{
    const {product,fromStore,toStore,quantity} = transferData
    
    if(fromStore === toStore){
        throw new Error("Source and destination stores cannot be same")
    }

    const existingProduct = await Product.findOne({ _id:product, isActive:true })
    if(!existingProduct){
        throw new Error("Product not found");
    }

    const sourceStore = await Store.findOne({ _id:fromStore, isActive:true })
     if (!sourceStore) {
        throw new Error("Source store not found");
    }

    const destinationStore = await Store.findOne({ _id:toStore, isActive:true })
     if (!destinationStore) {
        throw new Error("Destination store not found");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const sourceStock = await Stock.findOneAndUpdate(
            { product, store: fromStore, quantity: { $gte: quantity } },
            { $inc: { quantity: -quantity } },
            { new: true, session }
        );

        if (!sourceStock) {
            const exists = await Stock.exists({ product, store: fromStore });
            if (!exists) throw new Error("Source stock not found");
            throw new Error("Insufficient stock for transfer");
        }

        const destinationStock = await Stock.findOneAndUpdate(
            { product, store: toStore },
            { $inc: { quantity: quantity } },
            { upsert: true, new: true, setDefaultsOnInsert: true, session }
        );

        await session.commitTransaction();
        return { sourceStock, destinationStock };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

const getAllStocks = async(threshold)=>{
    let query = {};
    if (threshold !== undefined && !isNaN(threshold)) {
        query.quantity = { $lte: Number(threshold) };
    }

    const stocks = await Stock.find(query)
    .populate("product","name sku brand category").populate("store","name district").sort({createdAt:-1})
    return stocks
}

module.exports = {createStock,adjustStock,transferStock,getAllStocks}