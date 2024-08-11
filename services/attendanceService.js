const AttendanceModel = require("../models/AttendanceModel");
const EmployeeModel = require("../models/EmployeeModel");
const LeaveModel = require("../models/LeaveModel");
const RequestAttendanceModel = require("../models/RequestAttendanceModel");

exports.getCheckInDetails = async ({ id, date }) => {
  return await AttendanceModel.findOne({ id: id, date: date });
};

exports.checkIn = async (
  id,
  date,
  checkintime,
  checkouttime,
  checkINDetails
) => {
  let updateObject = {
    $push: { checkintime: checkintime },
    $set: {
      ...checkINDetails,
      ischeckedin: true,
      ischeckedout: false,
    },
  };

  if (checkouttime && checkouttime !== "") {
    updateObject.$push.checkouttime = checkouttime;
  }

  return await AttendanceModel.findOneAndUpdate(
    { id: id, date: date },
    updateObject,
    { new: true, upsert: true }
  );
};

exports.checkOut = async ({ id, date, checkouttime }) => {
  const updatedAttendance = await AttendanceModel.findOneAndUpdate(
    { id: id, date: date },
    {
      $push: { checkouttime: checkouttime },
      $set: {
        ischeckedout: true,
        ischeckedin: false,
      },
    },
    { new: true }
  );

  const totalWorkedTime = calculateTotalWorkedTime(
    updatedAttendance.checkintime,
    updatedAttendance.checkouttime
  );

  return await AttendanceModel.findOneAndUpdate(
    { id: id, date: date },
    { $set: { totalWorkedTime: secondsToTimeString(totalWorkedTime) } },
    { new: true }
  );
};

function calculateTotalWorkedTime(checkinTimes, checkoutTimes) {
  let totalSeconds = 0;
  const minLength = Math.min(checkinTimes.length, checkoutTimes.length);

  for (let i = 0; i < minLength; i++) {
    if (checkinTimes[i] && checkoutTimes[i]) {
      const checkinSeconds = timeToSeconds(checkinTimes[i]);
      const checkoutSeconds = timeToSeconds(checkoutTimes[i]);
      totalSeconds += checkoutSeconds - checkinSeconds;
    }
  }

  return totalSeconds;
}

