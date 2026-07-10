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

module.exports = {createStore}