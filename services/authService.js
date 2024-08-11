const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const LoginModel = require("../models/LoginModel");
const EmployeeModel = require("../models/EmployeeModel");
const OTPModel = require("../models/OTPModel");

const sendEmail = require("../utils/MailSender");

const { AuthError } = "../errors/";

exports.login = async ({ des, id, password }) => {
  const user = await LoginModel.findOne({ id: id, user: des });
  if (!user) {
    throw new AuthError("User not found");
  }
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    throw new AuthError("Password is incorrect");
  }
  const payload = { id: id };
  const jwtToken = jwt.sign(payload, "attendanceProject");
  const employeeData = await EmployeeModel.findOne({ id: id });
  if (!employeeData) {
    throw new AuthError("Employee data not found");
  }
  return {
    jwtToken,
    msg: "Person present in DB",
    data: employeeData,
    person: des == "Employee" ? des : "Admin",
  };
};

exports.checkUser = async ({ id }) => {
  const loginUser = await LoginModel.findOne({ id });
  if (!loginUser) {
    throw new AuthError("User not found");
  }
  const employeeData = await EmployeeModel.findOne({ id });
  const newOTP = generateOTP();
  await OTPModel.findOneAndUpdate(
    { userId: id },
    { otp: newOTP },
    { upsert: true, new: true }
  );
  await sendEmail({
    toMail: employeeData.email,
    otp: newOTP,
  });
};

exports.verifyOTP = async ({ id, otp }) => {
  const otpRecord = await OTPModel.findOne({ userId: id });
  if (!otpRecord) {
    return { code: 400, message: "No OTP found for this user" };
  }
  if (otp === otpRecord.otp) {
    await OTPModel.deleteOne({ userId: id });
    return { code: 200, message: "OTP verified successfully" };
  } else {
    return { code: 400, message: "Invalid OTP" };
  }
};

exports.updatePassword = async ({ id, password }) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  await LoginModel.findOneAndUpdate(
    { id: id },
    { password: hash },
    { new: true }
  );
  return { message: "Password Successfully Updated" };
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .padStart(6, "0");
};
