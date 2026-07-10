const express = require("express")
const router = express.Router()

const stockController = require("../controllers/stock.controller")

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const validate = require("../middleware/validate");
const {stockSchema,adjustStockSchema} = require("../validators/stock.validator")

router.post('/',authMiddleware,roleMiddleware("admin"),validate(stockSchema),stockController.createStock)
router.patch('/adjust',authMiddleware,roleMiddleware("admin"),validate(adjustStockSchema),stockController.adjustStock)

module.exports = router