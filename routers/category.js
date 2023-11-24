const {Router} = require('express');
const router = Router();
const categoriesController = require("../controllers/category");

router.post("/", categoriesController.store)

module.exports = router;