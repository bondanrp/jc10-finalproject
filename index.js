var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
const port = 3001;
const {
  getAllUserData,
  getUserName,
  login,
  registerUser,
  getUserEmail,
  getVideos,
  getRelatedVideos,
  getVideo,
  getEpisode,
  getUserVideos,
  uploadVideo,
  getCategories,
  getPreview
} = require("./src/database/index");

app.use(bodyParser());
app.use(cors());

app.get("/", (req, res) => {
  res.send(`<h1>Selamat datang di API Final Project Bondan JC10 JKT</h1>`);
});

// user db
app.get("/getalluserdata", getAllUserData);
app.get("/login", login);
app.get("/getusername", getUserName);
app.get("/getuseremail", getUserEmail);
app.post("/registeruser", registerUser);

// video db
app.get("/getvideos", getVideos);
app.get("/getvideo/:id", getVideo);
app.get("/getepisode", getEpisode);
app.get("/getrelatedvideos/", getRelatedVideos);
app.get("/getuservideos", getUserVideos);
app.get("/uploadvideo", uploadVideo);
app.get("/getcategories", getCategories);
app.get("/getpreview", getPreview);
// app.put("/edittodo", editTodo);
// app.put("/completeaction", kochengOren);
// app.delete("/deletetodo/:terserah", deleteTodo);

app.listen(port, console.log("Listening in port " + port));
