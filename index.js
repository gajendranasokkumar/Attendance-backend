const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

// app.post("/", (request, response) => {
//   const { id, password } = request.body;

//   // const salt = bcrypt.genSaltSync(10);
//   // const hash = bcrypt.hashSync(password, salt);
//   // LoginModel.create({ ...request.body, password: hash })
//   //   .then((res) => response.json(res))
//   //   .catch((err) => response.json(err));

//   LoginModel.findOne({ id: id })
//     .then((res) => {
//       if (bcrypt.compareSync(password, res.password)) {
//         const payload = {
//           id: id,
//         };
//         const jwtToken = jwt.sign(payload, "attendanceProject");
//         response.status(200);
//         LeaveModel.findById(id)
//           .then((res) => response.json(res))
//           .catch((err) => response.json(err));
//         response.send({ jwtToken, msg: "Person Present in DB" });
//         // response.send("Person Present in DB");
//         return response;
//       } else {
//         return response.status(400).send("Password is incorrect");
//       }
//     })
//     .catch((err) => {
//       response.send(err);
//     });
// });

app.post("/", async (req, res) => {
  // console.log(req.body)
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

    const employeeData = await EmployeeModel.findOne({id: id});
    if (!employeeData) {
      return res.status(404).json({ msg: "Employee data not found" });
    }
    // console.log(employeeData)
    res.status(200).json({
      jwtToken,
      msg: "Person present in DB",
      data: employeeData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

app.post("/leaveform", (request, response) => {
  const leaveDetails = request.body;
  LeaveModel.create(leaveDetails)
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
  LeaveModel.findByIdAndUpdate(formId, { status: currentStatus })
    .then((res) => response.json(res))
    .catch((err) => response.status(400).send("Cannot Update Status"));
});

app.post("/addemployee", (request, response) => {
  const employeeDetails = request.body;
  // console.log(employeeDetails);
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
