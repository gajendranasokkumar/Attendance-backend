const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/MailSender");
const routes = require('../routes');


const app = express();
app.use(express.json());

// const corsOptions = {
//   origin: "https://attendance-frontend-iota.vercel.app/",
//   // credentials: true,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   allowedHeaders: ["Content-Type", "Authorization"]
// };

// app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   next();
// });

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
//   next();
// });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const LoginModel = require("../models/LoginModel");
const LeaveModel = require("../models/LeaveModel");
const EmployeeModel = require("../models/EmployeeModel");
const AttendanceModel = require("../models/AttendanceModel");
const OTPModel = require("../models/OTPModel");
const RequestAttendanceModel = require("../models/RequestAttendanceModel");

require('dotenv').config();

const dbURI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI_PRODUCTION
    : process.env.MONGODB_URI_LOCAL;

mongoose
  .connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(3000, () => {
  console.log("Server is Running....port : 3000");
});

// app.get("/", (req, res) => {
//   res.send("Hello world");
// });

app.use('/', routes);


console.log("changed methods 1")

// app.post("/", async (req, res) => {
//   console.log(req.body);
//   const { des, id, password } = req.body;

//   try {
//     const user = await LoginModel.findOne({ id: id, user: des });
//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }
//     const isMatch = bcrypt.compareSync(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Password is incorrect" });
//     }

//     const payload = { id: id };
//     const jwtToken = jwt.sign(payload, "attendanceProject");

//     const employeeData = await EmployeeModel.findOne({ id: id });
//     if (!employeeData) {
//       return res.status(404).json({ msg: "Employee data not found" });
//     }
//     console.log(employeeData);
//     res.status(200).json({
//       jwtToken,
//       msg: "Person present in DB",
//       data: employeeData,
//       person: des == "Employee" ? des : "Admin",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// });

console.log("changed methods 2")

// app.post("/leaveform", async (request, response) => {
//   const leaveDetails = request.body;
//   await LeaveModel.create(leaveDetails)
//     .then((res) => response.json(res))
//     .catch((err) => response.status(400).send("Cannot Apply For Leave"));
// });

console.log("changed methods 3")

// app.get("/leavelist", (request, response) => {
//   LeaveModel.find()
//     .then((res) => response.json(res))
//     .catch((err) => response.json(err));
// });


console.log("changed methods 4")

// app.post("/updateleave", (request, response) => {
//   const { formId, currentStatus } = request.body;
//   // console.log(currentStatus);
//   const date = new Date();
//   let day = date.getDate();
//   let month = date.getMonth() + 1;
//   let year = date.getFullYear();
//   let currentDate = `${day}-${month}-${year}`;
//   // console.log(currentDate);
//   LeaveModel.findByIdAndUpdate(formId, {
//     status: currentStatus,
//     approvaldate: currentDate,
//   })
//     .then((res) => response.json(res))
//     .catch((err) => response.status(400).send("Cannot Update Status"));
// });

// app.post("/addemployee", (request, response) => {
//   const employeeDetails = request.body;
//   console.log(employeeDetails);
//   EmployeeModel.create(employeeDetails)
//     .then((res) => {
//       const salt = bcrypt.genSaltSync(10);
//       const hash = bcrypt.hashSync(employeeDetails.id, salt);
//       LoginModel.create({
//         user: "Employee",
//         id: employeeDetails.id,
//         password: hash,
//       })
//         .then((res) => response.json(res))
//         .catch((err) => response.json(err));
//     })
//     .catch((err) => response.status(400).send("Cannot Create Employee"));
// });


console.log("changed methods 5")


// app.post("/addemployee", async (request, response) => {
//   const employeeDetails = request.body;
//   console.log(employeeDetails);

//   try {
//     const newEmployee = await EmployeeModel.create(employeeDetails);

//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(employeeDetails.id, salt);

//     await LoginModel.create({
//       user: "Employee",
//       id: employeeDetails.id,
//       password: hash,
//     });

//     if (employeeDetails.reportingperson) {
//       await EmployeeModel.findOneAndUpdate(
//         {id : employeeDetails.reportingperson},
//         { $push: { employeelist: newEmployee.id } }
//       );
//     }

