const storeController = require("../controllers/store.controller")
const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")

const express = require("express")
const router = express.Router()

router.post("/",authMiddleware,roleMiddleware("admin"),storeController.createStore)
router.get("/",authMiddleware,roleMiddleware("admin","shopper"),storeController.getAllstores)
router.get("/:id",authMiddleware,roleMiddleware("admin","shopper"),storeController.getStoreById)

module.exports =router