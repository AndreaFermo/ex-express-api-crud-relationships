const {Router} = require('express');
const router = Router();
const tagsController = require("../controllers/tag");

router.post("/", tagsController.store)

module.exports = router;