//     response.status(201).json(newEmployee);
//   } catch (err) {
//     console.error("Error creating employee:", err);
//     response.status(400).json({ error: "Cannot Create Employee", details: err.message });
//   }
// });


console.log("changed methods 6")

// app.post("/updateEmployee", async (request, response) => {
//   const { id, ...updateemp } = request.body;

//   try {
//     const currentEmployee = await EmployeeModel.findOne({ id: id });

//     if (!currentEmployee) {
//       return response.status(404).send({ message: "Employee not found" });
//     }

//     if (updateemp.reportingperson && updateemp.reportingperson !== currentEmployee.reportingperson) {
//       if (currentEmployee.reportingperson) {
//         await EmployeeModel.findOneAndUpdate(
//           { id: currentEmployee.reportingperson },
//           { $pull: { employeelist: id } }
//         );
//       }

//       await EmployeeModel.findOneAndUpdate(
//         { id: updateemp.reportingperson },
//         { $push: { employeelist: id } }
//       );
//     }

//     const updatedEmployee = await EmployeeModel.findOneAndUpdate(
//       { id: id },
//       updateemp,
//       { new: true }
//     );

//     response.send(updatedEmployee);
//   } catch (err) {
//     response.status(500).send(err);
//   }
// });

console.log("changed methods 11")

// app.delete("/deleteEmployee/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedEmployee = await EmployeeModel.findByIdAndDelete(id);

//     if (!deletedEmployee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     res.json({ message: "Employee deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

console.log("changed methods 12")

// app.post("/getCheckInDetails", (request, response) => {
//   const { id, date } = request.body;
//   AttendanceModel.findOne({ id: id, date: date })
//     .then((res) => response.json(res))
//     .catch((err) => response.status(400).send("Cannot Update Checkin"));
// });

// app.post("/checkin", (request, response) => {
//   const { id, date, ...checkINDetails } = request.body;
//   AttendanceModel.findOneAndUpdate(
//     { id: id, date: date },
//     // { ...checkINDetails, id, date },
//     { $set: checkINDetails },
//     { new: true, upsert: true }
//   )
//     .then((res) => response.json(res))
//     .catch((err) => response.status(400).send("Cannot Update Checkin"));
// });

// app.post("/checkout", (request, response) => {
//   const { id, date, checkouttime, ischeckedout } = request.body;
//   AttendanceModel.findOneAndUpdate(
//     { id: id, date: date },
//     { ...request.body },
//     { new: true }
//   )
//     .then((res) => response.json(res))
//     .catch((err) => response.status(400).send("Cannot Update Checkout"));
// });

console.log("changed methods 13")

// app.post("/checkin", (request, response) => {
//   const { id, date, checkintime, checkouttime, ...checkINDetails } =
//     request.body;

//   let updateObject = {
//     $push: { checkintime: checkintime },
//     $set: {
//       ...checkINDetails,
//       ischeckedin: true,
//       ischeckedout: false,
//     },
//   };

//   if (checkouttime && checkouttime !== "") {
//     updateObject.$push.checkouttime = checkouttime;
//   }

//   AttendanceModel.findOneAndUpdate({ id: id, date: date }, updateObject, {
//     new: true,
//     upsert: true,
//   })
//     .then((res) => response.json(res))
//     .catch((err) => response.status(400).send("Cannot Update Checkin"));
// });

console.log("changed methods 14")

// app.post("/checkout", (request, response) => {
//   const { id, date, checkouttime } = request.body;
//   AttendanceModel.findOneAndUpdate(
//     { id: id, date: date },
//     {
//       $push: { checkouttime: checkouttime },
//       $set: {
//         ischeckedout: true,
//         ischeckedin: false,
//       },
//     },
//     { new: true }
//   )
//     .then((res) => {
//       const totalWorkedTime = calculateTotalWorkedTime(
//         res.checkintime,
//         res.checkouttime
//       );

//       return AttendanceModel.findOneAndUpdate(
//         { id: id, date: date },
//         { $set: { totalWorkedTime: secondsToTimeString(totalWorkedTime) } },
//         { new: true }
//       );
//     })
//     .then((updatedRes) => response.json(updatedRes))
//     .catch((err) => response.status(400).send("Cannot Update Checkout"));
// });

