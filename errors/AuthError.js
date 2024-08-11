const BaseCustomError = require("./BaseCustomError");

class AuthError extends BaseCustomError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = AuthError;
