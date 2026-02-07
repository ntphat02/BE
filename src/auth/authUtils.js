const jwt = require("jsonwebtoken");
const { HEADER } = require("../contants/other");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("Error verify:: ", err);
      } else {
        console.log("Decode verify:: ", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error creating token pair:", error);
    return null;
  }
};

const authentication = async (req, res, next) => {
  //Kiểm tra xem ID người dùng có bị thiếu không

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedError("Thiếu ID người dùng trong yêu cầu");
  }

  //Lấy access token từ header

  const keyStore = await findByUserId(userId);

  if (!keyStore) {
    throw new NotFoundError("Không tìm thấy khoá cho người dùng");
  }

  // verify accessToken
  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) {
    throw new UnauthorizedError("Thiếu access token trong yêu cầu");
  }

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);

    if (userId !== decodeUser.userId) {
      throw new UnauthorizedError("ID người dùng không hợp lệ");
    }
    req.keyStore = keyStore;
    req.user = decodeUser;

    return next();
  } catch (error) {
    console.error("Lỗi xác thực:", error);
    throw error;
  }
};

module.exports = { createTokenPair, authentication };