// function calculateTotalWorkedTime(checkinTimes, checkoutTimes) {
//   let totalSeconds = 0;
//   const minLength = Math.min(checkinTimes.length, checkoutTimes.length);

//   for (let i = 0; i < minLength; i++) {
//     if (checkinTimes[i] && checkoutTimes[i]) {
//       const checkinSeconds = timeToSeconds(checkinTimes[i]);
//       const checkoutSeconds = timeToSeconds(checkoutTimes[i]);
//       totalSeconds += checkoutSeconds - checkinSeconds;
//     }
//   }

//   return totalSeconds;
// }

// function secondsToTimeString(seconds) {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const remainingSeconds = seconds % 60;
//   return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
//     2,
//     "0"
//   )}:${String(remainingSeconds).padStart(2, "0")}`;
// }

// function timeToSeconds(timeString) {
//   if (!timeString) return 0;
//   const [hours, minutes, seconds] = timeString.split(":").map(Number);
//   return hours * 3600 + minutes * 60 + seconds;
// }

console.log("changed methods 15")

// app.post("/getAttendanceHistory", (request, response) => {
//   const { id } = request.body;
//   AttendanceModel.find()
//     .then((res) => response.json(res))
//     .catch((err) => response.status(400).send("Cannot Update Checkin"));
// });

// app.post("/punchcheckin", async (req, res) => {
//   try {
//     const { punchid } = req.body;
//     const employeeDetails = await EmployeeModel.findOne({ punchid });
//     if (!employeeDetails) {
//       return res.status(404).send("Employee not found");
//     }

//     const now = new Date();
//     const formattedDate = now.toLocaleDateString("en-GB").split("/").join("-");

//     const existingAttendance = await AttendanceModel.findOne({
//       punchid,
//       date: formattedDate,
//     });
//     if (existingAttendance) {
//       return res.status(200).send("Already Checked In");
//     }

//     const timeString = now.toTimeString().split(" ")[0];

//     const attendanceObj = {
//       id: employeeDetails.id,
//       name: employeeDetails.name,
//       person: employeeDetails.person,
//       punchid: employeeDetails.punchid,
//       company: employeeDetails.company,
//       branch: employeeDetails.branch,
//       designation: employeeDetails.designation,
//       multibranchattendance: employeeDetails.multibranchattendance,
//       shiftgroup: employeeDetails.shiftgroup,
//       shift: employeeDetails.shift,
//       punchtype: employeeDetails.punchtype,
//       geolocation: employeeDetails.geolocation,
//       checkintime: timeString,
//       checkouttime: "",
//       location: employeeDetails.location,
//       date: formattedDate,
//       ischeckedin: true,
//       ischeckedout: false,
//     };

//     const result = await AttendanceModel.create(attendanceObj);
//     res.json(result);
//   } catch (err) {
//     res.status(500).send("Cannot Update Checkin");
//   }
// });

// app.post("/punchcheckout", async (request, response) => {
//   const { punchid } = request.body;

//   const now = new Date();
//   const formattedDate = now.toLocaleDateString("en-GB").split("/").join("-");
//   const timeString = now.toTimeString().split(" ")[0];

//   const existingAttendance = await AttendanceModel.findOne({
//     punchid,
//     date: formattedDate,
//   });
//   if (existingAttendance.ischeckedout) {
//     return response.status(200).send("Already Checked Out");
//   }

//   AttendanceModel.findOneAndUpdate(
//     { punchid: punchid, date: formattedDate },
//     { checkouttime: timeString, ischeckedout: true },
//     { new: true }
//   )
//     .then((res) => response.json(res))
//     .catch((err) => response.status(400).send("Cannot Update Checkout"));
// });

console.log("changed methods 16")

// app.post("/punchcheckin", async (req, res) => {
//   try {
//     const { punchid } = req.body;
//     const employeeDetails = await EmployeeModel.findOne({ punchid });
//     if (!employeeDetails) {
//       return res.status(404).send("Employee not found");
//     }

//     const now = new Date();
//     const formattedDate = now.toLocaleDateString("en-GB").split("/").join("-");
//     const timeString = now.toTimeString().split(" ")[0];

//     const existingAttendance = await AttendanceModel.findOne({
//       punchid,
//       date: formattedDate,
//     });

