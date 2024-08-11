const BaseCustomError = require("./BaseCustomError");

class ValidationError extends BaseCustomError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
