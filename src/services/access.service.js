const shopModel = require("../models/shop.models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const RoleShop = require("../contants/role");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getIntoData } = require("../utils");
const { token } = require("morgan");

class AccessService {
  static async signUp({ email, name, password }) {
    try {
      // Kiểm tra email đã tồn tại chưa
      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop) {
        return {
          code: "xxx",
          message: "Email đã tồn tại",
        };
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        email,
        name,
        password: hashPassword,
        role: RoleShop.SHOP,
      });

      if (newShop) {
        // const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        // });


        const publicKey = crypto.randomBytes(64).toString("hex")
        const privateKey = crypto.randomBytes(64).toString("hex")
        console.log({ publicKey, privateKey });

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        });

        if (!keyStore) {
          return {
            code: "xxx",
            message: "keyStore error",
          };
        }


        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log(tokens);

        return {
          code: 201,
          message: "Đăng ký thành công",
          shop: getIntoData({ fileds: ["_id", "name", "email"], object: newShop }),
          token: tokens
        };
      }
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
      };
    }
  }
}

module.exports = AccessService;
