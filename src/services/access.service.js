const shopModel = require("../models/shop.models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const RoleShop = require("../contants/role");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getIntoData } = require("../utils");
const { token } = require("morgan");
const { BadRequestError } = require("../core/error.response");
const shopModels = require("../models/shop.models");
const keyTokenModel = require("../models/keyToken.model");
class AccessService {
  static async login({ email, password, resfreshToken = null }) {
    // 1 - check email in dbs
    const foundShop = await shopModels.findOne({ email }).lean();
    if (!foundShop) {
      throw new BadRequestError("Shop không tồn tại");
    }

    // 2 - match password

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new BadRequestError("Mật khẩu không đúng");
    }

    // 3 - create AT vs RT and save

    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");
    // 4 - generate tokens
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    // 5 - get data return login
    return {
      code: 200,
      message: "Đăng nhập thành công",
      shop: getIntoData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      token: tokens,
    };
  }

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

  static async logout({ keyStore }) {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return {
      message: {
        code: 200,
        message: "Đăng xuất thành công",
      },
    };
  }
}

module.exports = AccessService;
