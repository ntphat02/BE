const { findByIdApiKey } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key =
      req.headers[HEADER.API_KEY] || req.headers[HEADER.AUTHORIZATION];

    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    // check objkey
    const objkey = await findByIdApiKey(key);
    if (!objkey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objkey = objkey;
    return next();
  } catch (error) {}
};

const permissions = (permissions) => {
  return (req, res, next) => {
    if (!req.objkey.permissions) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const validPermissions = req.objkey.permissions.includes(permissions);
    if (!validPermissions) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    return next();
  };
};

module.exports = { apiKey, permissions };
