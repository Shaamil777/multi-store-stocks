const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')
const productController = require('../controllers/prouct.controller')
const {productSchema} = require('../validators/product.validator')
const validate = require('../middleware/validate')


router.post('/',authMiddleware,roleMiddleware("admin"),validate(productSchema),productController.createProduct)
router.get('/',authMiddleware,roleMiddleware("admin","shopper"),productController.getProducts)
router.get("/:id",authMiddleware,roleMiddleware("admin","shopper"),productController.getProductById)

module.exports = router;