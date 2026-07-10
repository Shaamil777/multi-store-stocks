const {z} = require('zod')

const stockSchema = z.object({
    product:z.string().min(1,"Product ID is required"),
    store: z.string().min(1, "Store ID is required"),
    quantity: z.number().int().min(0, "Quantity cannot be negative")

})

const adjustStockSchema = z.object({
    product: z.string().min(1, "Product ID is required"),
    store: z.string().min(1, "Store ID is required"),
    type: z.enum(["add", "remove"]),
    quantity: z.number().int().positive("Quantity must be greater than 0")
})

const transferStockSchema = z.object({
    product: z.string().min(1, "Product ID is required"),
    fromStore: z.string().min(1, "Source Store ID is required"),
    toStore: z.string().min(1, "Destination Store ID is required"),
    quantity: z.number().int().positive("Quantity must be greater than 0")

})
module.exports = { stockSchema,adjustStockSchema,transferStockSchema};