//     if (existingAttendance && existingAttendance.ischeckedin) {
//       return res.status(200).send("Already Checked In");
//     }

//     const updateObject = {
//       $push: { checkintime: timeString },
//       $set: {
//         id: employeeDetails.id,
//         name: employeeDetails.name,
//         person: employeeDetails.person,
//         punchid: employeeDetails.punchid,
//         company: employeeDetails.company,
//         branch: employeeDetails.branch,
//         designation: employeeDetails.designation,
//         multibranchattendance: employeeDetails.multibranchattendance,
//         shiftgroup: employeeDetails.shiftgroup,
//         shift: employeeDetails.shift,
//         punchtype: employeeDetails.punchtype,
//         geolocation: employeeDetails.geolocation,
//         location: employeeDetails.location,
//         date: formattedDate,
//         ischeckedin: true,
//         ischeckedout: false,
//       },
//     };

//     const result = await AttendanceModel.findOneAndUpdate(
//       { punchid, date: formattedDate },
//       updateObject,
//       { new: true, upsert: true }
//     );

//     res.json(result);
//   } catch (err) {
//     res.status(500).send("Cannot Update Checkin");
//   }
// });

console.log("changed methods 17")

// app.post("/punchcheckout", async (request, response) => {
//   try {
//     const { punchid } = request.body;

//     const now = new Date();
//     const formattedDate = now.toLocaleDateString("en-GB").split("/").join("-");
//     const timeString = now.toTimeString().split(" ")[0];

//     const existingAttendance = await AttendanceModel.findOne({
//       punchid,
//       date: formattedDate,
//     });

//     if (!existingAttendance) {
//       return response.status(404).send("No check-in record found");
//     }

//     if (existingAttendance.ischeckedout) {
//       return response.status(200).send("Already Checked Out");
//     }

//     const updatedAttendance = await AttendanceModel.findOneAndUpdate(
//       { punchid: punchid, date: formattedDate, ischeckedout: false },
//       {
//         $push: { checkouttime: timeString },
//         $set: {
//           ischeckedout: true,
//           ischeckedin: false,
//         },
//       },
//       { new: true }
//     );

//     if (!updatedAttendance) {
//       return response
//         .status(400)
//         .send("Cannot update checkout. Employee might not be checked in.");
//     }

//     const totalWorkedTime = calculateTotalWorkedTime(
//       updatedAttendance.checkintime,
//       updatedAttendance.checkouttime
//     );

//     const finalResult = await AttendanceModel.findOneAndUpdate(
//       { punchid: punchid, date: formattedDate },
//       { $set: { totalWorkedTime: secondsToTimeString(totalWorkedTime) } },
//       { new: true }
//     );

//     response.json(finalResult);
//   } catch (err) {
//     response.status(500).send("Cannot Update Checkout");
//   }
// });

console.log("changed methods 18")

// app.post("/currentleavecount", async (request, response) => {
//   const { id } = request.body;
//   try {
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth() + 1;
//     const currentYear = currentDate.getFullYear();

//     const fromDateStart = `${currentYear}-${currentMonth
//       .toString()
//       .padStart(2, "0")}-01`;
//     const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
//     const nextYear = nextMonth === 1 ? currentYear + 1 : currentYear;
//     const fromDateEnd = `${nextYear}-${nextMonth
//       .toString()
//       .padStart(2, "0")}-01`;

//     // console.log('From Date Range:', fromDateStart, 'to', fromDateEnd);

//     const count = await LeaveModel.countDocuments({
//       id: id,
//       fromdate: {
//         $gte: fromDateStart,
//         $lt: fromDateEnd,
//       },
//     });

//     // console.log('Count of Documents:', count);
//     response.status(200).send({ count: count });
//   } catch (error) {
//     // console.error('Error:', error);
//     response.status(500).send({ message: "Internal Server Error" });
//   }
// });

console.log("changed methods 19")

// const generateOTP = () => {
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   return otp.toString().padStart(6, "0");
// };

// app.post("/checkuser", async (request, response) => {
//   try {
//     const { id } = request.body;
//     const loginUser = await LoginModel.findOne({ id });

//     if (!loginUser) {
//       return response.status(400).send({ code: 400 });
//     }

