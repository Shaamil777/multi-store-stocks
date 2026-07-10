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

module.exports = {createStore}