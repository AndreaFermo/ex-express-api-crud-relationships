const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");
const { body } = require("express-validator");

router.get("/", postsController.index);

router.post("/",
body("title").notEmpty(),
body("content").notEmpty(),
body("published").notEmpty().isBoolean(),
body("categoryId").isInt(),
body("tags"),
postsController.store)

router.get("/:slug", postsController.show);

router.put("/:slug",body("published").isBoolean(), postsController.update);

router.delete("/:slug", postsController.destroy);

module.exports = router;