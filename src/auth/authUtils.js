const jwt = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      algorithm: 'HS256',
      expiresIn: "2 days",
    });
    const refreshToken = await jwt.sign(payload, publicKey, {
      algorithm: 'HS256',
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

module.exports = { createTokenPair };
