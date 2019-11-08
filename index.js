var express = require("express");
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
const port = process.env.PORT || 3001;
var multer = require("multer");
var fs = require("fs");
var mysql = require("mysql");
var jwt = require("jsonwebtoken");
const {
  //contact
  contact,
  //profile
  verify,
  updateProfile,
  getUserName,
  getTeacher,
  login,
  registerUser,
  getUserEmail,
  //video
  browseAll,
  getVideos,
  deleteVideo,
  updateVideo,
  getRelatedVideos,
  getVideo,
  getFeaturedVideos,
  getEpisode,
  getUserVideos,
  //comments
  getComments,
  postComment,
  sendCommentNotification,
  getNotifications,
  clearSeen,
  deleteNotification,
  deleteComment,
  search,
  searchTeachers,
  getCategories,
  getClass,
  getPreview,
  //subscription
  getSubscription,
  countSubscribers,
  subscribedTeachers,
  subscribedUsers,
  isSubscribed,
  subscribe,
  unsubscribe,
  view,
  //upload
  uploadVideoData,
  sendUploadNotification,
  //admin
  registerTeacher,
  registerTeacherNotification,
  registerPremium,
  registerPremiumNotification,
  getUserData,
  getVideoData,
  premiumize,
  getPayments,
  makeTeacher,
  acceptPayment,
  deletePayment,
  resetStatus
} = require("./src/database/index");
var appKey = "rahasia";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "jc10_finalproject"
});
//contoh kalau pakai hosting database
// const db = mysql.createConnection({
//   host: "db4free.net",
//   user: "bondanrp",
//   password: "assalamualaikum",
//   database: "jc10finalproject"
// });
app.use(bodyParser.json());
app.use(cors());
app.use("/files", express.static("./src/database/uploads"));

app.get("/", (req, res) => {
  res.send(`<h1>Selamat datang di API Final Project Bondan JC10 JKT</h1>`);
});

//token
app.post("/gettoken", (req, res) => {
  let { username, email } = req.body;
  let token = jwt.sign({ username, email }, appKey, { expiresIn: "12h" });
  console.log(token);
  res.send({
    username,
    email,
    token
  });
});

app.get(
  "/verifytoken",
  (req, res, next) => {
    if (req.method !== "OPTIONS") {
      // let success = true
      console.log(req.headers.authorization);
      jwt.verify(req.headers.authorization, appKey, (error, decoded) => {
        if (error) {
          // success = false
          return res.status(401).json({
            message: "User not authorized.",
            error: "User not authorized."
          });
        }
        console.log({ decoded });
        req.user = decoded;
        next();
      });
    } else {
      console.log({ decoded });
      req.user = decoded;
      next();
    }
  },
  (req, res) => {
    res.send("User authorized");
  }
);

app.get("/contact", contact);
app.get("/verify", verify);
// user db
app.patch("/updateprofile", updateProfile);
app.get("/getteacher", getTeacher);
app.get("/login", login);
app.get("/getusername", getUserName);
app.get("/getuseremail", getUserEmail);
app.post("/registeruser", registerUser);

// video db
app.get("/browseall", browseAll);
app.get("/getvideos", getVideos);
app.delete("/deletevideo/:id", deleteVideo);
app.patch("/updatevideo/", updateVideo);
app.get("/getfeaturedvideos", getFeaturedVideos);
app.get("/getvideo/:author/:class/:episode", getVideo);
app.get("/getepisode", getEpisode);
app.get("/getrelatedvideos/", getRelatedVideos);
app.get("/getuservideos", getUserVideos);
app.get("/getcomments", getComments);
app.post("/postcomment", postComment);
app.post("/sendcommentnotification", sendCommentNotification);
app.patch("/clearseen", clearSeen);
app.get("/getnotifications/:id", getNotifications);
app.delete("/deletenotification/:id", deleteNotification);
app.delete("/deletecomment/:id", deleteComment);
app.get("/getcategories", getCategories);
app.get("/getclass", getClass);
app.get("/getpreview", getPreview);
app.get("/search", search);
app.get("/searchteachers", searchTeachers);

// subscription db
app.get("/getsubscription/:id", getSubscription);
app.get("/countsubscribers/:id", countSubscribers);
app.get("/subscribedTeachers", subscribedTeachers);
app.get("/subscribedusers", subscribedUsers);
app.get("/issubscribed", isSubscribed);
app.post("/subscribe", subscribe);
app.delete("/unsubscribe/:userid/:targetid", unsubscribe);
app.put("/view", view);

