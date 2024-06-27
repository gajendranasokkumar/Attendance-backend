const mongoose = require('mongoose')

const requestAttendanceSchema = mongoose.Schema({
    id: String,
    name: String,
    reportingperson: String,
    date: String,
    time: String,
    reason: String,
    status: String,
})

const RequestAttendanceModel = mongoose.model('attendancerequests', requestAttendanceSchema)

module.exports = RequestAttendanceModel