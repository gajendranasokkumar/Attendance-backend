const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
  userId: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // OTP expires after 5 minutes
});

const OTPModel = mongoose.model('OTP', otpSchema)
module.exports = OTPModel;