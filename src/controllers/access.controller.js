const AccessService = require("../services/access.service");
const { Created } = require("../core/success.response");
class AccessController {
  login = async (req, res, next) => {
    new Created({
      message: "Đăng nhập thành công",
      metaData: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new Created({
      message: "Đăng ký thành công",
      metaData: await AccessService.signUp(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new Created({
      message: "Đăng xuất thành công",
      metaData: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  };
}

module.exports = new AccessController();
