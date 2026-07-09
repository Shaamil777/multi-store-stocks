const {z} = require('zod')

const productSchema = z.object({
    sku:z.string().min(3,"SKU must be atleast 3 characters").max(50,"SKU cannot exceed 50 characters"),
    name:z.string().min(2,"Product name must be atleast 2 characters"),
    brand: z.string().min(2,"Brand is required"),
    category: z.string().min(2, "Category is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be greater than 0")
})

module.exports = { productSchema }