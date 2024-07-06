const mongoose = require('mongoose')

const employeeScheme = mongoose.Schema({
    id: String,
    name: String,
    email: String,
    person: String,
    phonenumber: String,
    dob: String,
    address: String,
    gender: String,
    maritalstatus: String,
    hrpolicy: String,
    dateofjoining: String,
    punchid: String,
    entrytime: String,
    company: String,
    branch: String,
    designation: String,
    mobilenumber: String,
    reportingperson: String,
    department: String,
    role: String,
    multibranchattendance: String,
    shiftgroup: String,
    shift: String,
    punchtype: String,
    geolocation: String,
    leavetaken: Number,
    leavepermitted: Number,
    hoursofwork: Number,
    ismanager: String,
    employeelist: [String]
})

const EmployeeModel = mongoose.model('employees', employeeScheme)

module.exports = EmployeeModel