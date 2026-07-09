const {z} = require("zod")

const registerSchema = z.object({
    name:z.string().min(2,"Name must be at least 2 characters"),
    email:z.string().email("invalid email format"),
    password:z.string().min(6,"Password must contain at least 6 characters"),
    role:z.enum(["admin","shopper"]).default("shopper")
})

module.exports = {registerSchema}