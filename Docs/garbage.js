
// app.get("/punch", async (req, res) => {
//   const { punchid } = req.body;

//   if (!punchid) {
//     return res.status(400).send("Missing punchid in request");
//   }

//   try {
//     const result = await AttendanceModel.aggregate([
//       {
//         $match: { punchid: punchid }, // Filter by the given punchid
//       },
//       {
//         $lookup: {
//           from: "employees", // Collection name to join
//           localField: "punchid", // Field in the Attendance collection
//           foreignField: "punchid", // Field in the Employees collection
//           as: "userDetails", // Name for the array field to be added to each output document
//         },
//       },
//       {
//         $unwind: "$userDetails", // Unwind the array to get a single document
//       },
//     ]);

//     res.send(result);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// app.post("/punchcheckin", async (request, response) => {
//   const { punchid } = request.body;
//   const employeeDetails = await EmployeeModel.findOne({ punchid: punchid });

//   const now = new Date();
//   // const day = String(now.getDate()).padStart(2, "0");
//   // const month = String(now.getMonth() + 1).padStart(2, "0");
//   // const year = now.getFullYear();
//   // const formattedDate = `${day}-${month}-${year}`;

//   // const hours = String(now.getHours()).padStart(2, "0");
//   // const minutes = String(now.getMinutes()).padStart(2, "0");
//   // const seconds = String(now.getSeconds()).padStart(2, "0");
//   // const timeString = `${hours}:${minutes}:${seconds}`;

//   const formattedDate = now.toLocaleDateString('en-GB').split('/').join('-');
//   const timeString = now.toTimeString().split(' ')[0];

//   const attendanceObj = {
//     id: employeeDetails?.id,
//     name: employeeDetails?.name,
//     person: employeeDetails?.person,
//     punchid: employeeDetails?.punchid,
//     company: employeeDetails?.company,
//     branch: employeeDetails?.branch,
//     designation: employeeDetails?.designation,
//     multibranchattendance: employeeDetails?.multibranchattendance,
//     shiftgroup: employeeDetails?.shiftgroup,
//     shift: employeeDetails?.shift,
//     punchtype: employeeDetails?.punchtype,
//     geolocation: employeeDetails?.geolocation,
//     checkintime: timeString,
//     checkouttime: "",
//     location: employeeDetails?.branch,
//     date: formattedDate,
//     ischeckedin: true,
//     ischeckedout: false,
//   };

//   AttendanceModel.create(attendanceObj)
//     .then((res) => response.json(res))
//     .catch((err) => response.status(400).send("Cannot Update Checkin"));
// });





// app.get('/fetch-data', async (req, res) => {
//     try {
//         // Use Promise.all to fetch data concurrently
//         const [dataA, dataB, dataC] = await Promise.all([
//             ModelA.findOne({}), // Adjust the query as needed
//             ModelB.findOne({}),
//             ModelC.findOne({})
//         ]);

//         res.json({
//             modelA: dataA,
//             modelB: dataB,
//             modelC: dataC
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching data', error });
//     }
// });







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