//     const employeeData = await EmployeeModel.findOne({ id });
//     const newOTP = generateOTP();

//     await OTPModel.findOneAndUpdate(
//       { userId: id },
//       { otp: newOTP },
//       { upsert: true, new: true }
//     );

//     await sendEmail({
//       toMail: employeeData.email,
//       otp: newOTP,
//     });

//     response.status(200).send({ code: 200 });
//   } catch (error) {
//     console.error("Error in /checkuser:", error);
//     response.status(400).send({ code: 400 });
//   }
// });


console.log("changed methods 20")

// app.post("/verifyotp", async (request, response) => {
//   try {
//     const { id, otp } = request.body;

//     const otpRecord = await OTPModel.findOne({ userId: id });

//     if (!otpRecord) {
//       return response
//         .status(400)
//         .send({ code: 400, message: "No OTP found for this user" });
//     }

//     if (otp === otpRecord.otp) {
//       // OTP is valid
//       await OTPModel.deleteOne({ userId: id }); // Remove the OTP after successful verification
//       return response
//         .status(200)
//         .send({ code: 200, message: "OTP verified successfully" });
//     } else {
//       return response.status(200).send({ code: 400, message: "Invalid OTP" });
//     }
//   } catch (error) {
//     console.error("Error in /verifyotp:", error);
//     response.status(500).send({ code: 500, message: "Internal server error" });
//   }
// });

console.log("changed methods 21")

// app.post("/updatepassword", async (request, response) => {
//   const { id, password } = request.body;
//   const salt = bcrypt.genSaltSync(10);
//   const hash = bcrypt.hashSync(password, salt);
//   await LoginModel.findOneAndUpdate(
//     { id: id },
//     { password: hash },
//     { new: true }
//   )
//     .then((res) => {
//       console.log(res);
//       response.send({ message: "Password Successfully Updated" });
//     })
//     .catch((err) => {
//       response.send({ message: "Password Not Updated" });
//     });
// });

console.log("changed methods 22")

// app.post("/requestattendance", async (request, response) => {
//   const requestDetails = request.body;
//   await RequestAttendanceModel.create(requestDetails)
//     .then((res) => {
//       AttendanceModel.create(requestDetails)
//         .then((res) => response.json(res))
//         .catch((err) => response.status(400).send("Cannot Update Checkin"));
//     })
//     .catch((err) => response.status(400).send("Request Failed"));
// });

console.log("changed methods 23")

// app.get("/getrequestforms", (request, response) => {
//   RequestAttendanceModel.find()
//     .then((res) => response.json(res))
//     .catch((err) => response.json(err));
// });

console.log("changed methods 24")

// app.post("/updateattendancerequest", async (request, response) => {
//   const { formId, currentStatus } = request.body;

//   if (currentStatus.toUpperCase() == "PERMITTED") {
//     await RequestAttendanceModel.findByIdAndUpdate(formId, {
//       status: currentStatus,
//     })  
//       .then(async (res) => {
//         await AttendanceModel.findOneAndUpdate(
//           { id: res.id, date: res.date },
//           { checkintime: res.time, ischeckedin: true, status: currentStatus, checkouttime: [] },
//           { new: true }
//         )
//           .then((res) => response.json(res))
//           .catch((err) => response.status(400).send("Cannot Update Checkout"));
//       })
//       .catch((err) => response.status(400).send("Cannot Update Status"));
//   } else {
//     await RequestAttendanceModel.findByIdAndUpdate(formId, {
//       status: currentStatus,
//     })
//       .then(async (res) => {
//         await AttendanceModel.findOneAndUpdate(
//           { id: res.id, date: res.date },
//           { ischeckedin: false, status: currentStatus },
//           { new: true }
//         )
//           .then((res) => response.json(res))
//           .catch((err) => response.status(400).send("Cannot Update Checkout"));
//       })
//       .catch((err) => response.status(400).send("Cannot Update Status"));
//   }
// });

console.log("changed methods 7")

// app.get("/getAllEmployees", (request, response) => {
//   EmployeeModel.find()
//     .then((res) => response.send(res))
//     .catch((err) => response.send(err));
// });

console.log("changed methods 8")

// app.get("/fetchmanager", (request, response) => {
//   EmployeeModel.find({ismanager: "Yes"})
//   .then((res) => response.send(res))
//   .catch((err) => response.send(err))
// })