function secondsToTimeString(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(2, "0")}`;
}

function timeToSeconds(timeString) {
  if (!timeString) return 0;
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

exports.getAttendanceHistory = async () => {
  return await AttendanceModel.find();
};

exports.punchCheckIn = async ({ punchid }) => {
  const employeeDetails = await EmployeeModel.findOne({ punchid });
  if (!employeeDetails) {
    throw new Error("Employee not found");
  }

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-GB").split("/").join("-");
  const timeString = now.toTimeString().split(" ")[0];

  const existingAttendance = await AttendanceModel.findOne({
    punchid,
    date: formattedDate,
  });

  if (existingAttendance && existingAttendance.ischeckedin) {
    return "Already Checked In";
  }

  const updateObject = {
    $push: { checkintime: timeString },
    $set: {
      id: employeeDetails.id,
      name: employeeDetails.name,
      person: employeeDetails.person,
      punchid: employeeDetails.punchid,
      company: employeeDetails.company,
      branch: employeeDetails.branch,
      designation: employeeDetails.designation,
      multibranchattendance: employeeDetails.multibranchattendance,
      shiftgroup: employeeDetails.shiftgroup,
      shift: employeeDetails.shift,
      punchtype: employeeDetails.punchtype,
      geolocation: employeeDetails.geolocation,
      location: employeeDetails.location,
      date: formattedDate,
      ischeckedin: true,
      ischeckedout: false,
    },
  };

  return await AttendanceModel.findOneAndUpdate(
    { punchid, date: formattedDate },
    updateObject,
    { new: true, upsert: true }
  );
};

exports.punchCheckOut = async ({ punchid }) => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-GB").split("/").join("-");
  const timeString = now.toTimeString().split(" ")[0];

  const existingAttendance = await AttendanceModel.findOne({
    punchid,
    date: formattedDate,
  });

  if (!existingAttendance) {
    throw new Error("No check-in record found");
  }

  if (existingAttendance.ischeckedout) {
    return "Already Checked Out";
  }

  const updatedAttendance = await AttendanceModel.findOneAndUpdate(
    { punchid: punchid, date: formattedDate, ischeckedout: false },
    {
      $push: { checkouttime: timeString },
      $set: {
        ischeckedout: true,
        ischeckedin: false,
      },
    },
    { new: true }
  );

  if (!updatedAttendance) {
    throw new Error(
      "Cannot update checkout. Employee might not be checked in."
    );
  }

  const totalWorkedTime = calculateTotalWorkedTime(
    updatedAttendance.checkintime,
    updatedAttendance.checkouttime
  );

  return await AttendanceModel.findOneAndUpdate(
    { punchid: punchid, date: formattedDate },
    { $set: { totalWorkedTime: secondsToTimeString(totalWorkedTime) } },
    { new: true }
  );
};

exports.requestAttendance = async (requestDetails) => {
  const createdRequest = await RequestAttendanceModel.create(requestDetails);
  return await AttendanceModel.create(requestDetails);
};

exports.getRequestForms = async () => {
  return await RequestAttendanceModel.find();
};

exports.permitAttendance = async (formId, currentStatus) => {
  try {
    const updatedRequest = await RequestAttendanceModel.findByIdAndUpdate(
      formId,
      { status: currentStatus },
      { new: true } 
    );

    if (!updatedRequest) {
      throw new Error("Cannot Update Status");
    }

    const updatedAttendance = await AttendanceModel.findOneAndUpdate(
      { id: updatedRequest.id, date: updatedRequest.date },
      {
        checkintime: updatedRequest.time,
        ischeckedin: true,
        status: currentStatus,
        checkouttime: [],
      },
      { new: true } 
    );

    if (!updatedAttendance) {
      throw new Error("Cannot Update Checkout");
    }

    return updatedAttendance;
  } catch (error) {
    throw error; 
  }
};

exports.rejectAttendance = async (formId, currentStatus) => {
  try {
    const updatedRequest = await RequestAttendanceModel.findByIdAndUpdate(
      formId,
      { status: currentStatus },
      { new: true } 
    );

    if (!updatedRequest) {
      throw new Error("Cannot Update Status");
    }

    const updatedAttendance = await AttendanceModel.findOneAndUpdate(
      { id: updatedRequest.id, date: updatedRequest.date },
      {
        ischeckedin: false,
        status: currentStatus,  
      },
      { new: true } 
    );

    if (!updatedAttendance) {
      throw new Error("Cannot Update Checkout");
    }

    return updatedAttendance;
  } catch (error) {
    throw error; 
  }
};

exports.getAttendanceDetails = async (id, month) => {
  const startDate = new Date(`${month}-01`);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  const finalResponse = [];

  try {
    const leaveDocuments = await LeaveModel.find({
      id: { $regex: new RegExp(`^${id}$`, 'i') },
      status: { $regex: /^permitted$/i },
      fromdate: { $ne: "" },
      todate: { $ne: "" },
      $expr: {
        $and: [
          { $gte: [{ $dateFromString: { dateString: "$fromdate", format: "%Y-%m-%d" } }, startDate] },
          { $lte: [{ $dateFromString: { dateString: "$todate", format: "%Y-%m-%d" } }, endDate] }
        ]
      }
    }).sort({ fromdate: 1 });

    if (leaveDocuments) {
      for (let leave of leaveDocuments) {
        let currentDate = new Date(leave.fromdate);
        const toDate = new Date(leave.todate);

        while (currentDate <= toDate) {
          finalResponse.push({ date: currentDate.toISOString().slice(0, 10), status: "Leave" });
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }

    const documents = await AttendanceModel.find({
      id: { $regex: new RegExp(`^${id}$`, 'i') },
      status: { $not: { $regex: /^pending$/i } },
      date: { $ne: "" },
      $expr: {
        $and: [
          { $gte: [{ $dateFromString: { dateString: "$date", format: "%d-%m-%Y" } }, startDate] },
          { $lte: [{ $dateFromString: { dateString: "$date", format: "%d-%m-%Y" } }, endDate] }
        ]
      }
    }).sort({ date: 1 });

    if (documents) {
      for (let doc of documents) {
        finalResponse.push({ date: doc.date.split('-').reverse().join('-'), status: "Present" });
      }
    }

    return finalResponse;

  } catch (error) {
    throw new Error("Error fetching documents");
  }
};

exports.getWorkingHoursForWeek = async (weekStart, weekEnd, id) => {
  const startDate = new Date(weekStart);
  const endDate = new Date(weekEnd);

  const documents = await AttendanceModel.find({
    date: {
      $gte: formatDateForQuery(startDate),
      $lte: formatDateForQuery(endDate)
    },
    id: id,
    status: { $not: { $regex: /^pending$/i } }
  }).sort({ date: 1 });

  const workingHours = {};
  
  // Initialize workingHours object with all dates in the range
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    workingHours[formatDateForQuery(d)] = 0;
  }

  documents.forEach(doc => {
    const hours = convertToDecimalHours(doc.totalWorkedTime);
    workingHours[doc.date] += hours;
  });

  return workingHours;
}

function formatDateForQuery(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
} 

function convertToDecimalHours(timeString) {
  if (!timeString) return 0;
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours + minutes / 60 + seconds / 3600;
}