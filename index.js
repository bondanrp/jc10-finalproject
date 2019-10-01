var express = require("express");
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
const port = 3001;
var multer = require("multer");
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
  search,
  uploadVideo,
  getCategories,
  getPreview,
  getSubscription,
  subscribedTeachers,
  isSubscribed,
  subscribe,
  unsubscribe,
  view
} = require("./src/database/index");

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
app.get("/uploadvideo", uploadVideo);
app.get("/getcategories", getCategories);
app.get("/getpreview", getPreview);
app.get("/search", search);

// subscription db
app.get("/getsubscription/:id", getSubscription);
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

app.post("/uploadimage", upload.single("aneh"), (req, res) => {
  console.log(req.file.destination + "/" + req.file.filename);
  res.send(req.file);
});

// mail
app.listen(port, console.log("Listening in port " + port));