console.log("changed methods 9")

// app.post("/getEmpListForManager", (request, response) => {
//   const idArray = Array.isArray(request.body) ? request.body : [request.body];

//   EmployeeModel.find({ id: { $in: idArray } })
//     .then((employees) => response.send(employees))
//     .catch((err) => response.status(500).send(err));
// });

console.log("changed methods 10")

// app.post('/uploadexcel', async (req, response) => {
//   const employeeDetails = req.body;

//   const newEmployeeDetails = {
//     id: employeeDetails.id ? String(employeeDetails.id) : '',
//     name: employeeDetails.name || '',
//     email: employeeDetails.email || '',
//     person: employeeDetails.person || '',
//     phonenumber: employeeDetails.phonenumber || '',
//     dob: employeeDetails.dob || '',
//     address: employeeDetails.address || '',
//     gender: employeeDetails.gender || '',
//     maritalstatus: employeeDetails.maritalstatus || '',
//     hrpolicy: employeeDetails.hrpolicy || '',
//     dateofjoining: employeeDetails.dateofjoining || '',
//     punchid: employeeDetails.punchid || '',
//     entrytime: employeeDetails.entrytime || '',
//     company: employeeDetails.company || '',
//     branch: employeeDetails.branch || '',
//     designation: employeeDetails.designation || '',
//     mobilenumber: employeeDetails.mobilenumber || '',
//     reportingperson: employeeDetails.reportingperson || '',
//     department: employeeDetails.department || '',
//     role: employeeDetails.role || '',
//     multibranchattendance: employeeDetails.multibranchattendance || '',
//     shiftgroup: employeeDetails.shiftgroup || '',
//     shift: employeeDetails.shift || '',
//     punchtype: employeeDetails.punchtype || '',
//     geolocation: employeeDetails.geolocation || '',
//     leavetaken: parseInt(employeeDetails.leavetaken) || 0,
//     leavepermitted: parseInt(employeeDetails.leavepermitted) || 0,
//     hoursofwork: parseInt(employeeDetails.hoursofwork) || 0,
//     ismanager: employeeDetails.ismanager || '',
//     employeelist: employeeDetails.employeelist || [],
//     entrytime: String(employeeDetails.entrytime) || '',
//   };

//   console.log(newEmployeeDetails)

//   try {
//     const newEmployee = await EmployeeModel.create(newEmployeeDetails);

//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(String(employeeDetails.id), salt);

//     const respo = await LoginModel.create({
//       user: "Employee",
//       id: String(employeeDetails.id),
//       password: hash,
//     });

//     console.log(respo)

//     if (employeeDetails.reportingperson) {
//       await EmployeeModel.findOneAndUpdate(
//         { id: employeeDetails.reportingperson },
//         { $push: { employeelist: newEmployee.id } }
//       );
//     }

//     response.status(200).json({ message: 'Row data received and processed successfully' });
//   } catch (err) {
//     console.error("Error creating employee:", err);
//     response.status(400).json({ error: "Cannot Create Employee", details: err.message });
//   }
// });

console.log("changed methods 27")

// app.get('/getOptionsDetails', async (request, response) => {
//   try {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, '0');
//     const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const year = today.getFullYear();
//     const todayFormatted = `${day}-${month}-${year}`;
//     const todayMonthDay = `${month}-${day}`;

//     const strength = await EmployeeModel.countDocuments();

//     const birthday = await EmployeeModel.countDocuments({
//       $expr: {
//         $and: [
//           { $eq: [{ $substr: ["$dob", 5, 5] }, todayMonthDay] } 
//         ]
//       }
//     });

//     const atwork = await AttendanceModel.countDocuments({ 
//       date: todayFormatted,
//       $or: [
//         { $expr: { $gt: [{ $size: "$checkintime" }, 0] } }, 
//         { checkintime: { $type: "string" } }
//       ]
//     });        

//     const latein = await AttendanceModel.countDocuments({
//       date: todayFormatted,
//       $expr: {
//         $and: [
//           { $gt: [{ $size: "$checkintime" }, 0] },
//           { $gt: [{ $arrayElemAt: ["$checkintime", 0] }, "$entrytime"] }
//         ]
//       }
//     });

