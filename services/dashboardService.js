const EmployeeModel = require('../models/EmployeeModel'); 
const AttendanceModel = require('../models/AttendanceModel'); 

exports.getOptionsDetails = async () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const todayFormatted = `${day}-${month}-${year}`;
  const todayMonthDay = `${month}-${day}`;

  const strength = await EmployeeModel.countDocuments();

  const birthday = await EmployeeModel.countDocuments({
    $expr: {
      $and: [
        { $eq: [{ $substr: ["$dob", 5, 5] }, todayMonthDay] } 
      ]
    }
  });

  const atwork = await AttendanceModel.countDocuments({ 
    date: todayFormatted,
    $or: [
      { $expr: { $gt: [{ $size: "$checkintime" }, 0] } }, 
      { checkintime: { $type: "string" } }
    ]
  });        

  const latein = await AttendanceModel.countDocuments({
    date: todayFormatted,
    $expr: {
      $and: [
        { $gt: [{ $size: "$checkintime" }, 0] },
        { $gt: [{ $arrayElemAt: ["$checkintime", 0] }, "$entrytime"] }
      ]
    }
  });

  return { strength, birthday, atwork, latein };
}