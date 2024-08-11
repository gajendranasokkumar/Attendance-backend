const EmployeeModel = require('../models/EmployeeModel');
const LoginModel = require('../models/LoginModel');
const bcrypt = require('bcryptjs');

exports.createEmployee = async (employeeDetails) => {
  const newEmployee = await EmployeeModel.create(employeeDetails);

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(employeeDetails.id, salt);

  await LoginModel.create({
    user: "Employee",
    id: employeeDetails.id,
    password: hash,
  });

  if (employeeDetails.reportingperson) {
    await EmployeeModel.findOneAndUpdate(
      {id : employeeDetails.reportingperson},
      { $push: { employeelist: newEmployee.id } }
    );
  }

  return newEmployee;
}

exports.updateEmployee = async (id, updateemp) => {
  const currentEmployee = await EmployeeModel.findOne({ id: id });

  if (!currentEmployee) {
    throw new Error("Employee not found");
  }

  if (updateemp.reportingperson && updateemp.reportingperson !== currentEmployee.reportingperson) {
    if (currentEmployee.reportingperson) {
      await EmployeeModel.findOneAndUpdate(
        { id: currentEmployee.reportingperson },
        { $pull: { employeelist: id } }
      );
    }

    await EmployeeModel.findOneAndUpdate(
      { id: updateemp.reportingperson },
      { $push: { employeelist: id } }
    );
  }

  return await EmployeeModel.findOneAndUpdate(
    { id: id },
    updateemp,
    { new: true }
  );
};

exports.deleteEmployeeById = async (id) => {
  const deletedEmployee = await EmployeeModel.findByIdAndDelete(id);
  if (!deletedEmployee) {
    throw new Error("Employee not found");
  }
  return deletedEmployee;
};

exports.getAllEmployees = async () => {
  return await EmployeeModel.find();
};

exports.fetchManager = async () => {
  return await EmployeeModel.find({ismanager: "Yes"});
};

exports.getEmpListForManager = async (idArray) => {
  return await EmployeeModel.find({ id: { $in: idArray } });
};

exports.uploadExcel = async (employeeDetails) => {
  const newEmployeeDetails = {
    id: employeeDetails.id ? String(employeeDetails.id) : '',
    name: employeeDetails.name || '',
    email: employeeDetails.email || '',
    person: employeeDetails.person || '',
    phonenumber: employeeDetails.phonenumber || '',
    dob: employeeDetails.dob || '',
    address: employeeDetails.address || '',
    gender: employeeDetails.gender || '',
    maritalstatus: employeeDetails.maritalstatus || '',
    hrpolicy: employeeDetails.hrpolicy || '',
    dateofjoining: employeeDetails.dateofjoining || '',
    punchid: employeeDetails.punchid || '',
    entrytime: employeeDetails.entrytime || '',
    company: employeeDetails.company || '',
    branch: employeeDetails.branch || '',
    designation: employeeDetails.designation || '',
    mobilenumber: employeeDetails.mobilenumber || '',
    reportingperson: employeeDetails.reportingperson || '',
    department: employeeDetails.department || '',
    role: employeeDetails.role || '',
    multibranchattendance: employeeDetails.multibranchattendance || '',
    shiftgroup: employeeDetails.shiftgroup || '',
    shift: employeeDetails.shift || '',
    punchtype: employeeDetails.punchtype || '',
    geolocation: employeeDetails.geolocation || '',
    leavetaken: parseInt(employeeDetails.leavetaken) || 0,
    leavepermitted: parseInt(employeeDetails.leavepermitted) || 0,
    hoursofwork: parseInt(employeeDetails.hoursofwork) || 0,
    ismanager: employeeDetails.ismanager || '',
    employeelist: employeeDetails.employeelist || [],
    entrytime: String(employeeDetails.entrytime) || '',
  };

  const newEmployee = await EmployeeModel.create(newEmployeeDetails);

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(String(employeeDetails.id), salt);

  await LoginModel.create({
    user: "Employee",
    id: String(employeeDetails.id),
    password: hash,
  });

  if (employeeDetails.reportingperson) {
    await EmployeeModel.findOneAndUpdate(
      { id: employeeDetails.reportingperson },
      { $push: { employeelist: newEmployee.id } }
    );
  }

  return newEmployee;
};