//     // const earlyout = await EmployeeModel.countDocuments({ status: 'earlyout' });

//     response.json({ strength, birthday, atwork, latein });
//   } catch (error) {
//     console.error('Error occurred:', error);
//     response.status(500).json({ error: 'Something went wrong' });
//   }
// });

console.log("changed methods 26")

// app.get('/getworkinghours', async (req, res) => {
//   const { weekStart, weekEnd, id } = req.query;
  
//   // console.log('Request Query:', req.query);

//   try {
//     const workingHours = await getWorkingHoursForWeek(weekStart, weekEnd, id);
//     res.json(workingHours);
//   } catch (error) {
//     console.error('Error fetching working hours:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// async function getWorkingHoursForWeek(weekStart, weekEnd, id) {
//   const startDate = new Date(weekStart);
//   const endDate = new Date(weekEnd);

//   // console.log('Date Range:', { startDate, endDate, id });

//   const documents = await AttendanceModel.find({
//     date: {
//       $gte: formatDateForQuery(startDate),
//       $lte: formatDateForQuery(endDate)
//     },
//     id: id,
//     status: { $not: { $regex: /^pending$/i } }
//   }).sort({ date: 1 });

//   // console.log('Documents:', documents);

//   const workingHours = {};
  
//   // Initialize workingHours object with all dates in the range
//   for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
//     workingHours[formatDateForQuery(d)] = 0;
//   }

//   documents.forEach(doc => {
//     const hours = convertToDecimalHours(doc.totalWorkedTime);
//     workingHours[doc.date] += hours;
//   });

//   return workingHours;
// }

// function formatDateForQuery(date) {
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// } 

// function convertToDecimalHours(timeString) {
//   if (!timeString) return 0; // Handle cases where totalWorkedTime might be missing
//   const [hours, minutes, seconds] = timeString.split(':').map(Number);
//   return hours + minutes / 60 + seconds / 3600;
// }

console.log("changed methods 25")

// app.get('/getattendancedetails', async (request, response) => {
//   const { id, month } = request.query;
//   console.log(id, month);

//   const startDate = new Date(`${month}-01`);
//   const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
//   console.log("Start Date:", startDate, "End Date:", endDate);

//   const finalresponse = [];

//   try {
//     const leavedocuments = await LeaveModel.find({
//       id: { $regex: new RegExp(`^${id}$`, 'i') },
//       status: { $regex: /^permitted$/i },
//       fromdate: { $ne: "" },
//       todate: { $ne: "" },
//       $expr: {
//         $and: [
//           { $gte: [{ $dateFromString: { dateString: "$fromdate", format: "%Y-%m-%d" } }, startDate] },
//           { $lte: [{ $dateFromString: { dateString: "$todate", format: "%Y-%m-%d" } }, endDate] }
//         ]
//       }
//     }).sort({ fromdate: 1 });

//     if (leavedocuments) {
//       for (let leave of leavedocuments) {
//         let currentDate = new Date(leave.fromdate);
//         const toDate = new Date(leave.todate);
        
//         while (currentDate <= toDate) {
//           finalresponse.push({ date: currentDate.toISOString().slice(0, 10), status: "Leave" });
//           currentDate.setDate(currentDate.getDate() + 1);
//         }
//       }
//     }

//     const documents = await AttendanceModel.find({
//       id: { $regex: new RegExp(`^${id}$`, 'i') },
//       status: { $not: { $regex: /^pending$/i } },
//       date: { $ne: "" },
//       $expr: {
//         $and: [
//           { $gte: [{ $dateFromString: { dateString: "$date", format: "%d-%m-%Y" } }, startDate] },
//           { $lte: [{ $dateFromString: { dateString: "$date", format: "%d-%m-%Y" } }, endDate] }
//         ]
//       }
//     }).sort({ date: 1 });

//     if (documents) {
//       for (let doc of documents) {
//         finalresponse.push({ date: doc.date.split('-').reverse().join('-'), status: "Present" });
//       }
//     }

//     console.log("Final Response:", finalresponse);
//     response.json(finalresponse);

//   } catch (error) {
//     console.error("Error fetching documents:", error);
//     response.status(500).send("Error fetching documents");
//   }
// });
