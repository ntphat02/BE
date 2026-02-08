const express = require("express");
const ProductController = require("../../controllers/product.controller");
const router = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");

router.get(
  "/search/:keySearch",
  asyncHandler(ProductController.searchProducts)
);
// authentication
router.use(authentication);
//GET
router.get("/drafts/all", asyncHandler(ProductController.getAllDraftsForShop));
router.get("/public/all", asyncHandler(ProductController.getAllPublicShop));
//POST
router.post("", asyncHandler(ProductController.createProduct));
//PUT
router.put("/public/:id", asyncHandler(ProductController.publishProductByShop));
router.put(
  "/unpublic/:id",
  asyncHandler(ProductController.unPublishProductByShop)
);
module.exports = router;
