let controller = require("../controller/user");
let router = require("express").Router();

router.get("/getall", controller.getAllUsers);
router.post("/postcomment", controller.insertData);

module.exports = router;
