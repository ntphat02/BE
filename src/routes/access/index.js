const express = require("express");
const AccessController = require("../../controllers/access.controller");
const router = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
router.post("/shop/login", asyncHandler(AccessController.login));

router.post("/shop/signup", asyncHandler(AccessController.signUp));

// authentication
router.use(authentication);
router.post("/shop/logout", asyncHandler(AccessController.logout));

module.exports = router;
