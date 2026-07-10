const stockService = require("../services/stock.service")

const createStock = async(req,res)=>{
    try {
        const stock = await stockService.createStock(req.body)
        return res.status(201).json({
            success:true,
            message:"Stock created successfully",
            data:stock
        })
    } catch (error) {
        let status = 500;

        if (
            error.message === "Invalid Product ID" ||
            error.message === "Invalid Store ID"
        ) {
            status = 400;
        }
        else if (
            error.message === "Product not found" ||
            error.message === "Store not found"
        ) {
            status = 404;
        }
        else if (
            error.message === "Stock already exists for this store"
        ) {
            status = 400;
        }

        return res.status(status).json({
            success: false,
            message: error.message
        });
    }
}

const adjustStock = async (req,res)=>{
    try {
        const stock = await stockService.adjustStock(req.body)
        return res.status(200).json({
            success:true,
            message:"Stock adjusted successfully",
            data:stock
        })
    } catch (error) {
        let status = 500;

        if (
            error.message === "Invalid Product ID" ||
            error.message === "Invalid Store ID"
        ) {
            status = 400;
        }
        else if (
            error.message === "Product not found" ||
            error.message === "Store not found" ||
            error.message === "Stock record not found"
        ) {
            status = 404;
        }
        else if (
            error.message === "Insufficient stock"
        ) {
            status = 400;
        }

        return res.status(status).json({
            success: false,
            message: error.message
        });
    }
}

const transferStock = async(req,res)=>{
    try {
        const result = await stockService.transferStock(req.body)
        return res.status(200).json({
            success:true,
            message:"Stock transferred successfully",
            data:result
        })
    } catch (error) {
        let status = 500;

        if (
            error.message === "Invalid Product ID" ||
            error.message === "Invalid Source Store ID" ||
            error.message === "Invalid Destination Store ID"
        ) {
            status = 400;
        }
        else if (
            error.message === "Product not found" ||
            error.message === "Source store not found" ||
            error.message === "Destination store not found" ||
            error.message === "Source stock not found"
        ) {
            status = 404;
        }
        else if (
            error.message === "Insufficient stock for transfer" ||
            error.message === "Source and destination stores cannot be the same"
        ) {
            status = 400;
        }

        return res.status(status).json({
            success: false,
            message: error.message
        });
    }
}

const getAllStocks = async(req,res)=>{
    try {
        const stocks = await stockService.getAllStocks()
        return res.status(200).json({
            success:true,
            count:stocks.length,
            data:stocks
        })
    } catch (error) {
         return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {createStock,adjustStock,transferStock,getAllStocks}