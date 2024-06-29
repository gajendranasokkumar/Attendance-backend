const mongoose = require('mongoose')

const attendanceSchema = mongoose.Schema({
    id: String,
    name: String,
    person: String,
    punchid: String,
    status: String,
    company: String,
    branch: String,
    designation: String,
    multibranchattendance: String,
    shiftgroup: String,
    shift: String,
    punchtype: String,
    geolocation: String,
    checkintime: String,
    checkouttime: String,
    location: String,
    date: String,
    ischeckedin: Boolean,
    ischeckedout: Boolean,
    remainingtime: String
})

const AttendanceModel = mongoose.model('attendances', attendanceSchema)

module.exports = AttendanceModel