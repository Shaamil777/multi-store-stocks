const storeController = require("../controllers/store.controller")
const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")
const validate = require('../middleware/validate')
const {storeSchema,updateStoreSchema} = require("../validators/store.validator")

const express = require("express")
const router = express.Router()

router.post("/",authMiddleware,roleMiddleware("admin"),validate(storeSchema),storeController.createStore)
router.get("/",authMiddleware,roleMiddleware("admin","shopper"),storeController.getAllstores)
router.get("/:id",authMiddleware,roleMiddleware("admin","shopper"),storeController.getStoreById)
router.put("/:id",authMiddleware,roleMiddleware("admin"),validate(updateStoreSchema),storeController.updateStore)
router.delete("/:id",authMiddleware,roleMiddleware("admin"),storeController.deleteStore)

module.exports =router