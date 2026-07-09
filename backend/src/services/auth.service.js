const bcrypt = require('bcrypt')
const User = require('../models/User')
const generateToken = require("../utils/generateToken")

const registerUser = async (userData) => {
    const { name, email, password, role } = userData

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw new Error("Email Already exist")
    }

    const hashPassword = await bcrypt.hash(password, 10)
    
    const user = await User.create({
        name,
        email,
        password: hashPassword,
        role
    })

    return user
}

const loginUser = async (userData)=>{
    const {email,password} = userData

    const user = await User.findOne({email})

    if(!user){
        throw new Error("invalid email or password")
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("invalid email or password")
    }

    const token = await generateToken(user._id,user.role)

    return { user, token }
}

module.exports = {
    registerUser,
    loginUser
}
