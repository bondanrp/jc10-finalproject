var express = require("express");
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
const port = 3001;
var multer = require("multer");
var fs = require("fs");
var mysql = require("mysql");
const {
  verify,
  updateDP,
  getAllUserData,
  getUserName,
  getTeacher,
  login,
  registerUser,
  getUserEmail,
  browseAll,
  getVideos,
  getRelatedVideos,
  getVideo,
  getEpisode,
  getUserVideos,
  getComments,
  postComment,
  sendCommentNotification,
  getNotifications,
  deleteNotification,
  deleteComment,
  search,
  searchTeachers,
  uploadVideo,
  getCategories,
  getPreview,
  getSubscription,
  countSubscribers,
  subscribedTeachers,
  isSubscribed,
  subscribe,
  unsubscribe,
  view
} = require("./src/database/index");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "assalamualaikum",
  database: "jc10_finalproject",
  port: 3307
});
app.use(bodyParser.json());
app.use(cors());
app.use("/files", express.static("./src/database/uploads"));

app.get("/", (req, res) => {
  res.send(`<h1>Selamat datang di API Final Project Bondan JC10 JKT</h1>`);
});

app.get("/verify", verify);
// user db
app.put("/updatedp", updateDP);
app.get("/getalluserdata", getAllUserData);
app.get("/getteacher", getTeacher);
app.get("/login", login);
app.get("/getusername", getUserName);
app.get("/getuseremail", getUserEmail);
app.post("/registeruser", registerUser);

// video db
app.get("/browseall", browseAll);
app.get("/getvideos", getVideos);
app.get("/getvideo/:id", getVideo);
app.get("/getepisode", getEpisode);
app.get("/getrelatedvideos/", getRelatedVideos);
app.get("/getuservideos", getUserVideos);
app.get("/getcomments", getComments);
app.post("/postcomment", postComment);
app.post("/sendcommentnotification", sendCommentNotification);
app.get("/getnotifications/:id", getNotifications);
app.delete("/deletenotification/:id", deleteNotification);
app.delete("/deletecomment/:id", deleteComment);
app.get("/uploadvideo", uploadVideo);
app.get("/getcategories", getCategories);
app.get("/getpreview", getPreview);
app.get("/search", search);
app.get("/searchteachers", searchTeachers);

// subscription db
app.get("/getsubscription/:id", getSubscription);
app.get("/countsubscribers/:id", countSubscribers);
app.get("/subscribedTeachers", subscribedTeachers);
app.get("/issubscribed", isSubscribed);
app.post("/subscribe", subscribe);
app.delete("/unsubscribe/:userid/:targetid", unsubscribe);
app.put("/view", view);

//multer
let multerStorageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/database/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `DP-${Date.now()}.${file.mimetype.split("/")[1]}`);
  }
});

let filterConfig = (req, file, cb) => {
  if (
    file.mimetype.split("/")[1] == "png" ||
    file.mimetype.split("/")[1] == "jpeg"
  ) {
    cb(null, true);
  } else {
    req.validation = { error: true, msg: "file must be an image" };
    cb(null, false);
  }
};

let upload = multer({
  storage: multerStorageConfig,
  fileFilter: filterConfig
});

app.post("/uploadimage", upload.single("profpict"), (req, res) => {
  try {
    if (req.validation) throw req.validation;
    if ((req.file, req.file.size > 5000000))
      throw { error: true, message: "file size exceeds the maximum limit" };
    let data = JSON.parse(req.body.data);
    db.query(
      `update users set profilepict = '${"http://localhost:3001/files/" +
        req.file.filename}' where username = '${data.username}'`,
      (err, result) => {
        if (err) throw err;
        res.send(req.file);
      }
    );
  } catch (error) {
    fs.unlinkSync(req.file.path);
    console.log(error);
  }
});

// mail
app.listen(port, console.log("Listening in port " + port));
