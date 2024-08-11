const LeaveModel = require("../models/LeaveModel");

exports.applyLeave = async (leaveDetails) => {
  return await LeaveModel.create(leaveDetails);
};

exports.getLeaveList = async () => {
  return await LeaveModel.find();
};

exports.getCurrentLeaveCount = async (id) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const fromDateStart = `${currentYear}-${currentMonth
      .toString()
      .padStart(2, "0")}-01`;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = nextMonth === 1 ? currentYear + 1 : currentYear;
    const fromDateEnd = `${nextYear}-${nextMonth
      .toString()
      .padStart(2, "0")}-01`;

    const count = await LeaveModel.countDocuments({
      id: id,
      fromdate: {
        $gte: fromDateStart,
        $lt: fromDateEnd,
      },
    });

    return { count: count };
  } catch (error) {
    throw new Error("Failed to get current leave count");
  }
};

exports.updateLeaveStatus = async (formId, currentStatus) => {
  const date = new Date();
  let currentDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  return await LeaveModel.findByIdAndUpdate(
    formId,
    {
      status: currentStatus,
      approvaldate: currentDate,
    },
    { new: true }
  );
};
