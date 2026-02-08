const express = require("express");
const { apiKey, permissions } = require("../auth/checkAuth");
const router = express.Router();

//check api key
router.use(apiKey);
// check perrmissions
router.use(permissions("0000"));
router.use("/product", require("./product"));
router.use("/auth", require("./access"));

module.exports = router;
