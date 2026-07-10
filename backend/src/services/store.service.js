const Store = require("../models/Store")

const createStore = async (storeData)=>{
    const {name,district,address,phone,manager} = storeData;

    const existingStore = await Store.findOne({name})

    if(existingStore){
        throw new Error("Store Already Exists")
    }

    const store = await Store.create({
        name,district,address,phone,manager
    });
    return store
}

const getAllStore = async () =>{
    const stores = await Store.find({isActive:true})
    return stores
}

const getStoreById = async(id)=>{
    const store = await Store.findOne({_id:id,isActive:true})
    if(!store){
        throw new Error("Store not found")
    }
    return store
}

module.exports = {createStore,getAllStore,getStoreById}