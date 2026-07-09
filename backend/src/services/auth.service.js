const bcrypt = require('bcrypt')
const User = require('../models/User')

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

module.exports = {
    registerUser
}
