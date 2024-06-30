const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("./utils/MailSender");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));

const LoginModel = require("./models/LoginModel");
const LeaveModel = require("./models/LeaveModel");
const EmployeeModel = require("./models/EmployeeModel");
const AttendanceModel = require("./models/AttendanceModel");
const OTPModel = require("./models/OTPModel");
const RequestAttendanceModel = require("./models/RequestAttendanceModel");

mongoose
  .connect("mongodb://localhost:27017/attendance", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(3000, () => {
  console.log("Server is Running....port : 3000");
});

app.post("/", async (req, res) => {
  console.log(req.body);
  const { des, id, password } = req.body;

  try {
    const user = await LoginModel.findOne({ id: id, user: des });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password is incorrect" });
    }

    const payload = { id: id };
    const jwtToken = jwt.sign(payload, "attendanceProject");

    const employeeData = await EmployeeModel.findOne({ id: id });
    if (!employeeData) {
      return res.status(404).json({ msg: "Employee data not found" });
    }
    console.log(employeeData);
    res.status(200).json({
      jwtToken,
      msg: "Person present in DB",
      data: employeeData,
      person: des == "Employee" ? des : "Admin",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

app.post("/leaveform", async (request, response) => {
  const leaveDetails = request.body;
  await LeaveModel.create(leaveDetails)
    .then((res) => response.json(res))
    .catch((err) => response.status(400).send("Cannot Apply For Leave"));
});

app.get("/leavelist", (request, response) => {
  LeaveModel.find()
    .then((res) => response.json(res))
    .catch((err) => response.json(err));
});

app.post("/updateleave", (request, response) => {
  const { formId, currentStatus } = request.body;
  // console.log(currentStatus);
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  // console.log(currentDate);
  LeaveModel.findByIdAndUpdate(formId, {
    status: currentStatus,
    approvaldate: currentDate,
  })
    .then((res) => response.json(res))
    .catch((err) => response.status(400).send("Cannot Update Status"));
});

app.post("/addemployee", (request, response) => {
  const employeeDetails = request.body;
  console.log(employeeDetails);
  EmployeeModel.create(employeeDetails)
    .then((res) => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(employeeDetails.id, salt);
      LoginModel.create({
        user: "Employee",
        id: employeeDetails.id,
        password: hash,
      })
        .then((res) => response.json(res))
        .catch((err) => response.json(err));
    })
    .catch((err) => response.status(400).send("Cannot Create Employee"));
});

app.post("/getCheckInDetails", (request, response) => {
  const { id, date } = request.body;
  AttendanceModel.findOne({ id: id, date: date })
    .then((res) => response.json(res))
    .catch((err) => response.status(400).send("Cannot Update Checkin"));
});

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


app.post("/checkin", (request, response) => {
  const { id, date, checkintime, checkouttime, ...checkINDetails } = request.body;
  
  // Prepare the update object
  let updateObject = { 
    $push: { checkintime: checkintime },
    $set: { 
      ...checkINDetails, 
      ischeckedin: true, 
      ischeckedout: false 
    }
  };

  // Only push to checkouttime if it's not an empty string
  if (checkouttime && checkouttime !== '') {
    updateObject.$push.checkouttime = checkouttime;
  }

  AttendanceModel.findOneAndUpdate(
    { id: id, date: date },
    updateObject,
    { new: true, upsert: true } 
  )
    .then((res) => response.json(res))
    .catch((err) => response.status(400).send("Cannot Update Checkin"));
});

app.post("/checkout", (request, response) => {
  const { id, date, checkouttime } = request.body;
  console.log(checkouttime)
  AttendanceModel.findOneAndUpdate(
    { id: id, date: date },
    { 
      $push: { checkouttime: checkouttime },
      $set: { 
        ischeckedout: true, 
        ischeckedin: false
      }
    },
    { new: true }
  )
    .then((res) => {
      // Calculate total worked time
      const totalWorkedTime = calculateTotalWorkedTime(res.checkintime, res.checkouttime);
      
      // Update total worked time
      return AttendanceModel.findOneAndUpdate(
        { id: id, date: date },
        { $set: { totalWorkedTime: totalWorkedTime } },
        { new: true }
      );
    })
    .then((updatedRes) => response.json(updatedRes))
    .catch((err) => response.status(400).send("Cannot Update Checkout"));
});

function calculateTotalWorkedTime(checkinTimes, checkoutTimes) {
  let totalSeconds = 0;
  const minLength = Math.min(checkinTimes.length, checkoutTimes.length);
  
  for (let i = 0; i < minLength; i++) {
    if (checkinTimes[i] && checkoutTimes[i+1]) {
      const checkinSeconds = timeToSeconds(checkinTimes[i]);
      const checkoutSeconds = timeToSeconds(checkoutTimes[i+1]);
      totalSeconds += checkoutSeconds - checkinSeconds;
    }
  }
  
  return totalSeconds;
}

function timeToSeconds(timeString) {
  if (!timeString) return 0;
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}












app.post("/getAttendanceHistory", (request, response) => {
  const { id } = request.body;
  AttendanceModel.find({ id: id })
    .then((res) => response.json(res))
    .catch((err) => response.status(400).send("Cannot Update Checkin"));
});

app.post("/punchcheckin", async (req, res) => {
  try {
    const { punchid } = req.body;
    const employeeDetails = await EmployeeModel.findOne({ punchid });
    if (!employeeDetails) {
      return res.status(404).send("Employee not found");
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").split("/").join("-");

    const existingAttendance = await AttendanceModel.findOne({
      punchid,
      date: formattedDate,
    });
    if (existingAttendance) {
      return res.status(200).send("Already Checked In");
    }

    const timeString = now.toTimeString().split(" ")[0];

    const attendanceObj = {
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
      checkintime: timeString,
      checkouttime: "",
      location: employeeDetails.location,
      date: formattedDate,
      ischeckedin: true,
      ischeckedout: false,
    };

    const result = await AttendanceModel.create(attendanceObj);
    res.json(result);
  } catch (err) {
    res.status(500).send("Cannot Update Checkin");
  }
});

app.post("/punchcheckout", async (request, response) => {
  const { punchid } = request.body;

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-GB").split("/").join("-");
  const timeString = now.toTimeString().split(" ")[0];

  const existingAttendance = await AttendanceModel.findOne({
    punchid,
    date: formattedDate,
  });
  if (existingAttendance.ischeckedout) {
    return response.status(200).send("Already Checked Out");
  }

  AttendanceModel.findOneAndUpdate(
    { punchid: punchid, date: formattedDate },
    { checkouttime: timeString, ischeckedout: true },
    { new: true }
  )
    .then((res) => response.json(res))
    .catch((err) => response.status(400).send("Cannot Update Checkout"));
});

app.post("/currentleavecount", async (request, response) => {
  const { id } = request.body;
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

    // console.log('From Date Range:', fromDateStart, 'to', fromDateEnd);

    const count = await LeaveModel.countDocuments({
      id: id,
      fromdate: {
        $gte: fromDateStart,
        $lt: fromDateEnd,
      },
    });

    // console.log('Count of Documents:', count);
    response.status(200).send({ count: count });
  } catch (error) {
    // console.error('Error:', error);
    response.status(500).send({ message: "Internal Server Error" });
  }
});

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString().padStart(6, "0");
};

app.post("/checkuser", async (request, response) => {
  try {
    const { id } = request.body;
    const loginUser = await LoginModel.findOne({ id });

    if (!loginUser) {
      return response.status(400).send({ code: 400 });
    }

    const employeeData = await EmployeeModel.findOne({ id });
    const newOTP = generateOTP();

    await OTPModel.findOneAndUpdate(
      { userId: id },
      { otp: newOTP },
      { upsert: true, new: true }
    );

    await sendEmail({
      toMail: employeeData.email,
      otp: newOTP,
    });

    response.status(200).send({ code: 200 });
  } catch (error) {
    console.error("Error in /checkuser:", error);
    response.status(400).send({ code: 400 });
  }
});

app.post("/verifyotp", async (request, response) => {
  try {
    const { id, otp } = request.body;

    const otpRecord = await OTPModel.findOne({ userId: id });

    if (!otpRecord) {
      return response
        .status(400)
        .send({ code: 400, message: "No OTP found for this user" });
    }

    if (otp === otpRecord.otp) {
      // OTP is valid
      await OTPModel.deleteOne({ userId: id }); // Remove the OTP after successful verification
      return response
        .status(200)
        .send({ code: 200, message: "OTP verified successfully" });
    } else {
      return response.status(200).send({ code: 400, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error in /verifyotp:", error);
    response.status(500).send({ code: 500, message: "Internal server error" });
  }
});

app.post("/updatepassword", async (request, response) => {
  const { id, password } = request.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  await LoginModel.findOneAndUpdate(
    { id: id },
    { password: hash },
    { new: true }
  )
    .then((res) => {
      console.log(res);
      response.send({ message: "Password Successfully Updated" });
    })
    .catch((err) => {
      response.send({ message: "Password Not Updated" });
    });
});

app.post("/requestattendance", async (request, response) => {
  const requestDetails = request.body;
  await RequestAttendanceModel.create(requestDetails)
    .then((res) => {
      AttendanceModel.create(requestDetails)
        .then((res) => response.json(res))
        .catch((err) => response.status(400).send("Cannot Update Checkin"));
    })
    .catch((err) => response.status(400).send("Request Failed"));
});

app.get("/getrequestforms", (request, response) => {
  RequestAttendanceModel.find()
    .then((res) => response.json(res))
    .catch((err) => response.json(err));
});

app.post("/updateattendancerequest", async (request, response) => {
  const { formId, currentStatus } = request.body;

  if (currentStatus.toUpperCase() == "PERMITTED") {
    await RequestAttendanceModel.findByIdAndUpdate(formId, {
      status: currentStatus,
    })
      .then(async (res) => {
        await AttendanceModel.findOneAndUpdate(
          { id: res.id, date: res.date },
          { checkintime: res.time, ischeckedin: true, status: currentStatus },
          { new: true }
        )
          .then((res) => response.json(res))
          .catch((err) => response.status(400).send("Cannot Update Checkout"));
      })
      .catch((err) => response.status(400).send("Cannot Update Status"));
  } else {
    await RequestAttendanceModel.findByIdAndUpdate(formId, {
      status: currentStatus,
    })
      .then(async (res) => {
        await AttendanceModel.findOneAndUpdate(
          { id: res.id, date: res.date },
          { ischeckedin: false, status: currentStatus },
          { new: true }
        )
          .then((res) => response.json(res))
          .catch((err) => response.status(400).send("Cannot Update Checkout"));
      })
      .catch((err) => response.status(400).send("Cannot Update Status"));
  }
});

