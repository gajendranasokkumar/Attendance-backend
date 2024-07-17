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
    checkintime: {
        type: [String],
        default: []
    },
    checkouttime: {
        type: [String],
        default: []
    },
    location: String,
    date: String,
    ischeckedin: Boolean,
    ischeckedout: Boolean,
    totalWorkedTime: String,
    hoursofwork: String,
    entrytime: String
})

const AttendanceModel = mongoose.model('attendances', attendanceSchema)

module.exports = AttendanceModel