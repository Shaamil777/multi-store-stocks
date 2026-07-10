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

const updateStore = async(id,storeData)=>{
    const store = await Store.findOne({_id:id,isActive:true})
    if(!store){
        throw new Error("Store not found")
    }
    Object.assign(store,storeData)
    await store.save()
    return store
}

const deleteStore = async(id)=>{
    const store = await Store.findOne({_id:id,isActive:true})
    if(!store){
        throw new Error("Store not found")
    }
    store.isActive = false
    await store.save()
    return store
}

module.exports = {createStore,getAllStore,getStoreById,updateStore,deleteStore}