const shopModel = require("../models/shop.models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const RoleShop = require("../contants/role");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getIntoData } = require("../utils");
const { token } = require("morgan");
const { BadRequestError } = require("../core/error.response");
class AccessService {
  static async signUp({ email, name, password }) {
    // Kiểm tra email đã tồn tại chưa
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError("Email đã được sử dụng");
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

      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");
      console.log({ publicKey, privateKey });

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Lỗi tạo khóa cho shop");
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
        shop: getIntoData({
          fileds: ["_id", "name", "email"],
          object: newShop,
        }),
        token: tokens,
      };
    }
  }
}

module.exports = AccessService;
