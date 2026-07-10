const express = require("express")
const router = express.Router()

const stockController = require("../controllers/stock.controller")

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const validate = require("../middleware/validate");
const {stockSchema,adjustStockSchema,transferStockSchema} = require("../validators/stock.validator")

router.post('/',authMiddleware,roleMiddleware("admin"),validate(stockSchema),stockController.createStock)
router.patch('/adjust',authMiddleware,roleMiddleware("admin"),validate(adjustStockSchema),stockController.adjustStock)
router.post('/transfer',authMiddleware,roleMiddleware("admin"),validate(transferStockSchema),stockController.transferStock)
router.get('/',authMiddleware,roleMiddleware("admin","shopper"),stockController.getAllStocks)

module.exports = router