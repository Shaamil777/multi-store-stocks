const storeService = require('../services/store.service')

const createStore = async (req,res)=>{
    try {
        const store = await storeService.createStore(req.body)
        return res.status(201).json({
            success:true,
            message:"Store created Successfully",
            data:store
        })
    } catch (error) {
         const status =
            error.message === "Store already exists"
                ? 400
                : 500;

        return res.status(status).json({
            success: false,
            message: error.message
        });
    }
}

const getAllstores = async (req,res)=>{
    try {
        const stores = await storeService.getAllStore()
        return res.status(200).json({
            success:true,
            message:"Stores Fetched Successfully",
            count:stores.length,
            data:stores
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getStoreById = async (req,res)=>{
    try {
        const store = await storeService.getStoreById(req.params.id)
        return res.status(200).json({
            success:true,
            data:store
        })
    } catch (error) {
        let status = 500;

        if (error.message === "Invalid Store ID") {
            status = 400;
        } else if (error.message === "Store not found") {
            status = 404;
        }

        return res.status(status).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {createStore,getAllstores,getStoreById}