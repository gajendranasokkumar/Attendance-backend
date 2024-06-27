const mongoose = require('mongoose')

const leaveSchema = mongoose.Schema({
    id: String,
    name: String,
    approvaldate: String,
    leavetype: String,
    halfleave:String,
    paidleave: String,
    fromdate: String,
    todate: String,
    reason: String,
    status: String,
    reportingperson: String,
    leavepermitted: String,
    leavetaken: String
})

const LeaveModel = mongoose.model('leaveForms', leaveSchema)

module.exports = LeaveModel