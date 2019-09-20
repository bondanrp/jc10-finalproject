var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
const port = 3001;
const {
  getAllUserData,
  getUser,
  getUserName,
  registerUser,
  getUserEmail,
  getVideos
} = require("./src/database/index");

app.use(bodyParser());
app.use(cors());

app.get("/", (req, res) => {
  res.send(`<h1>Selamat datang di API Final Project Bondan JC10 JKT</h1>`);
});

// user db
app.get("/getalluserdata", getAllUserData);
app.get("/getusername", getUserName);
app.get("/getuser", getUser);
app.get("/getuseremail", getUserEmail);
app.post("/registeruser", registerUser);

// video db
app.get("/getvideos", getVideos);
// app.put("/edittodo", editTodo);
// app.put("/completeaction", kochengOren);
// app.delete("/deletetodo/:terserah", deleteTodo);

app.listen(port, console.log("Listening in port " + port));
