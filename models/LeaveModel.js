import mongoose from "mongoose";

const leaveSchema = mongoose.Schema({
    id: String,
    name: String,
    leavetype: String,
    halfleave:String,
    paidleave: String,
    fromdate: Date,
    todate: Date,
    reason: String
})

const LeaveModel = mongoose.model('leaveForms', leaveSchema)

module.exports = LeaveModel