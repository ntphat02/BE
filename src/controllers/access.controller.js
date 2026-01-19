const AccessService = require("../services/access.service");
class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log("[P] :: signUp ", req.body);
      const result = await AccessService.signUp(req.body);
      return res.status(201).json({

        result: result,
      });
    } catch (error) {
      return res.status(error.code).json({
        message: error.message,
      });
    }
  };
}

module.exports = new AccessController();
