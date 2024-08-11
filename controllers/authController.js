const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  async checkUser(req, res) {
    try {
      await authService.checkUser(req.body);
      res.status(200).send({ code: 200 });
    } catch (error) {
      res.status(400).send({ code: 400 });
    }
  }

  async verifyOTP(req, res) {
    try {
      const result = await authService.verifyOTP(req.body);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ code: 500, message: "Internal server error" });
    }
  }

  async updatePassword(req, res) {
    try {
      const result = await authService.updatePassword(req.body);
      res.send(result);
    } catch (error) {
      res.status(400).send({ message: "Password Not Updated" });
    }
  }
}

module.exports = new AuthController();