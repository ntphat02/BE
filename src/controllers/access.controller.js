const AccessService = require("../services/access.service");
const { Created } = require("../core/success.response");
class AccessController {
  signUp = async (req, res, next) => {
    new Created({
      message: "Đăng ký thành công",
      metaData: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
