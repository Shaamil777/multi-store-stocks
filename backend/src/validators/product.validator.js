const {z} = require('zod')

const productSchema = z.object({
    name:z.string().min(2,"Product name must be atleast 2 characters"),
    brand: z.string().min(2,"Brand is required"),
    category: z.string().min(2, "Category is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be greater than 0")
})

const updateProductScheme = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional()
})

module.exports = { productSchema,updateProductScheme }