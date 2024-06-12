const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

const LoginModel = require("./models/LoginModel");

mongoose.connect("mongodb://localhost:27017/attendance");

app.listen(3000, () => {
  console.log("Server is Running....port : 3000");
});

app.post("/", (request, response) => {
  const { id, password } = request.body;

  //   const salt = bcrypt.genSaltSync(10);
  //   const hash = bcrypt.hashSync(password, salt);
  //   LoginModel.create({ ...request.body, password: hash })
  //     .then((res) => response.json(res))
  //     .catch((err) => response.json(err));

  LoginModel.findOne({ id: id })
    .then((res) => {
      if (bcrypt.compareSync(password, res.password)) {
        response.status(200)
        response.send("Person Present in DB");
        return response;
      } else {
        return response.status(400).send("Password is incorrect");
      }
    })
    .catch((err) => {
      response.send(err);
    });
});
