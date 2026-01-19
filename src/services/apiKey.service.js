const apiKeySchema = require("../models/apiKey.model");
const crypto = require("crypto");
const findByIdApiKey = async (key) => {
  //   const newObjKey = await apiKeySchema.create({
  //     key: crypto.randomBytes(64).toString("hex"),
  //     permissions: ["0000"],
  //   });
  //   console.log(newObjKey);

  const objkey = await apiKeySchema.findOne({ key, status: true }).lean();
  return objkey;
};

module.exports = { findByIdApiKey };
