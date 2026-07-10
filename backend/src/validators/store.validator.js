const {z} = require('zod')

const storeSchema = z.object({
    name: z.string().min(2, "Store name must be at least 2 characters"),
    district: z.string().min(2, "District is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
    manager: z.string().min(2, "Manager name must be at least 2 characters")
})

const updateStoreSchema = z.object({
    name: z.string().min(2).optional(),
    district: z.string().min(2).optional(),
    address: z.string().min(5).optional(),
    phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
    manager: z.string().min(2).optional(),
    isActive: z.boolean().optional()
})

module.exports = { storeSchema, updateStoreSchema }