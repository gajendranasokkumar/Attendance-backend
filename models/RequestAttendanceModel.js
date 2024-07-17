const mongoose = require('mongoose')

const requestAttendanceSchema = mongoose.Schema({
    id: String,
    name: String,
    reportingperson: String,
    date: String,
    time: String,
    reason: String,
    status: String,
    company: String,
    person: String,
    punchid: String,
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
    ischeckedin: Boolean,
    ischeckedout: Boolean,
    entrytime: String
})

const RequestAttendanceModel = mongoose.model('attendancerequests', requestAttendanceSchema)

module.exports = RequestAttendanceModel