//upload db
app.post("/uploadvideodata", uploadVideoData);
app.post("/senduploadnotification", sendUploadNotification);

//admin
app.post("/registerteacher", registerTeacher);
app.post("/registerteachernotification", registerTeacherNotification);
app.post("/registerpremium", registerPremium);
app.post("/registerpremiumnotification", registerPremiumNotification);
app.get("/getuserdata", getUserData);
app.get("/getvideodata", getVideoData);
app.patch("/premiumize", premiumize);
app.get("/getpayments", getPayments);
app.patch("/maketeacher", makeTeacher);
app.patch("/acceptpayment", acceptPayment);
app.patch("/deletepayment", deletePayment);
app.patch("/resetstatus", resetStatus);

//multer
let multerStorageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/database/uploads/DP");
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
      `update users set profilepict = '${"http://localhost:3001/files/DP/" +
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

//VIDEO
let multerStorageConfigVideo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/database/uploads/video");
  },
  filename: (req, file, cb) => {
    cb(null, `VID-${Date.now()}.${file.mimetype.split("/")[1]}`);
  }
});

let filterConfigVideo = (req, file, cb) => {
  if (file.mimetype.split("/")[1] == "mp4") {
    cb(null, true);
  } else {
    req.validation = { error: true, msg: "file format must be mp4" };
    cb(null, false);
  }
};

let uploadVideo = multer({
  storage: multerStorageConfigVideo,
  fileFilter: filterConfigVideo
});

app.post("/uploadvideo", uploadVideo.single("video"), (req, res) => {
  try {
    if (req.validation) throw req.validation;
    res.send(req.file);
  } catch (error) {
    console.log(error);
  }
});
//Thumbnail
let multerStorageConfigThumbnail = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/database/uploads/video");
  },
  filename: (req, file, cb) => {
    cb(null, `THUMB-${Date.now()}.${file.mimetype.split("/")[1]}`);
  }
});

let filterConfigThumbnail = (req, file, cb) => {
  if (
    file.mimetype.split("/")[1] === "jpeg" ||
    file.mimetype.split("/")[1] === "png"
  ) {
    cb(null, true);
  } else {
    req.validation = { error: true, msg: "file format must be jpg/png" };
    cb(null, false);
  }
};

let uploadThumbnail = multer({
  storage: multerStorageConfigThumbnail,
  fileFilter: filterConfigThumbnail
});

app.post(
  "/uploadthumbnail",
  uploadThumbnail.single("thumbnail"),
  (req, res) => {
    try {
      if (req.validation) throw req.validation;
      res.send(req.file);
    } catch (error) {
      console.log(error);
    }
  }
);
//CV
let multerStorageConfigCV = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/database/uploads/cv");
  },
  filename: (req, file, cb) => {
    cb(null, `CV-${Date.now()}.${file.mimetype.split("/")[1]}`);
  }
});

let filterConfigCV = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    req.validation = { error: true, msg: "file format must be PDF" };
    cb(null, false);
  }
};

let uploadCV = multer({
  storage: multerStorageConfigCV,
  fileFilter: filterConfigCV
});

app.post("/uploadcv", uploadCV.single("cv"), (req, res) => {
  try {
    if (req.validation) throw req.validation;
    res.send(req.file);
  } catch (error) {
    console.log(error);
  }
});

// buktitransfer
let multerStorageConfigPayment = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/database/uploads/payment");
  },
  filename: (req, file, cb) => {
    cb(null, `PAY-${Date.now()}.${file.mimetype.split("/")[1]}`);
  }
});

let filterConfigPayment = (req, file, cb) => {
  if (
    file.mimetype.split("/")[1] === "jpeg" ||
    file.mimetype.split("/")[1] === "png"
  ) {
    cb(null, true);
  } else {
    req.validation = { error: true, msg: "file format must be jpg/png" };
    cb(null, false);
  }
};

let uploadPayment = multer({
  storage: multerStorageConfigPayment,
  fileFilter: filterConfigPayment
});

app.post("/uploadpayment", uploadPayment.single("payment"), (req, res) => {
  try {
    if (req.validation) throw req.validation;
    res.send(req.file);
    console.log(req.file.path);
  } catch (error) {
    console.log(error);
  }
});
// mail
app.listen(port, console.log("Listening in port " + port));
